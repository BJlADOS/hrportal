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
  execution_timeout  = "600s"
  connectivity {
    network_id = yandex_vpc_network.hrportal.id
  }
  image {
    url         = "cr.yandex/${yandex_container_registry.hrportal.id}/${var.django_container_tag}"
    environment = {
      DEBUG = "True"

      ### CORS settings ###
      ALLOWED_HOSTS = yandex_cm_certificate.hrportal.domains[0]
      DJANGO_URL    = "https://${yandex_cm_certificate.hrportal.domains[0]}"

      ### Database settings ###
      POSTGRES_HOST    = yandex_mdb_postgresql_cluster.hrportal.host[0].fqdn
      POSTGRES_PORT    = local.db_port
      POSTGRES_DB_NAME = yandex_mdb_postgresql_database.hrportal.name
      POSTGRES_USER    = yandex_mdb_postgresql_user.hrportal.name
      POSTGRES_SSLMODE = "require"

      ### Storage settings ###
      REMOTE_STORAGE     = "True"
      S3_ENDPOINT_URL    = "https://storage.yandexcloud.net"
      MEDIA_BUCKET_NAME  = yandex_storage_bucket.media.id
      MEDIA_BUCKET_URL   = "${yandex_cm_certificate.hrportal.domains[0]}${local.media_storage_path}"
      STATIC_BUCKET_NAME = yandex_storage_bucket.static.id
      STATIC_BUCKET_URL  = "${yandex_cm_certificate.hrportal.domains[0]}${local.static_storage_path}"
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