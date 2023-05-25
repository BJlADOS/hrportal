### Object Storage ###

resource "yandex_storage_bucket" "media" {
  bucket     = "${local.common_prefix}-media"
  max_size   = -2147483648
  access_key = yandex_iam_service_account_static_access_key.editor-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.editor-key.secret_key
}

resource "yandex_storage_bucket" "static" {
  bucket     = "${local.common_prefix}-static"
  max_size   = -2147483648
  access_key = yandex_iam_service_account_static_access_key.editor-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.editor-key.secret_key
}