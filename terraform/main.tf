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
  value = "cr.yandex/${yandex_container_registry.hrportal.id}/${var.django_container_tag}"
}