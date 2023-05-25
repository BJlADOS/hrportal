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
  /static/{file+}:
   get:
     x-yc-apigateway-integration:
       type: object_storage
       bucket: ${yandex_storage_bucket.static.id}
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