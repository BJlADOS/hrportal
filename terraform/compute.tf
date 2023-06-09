data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance" "hrportal" {
  name = "${local.common_prefix}-vm-backend"
  service_account_id = yandex_iam_service_account.django.id
  platform_id = "standard-v3"
  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.container-optimized-image.id
    }
  }
  network_interface {
    subnet_id = yandex_vpc_subnet.b.id
    nat = true
  }
  resources {
    cores  = 2
    memory = 2
    core_fraction = 20
  }
  metadata = {
    docker-compose = <<-EOT
version: "3"

services:
  postgres:
    container_name: postgres
    image: postgres:latest
    expose:
      - 5432
    environment:
      POSTGRES_USER: ${var.db_user_name}
      POSTGRES_PASSWORD: ${var.db_user_password}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
  django:
    container_name: django
    image: "cr.yandex/${yandex_container_registry.hrportal.id}/${var.django_container_tag}"
    depends_on:
      - postgres
    environment:
      - DEBUG=True
      - SECRET_KEY=${var.django_secret_key}
      - PORT=8000

      ### CORS settings ###
      - ALLOWED_HOSTS=${yandex_cm_certificate.hrportal.domains[0]}
      - DJANGO_URL=https://${yandex_cm_certificate.hrportal.domains[0]}

      ### Database settings ###
      - POSTGRES_HOST=postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DB_NAME=postgres
      - POSTGRES_USER=${var.db_user_name}
      - POSTGRES_PASSWORD=${var.db_user_password}
      # sslmode: disable or require
      - POSTGRES_SSLMODE=disable

      ### Storage settings ###
      - REMOTE_STORAGE=True
      - S3_ENDPOINT_URL=https://storage.yandexcloud.net
      - MEDIA_BUCKET_NAME=${yandex_storage_bucket.media.id}
      - MEDIA_BUCKET_URL=${yandex_cm_certificate.hrportal.domains[0]}${local.media_storage_path}
      - STATIC_BUCKET_NAME=${yandex_storage_bucket.static.id}
      - STATIC_BUCKET_URL=${yandex_cm_certificate.hrportal.domains[0]}${local.static_storage_path}
      # Service account #
      - ACCESS_KEY_ID=${yandex_iam_service_account_static_access_key.django-key.access_key}
      - SECRET_ACCESS_KEY=${yandex_iam_service_account_static_access_key.django-key.secret_key}

      ### SMTP settings ###
      - EMAIL_HOST=${local.email_host}
      - EMAIL_HOST_USER=${var.email_host_user}
      - EMAIL_HOST_PASSWORD=${var.email_host_password}
      - EMAIL_PORT=${local.email_port}
      - DEFAULT_FROM_EMAIL=${local.default_from_email}

      ### URLs for emails ###
      - VERIFICATION_URL=https://${yandex_cm_certificate.hrportal.domains[0]}${local.verification_path}
      - RECOVERY_URL=https://${yandex_cm_certificate.hrportal.domains[0]}${local.recovery_path}
    ports:
      - "80:8000"
volumes:
  postgres-data:
EOT
    ssh-keys = "kiprin:${var.ssh_pub}"
  }
}