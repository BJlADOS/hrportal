terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
}

provider "yandex" {
  token     = var.iam_token
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = "ru-central1-b"
}

# TODO create VPC by Terraform
# TODO create Postgres DB by Terraform

### Editor Service Account ###

resource "yandex_iam_service_account" "editor" {
  name = "${local.common_prefix}-editor"
}

resource "yandex_resourcemanager_folder_iam_member" "editor" {
  member    = "serviceAccount:${yandex_iam_service_account.editor.id}"
  role      = "storage.editor"
  folder_id = var.folder_id
}

resource "yandex_iam_service_account_static_access_key" "editor-key" {
  service_account_id = yandex_iam_service_account.editor.id
  description        = "for object storage"
}

### Django Service Account ###

resource "yandex_iam_service_account" "django" {
  name = "${local.common_prefix}-django"
}

resource "yandex_resourcemanager_folder_iam_member" "django" {
  member    = "serviceAccount:${yandex_iam_service_account.django.id}"
  role      = "storage.editor"
  folder_id = var.folder_id
}

resource "yandex_iam_service_account_static_access_key" "django-key" {
  service_account_id = yandex_iam_service_account.django.id
  description        = "for object storage"
}

### Gateway Service Account ###

resource "yandex_iam_service_account" "gateway" {
  name = "${local.common_prefix}-gateway"
}

resource "yandex_resourcemanager_folder_iam_member" "gateway" {
  member    = "serviceAccount:${yandex_iam_service_account.gateway.id}"
  role      = "storage.viewer"
  folder_id = var.folder_id
}

### Object Storage ###

resource "yandex_storage_bucket" "media" {
  bucket     = "${local.common_prefix}-media"
  access_key = yandex_iam_service_account_static_access_key.editor-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.editor-key.secret_key
}

// TODO automatically upload site files
// TODO run python manage.py collectstatic

resource "yandex_storage_bucket" "static" {
  bucket     = "${local.common_prefix}-static"
  access_key = yandex_iam_service_account_static_access_key.editor-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.editor-key.secret_key
}

### Certificate Manager ###

resource "yandex_cm_certificate" "hrportal" {
  name    = local.cert_name
  domains = [local.domain]

  managed {
    challenge_type = "DNS_CNAME"
  }
}

output "dns_challenge_cname" {
  value = "${yandex_cm_certificate.hrportal.challenges[0].dns_name}=${yandex_cm_certificate.hrportal.challenges[0].dns_value}"
}

### Container Registry ###

# TODO Push image automatically

resource "yandex_container_registry" "hrportal" {
  name      = "${local.common_prefix}-registry"
  folder_id = var.folder_id
}

resource "yandex_container_registry_iam_binding" "puller" {
  registry_id = yandex_container_registry.hrportal.id
  role        = "container-registry.images.puller"

  members = [
    "serviceAccount:${yandex_iam_service_account.django.id}",
  ]
}

output "django_image_tag" {
  value = "cr.yandex/${yandex_container_registry.hrportal.id}/${local.django_container_tag}"
}

### Serverless Container ###

resource "yandex_serverless_container" "django" {
  name               = "${local.common_prefix}-django-container"
  cores              = 1
  memory             = 1024
  service_account_id = yandex_iam_service_account.django.id
  image {
    url         = "cr.yandex/${yandex_container_registry.hrportal.id}/${local.django_container_tag}"
    environment = {
      DEBUG      = "True"
      # TODO Transfer some variables to secrets
      SECRET_KEY = var.django_secret_key

      ### CORS settings ###
      ALLOWED_HOSTS = yandex_cm_certificate.hrportal.domains[0]
      DJANGO_URL    = "https://${yandex_cm_certificate.hrportal.domains[0]}"

      ### Database settings ###
      POSTGRES_HOST     = var.db_host # TODO set Postgres DB host
      POSTGRES_PORT     = local.db_port # TODO set Postgres DB port
      POSTGRES_DB_NAME  = local.db_name
      POSTGRES_USER     = var.db_user_name
      POSTGRES_PASSWORD = var.db_user_password
      POSTGRES_SSLMODE  = "require"

      ### Storage settings ###
      REMOTE_STORAGE     = "True"
      S3_ENDPOINT_URL    = "https://storage.yandexcloud.net"
      MEDIA_BUCKET_NAME  = yandex_storage_bucket.media.id
      STATIC_BUCKET_NAME = yandex_storage_bucket.static.id
      # Service account #
      ACCESS_KEY_ID      = yandex_iam_service_account_static_access_key.django-key.access_key
      SECRET_ACCESS_KEY  = yandex_iam_service_account_static_access_key.django-key.secret_key

      ### SMTP settings ###
      EMAIL_HOST          = local.email_host
      EMAIL_HOST_USER     = var.email_host_user
      EMAIL_HOST_PASSWORD = var.email_host_password
      EMAIL_PORT          = local.email_port
      DEFAULT_FROM_EMAIL  = local.default_from_email

      ### URLs for emails ###
      VERIFICATION_URL = "https://${yandex_cm_certificate.hrportal.domains[0]}${local.verification_path}"
      RECOVERY_URL     = "https://${yandex_cm_certificate.hrportal.domains[0]}${local.recovery_path}"
    }
  }
}

resource "yandex_serverless_container_iam_binding" "container-iam" {
  container_id = yandex_serverless_container.django.id
  role         = "serverless.containers.invoker"

  members = [
    "serviceAccount:${yandex_iam_service_account.gateway.id}",
  ]
}

### API Gateway ###

resource "yandex_api_gateway" "hrportal" {
  name = "${local.common_prefix}-api-gateway"
  custom_domains {
    fqdn           = yandex_cm_certificate.hrportal.domains[0]
    certificate_id = yandex_cm_certificate.hrportal.id
  }
  spec = <<-EOT
openapi: 3.0.0
info:
  title: HR Portal API
  version: 1.0.0
paths:
  /:
   get:
     x-yc-apigateway-integration:
       type: object_storage
       bucket: ${yandex_storage_bucket.static.id}
       object: index.html
       service_account_id: ${yandex_iam_service_account.gateway.id}
  /{proxy+}:
   get:
     x-yc-apigateway-integration:
       type: object_storage
       bucket: ${yandex_storage_bucket.static.id}
       object: '{proxy}'
       error_object: index.html
       service_account_id: ${yandex_iam_service_account.gateway.id}
     parameters:
     - explode: false
       in: path
       name: proxy
       required: true
       schema:
         type: string
       style: simple
  /media/{file+}:
   get:
     x-yc-apigateway-integration:
       type: object_storage
       bucket: ${yandex_storage_bucket.media.id}
       object: '{file}'
       error_object: index.html
       service_account_id: ${yandex_iam_service_account.gateway.id}
     parameters:
     - explode: false
       in: path
       name: file
       required: true
       schema:
         type: string
       style: simple
  /admin/{proxy+}:
    x-yc-apigateway-any-method:
      x-yc-apigateway-integration:
        type: serverless_containers
        container_id: ${yandex_serverless_container.django.id}
        service_account_id: ${yandex_iam_service_account.gateway.id}
      parameters:
      - explode: false
        in: path
        name: proxy
        required: false
        schema:
          type: string
        style: simple
  /api/{proxy+}:
    x-yc-apigateway-any-method:
      x-yc-apigateway-integration:
        type: serverless_containers
        container_id: ${yandex_serverless_container.django.id}
        service_account_id: ${yandex_iam_service_account.gateway.id}
      parameters:
      - explode: false
        in: path
        name: proxy
        required: false
        schema:
          type: string
        style: simple
EOT
}