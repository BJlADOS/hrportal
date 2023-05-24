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
  zone      = local.main_zone
}

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

resource "yandex_resourcemanager_folder_iam_member" "django-os-uploader" {
  member    = "serviceAccount:${yandex_iam_service_account.django.id}"
  role      = "storage.uploader"
  folder_id = var.folder_id
}

resource "yandex_resourcemanager_folder_iam_member" "django-os-viewer" {
  member    = "serviceAccount:${yandex_iam_service_account.django.id}"
  role      = "storage.viewer"
  folder_id = var.folder_id
}

resource "yandex_resourcemanager_folder_iam_member" "django-lb-viewer" {
  member    = "serviceAccount:${yandex_iam_service_account.django.id}"
  role      = "lockbox.viewer"
  folder_id = var.folder_id
}

resource "yandex_resourcemanager_folder_iam_member" "django-lb-payloadViewer" {
  member    = "serviceAccount:${yandex_iam_service_account.django.id}"
  role      = "lockbox.payloadViewer"
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

// TODO validate certificate automatically

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

### Virtual Private Network ###

resource "yandex_vpc_network" "hrportal" {
  name = "${local.common_prefix}-network"
}

resource "yandex_vpc_subnet" "b" {
  name           = "${local.common_prefix}-b-subnet"
  zone           = local.main_zone
  network_id     = yandex_vpc_network.hrportal.id
  v4_cidr_blocks = ["10.5.0.0/24"]
}

### Postgres DB ###

resource "yandex_mdb_postgresql_cluster" "hrportal" {
  name        = "${local.common_prefix}-postgres-db"
  environment = "PRODUCTION"
  network_id  = var.old_network_id

  config {
    version = 14
    resources {
      resource_preset_id = "s3-c2-m8"
      disk_type_id       = "network-ssd"
      disk_size          = 10
    }
  }

  host {
    assign_public_ip = true
    zone      = local.main_zone
    subnet_id = var.old_subnet_id
  }
}

resource "yandex_mdb_postgresql_user" "hrportal" {
  cluster_id = yandex_mdb_postgresql_cluster.hrportal.id
  name       = var.db_user_name
  password   = var.db_user_password
}

resource "yandex_mdb_postgresql_database" "hrportal" {
  cluster_id = yandex_mdb_postgresql_cluster.hrportal.id
  name       = local.db_name
  owner      = yandex_mdb_postgresql_user.hrportal.name
}

### Lockbox secrets ###

resource "yandex_lockbox_secret" "django-secret" {
  name = "${local.common_prefix}-django-secret"
}

resource "yandex_lockbox_secret_version" "hrportal" {
  secret_id = yandex_lockbox_secret.django-secret.id
  entries {
    key        = "SECRET_KEY"
    text_value = var.django_secret_key
  }
  entries {
    key        = "SECRET_ACCESS_KEY"
    text_value = yandex_iam_service_account_static_access_key.django-key.secret_key
  }
  entries {
    key        = "EMAIL_HOST_PASSWORD"
    text_value = var.email_host_password
  }
  entries {
    key        = "POSTGRES_PASSWORD"
    text_value = var.db_user_password
  }
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

      ### CORS settings ###
      ALLOWED_HOSTS = yandex_cm_certificate.hrportal.domains[0]
      DJANGO_URL    = "https://${yandex_cm_certificate.hrportal.domains[0]}"

      ### Database settings ###
      POSTGRES_HOST     = yandex_mdb_postgresql_cluster.hrportal.host[0].fqdn
      POSTGRES_PORT     = local.db_port
      POSTGRES_DB_NAME  = yandex_mdb_postgresql_database.hrportal.name
      POSTGRES_USER     = yandex_mdb_postgresql_user.hrportal.name
      POSTGRES_SSLMODE  = "require"

      ### Storage settings ###
      REMOTE_STORAGE     = "True"
      S3_ENDPOINT_URL    = "https://storage.yandexcloud.net"
      MEDIA_BUCKET_NAME  = yandex_storage_bucket.media.id
      STATIC_BUCKET_NAME = yandex_storage_bucket.static.id
      # Service account #
      ACCESS_KEY_ID      = yandex_iam_service_account_static_access_key.django-key.access_key

      ### SMTP settings ###
      EMAIL_HOST         = local.email_host
      EMAIL_HOST_USER    = var.email_host_user
      EMAIL_PORT         = local.email_port
      DEFAULT_FROM_EMAIL = local.default_from_email

      ### URLs for emails ###
      VERIFICATION_URL = "https://${yandex_cm_certificate.hrportal.domains[0]}${local.verification_path}"
      RECOVERY_URL     = "https://${yandex_cm_certificate.hrportal.domains[0]}${local.recovery_path}"
    }
  }
  secrets {
    id                   = yandex_lockbox_secret.django-secret.id
    version_id           = yandex_lockbox_secret_version.hrportal.id
    key                  = "SECRET_KEY"
    environment_variable = "SECRET_KEY"
  }
  secrets {
    id                   = yandex_lockbox_secret.django-secret.id
    version_id           = yandex_lockbox_secret_version.hrportal.id
    key                  = "SECRET_ACCESS_KEY"
    environment_variable = "SECRET_ACCESS_KEY"
  }
  secrets {
    id                   = yandex_lockbox_secret.django-secret.id
    version_id           = yandex_lockbox_secret_version.hrportal.id
    key                  = "EMAIL_HOST_PASSWORD"
    environment_variable = "EMAIL_HOST_PASSWORD"
  }
  secrets {
    id                   = yandex_lockbox_secret.django-secret.id
    version_id           = yandex_lockbox_secret_version.hrportal.id
    key                  = "POSTGRES_PASSWORD"
    environment_variable = "POSTGRES_PASSWORD"
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