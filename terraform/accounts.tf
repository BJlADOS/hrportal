### Editor Service Account ###

resource "yandex_iam_service_account" "editor" {
  name = "${local.common_prefix}-editor"
}

resource "yandex_resourcemanager_folder_iam_member" "admin" {
  member    = "serviceAccount:${yandex_iam_service_account.editor.id}"
  role      = "storage.admin"
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