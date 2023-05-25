### Virtual Private Network ###

resource "yandex_vpc_network" "hrportal" {
  name = "${local.common_prefix}-network"
}

resource "yandex_vpc_subnet" "b" {
  name           = "${local.common_prefix}-b-subnet"
  zone           = local.main_zone
  network_id     = yandex_vpc_network.hrportal.id
  v4_cidr_blocks = ["10.129.0.0/24"]
}

### Postgres DB ###

resource "yandex_mdb_postgresql_cluster" "hrportal" {
  name        = "${local.common_prefix}-postgres-db"
  environment = "PRODUCTION"
  network_id  = yandex_vpc_network.hrportal.id

  config {
    version = 14
    resources {
      resource_preset_id = "s3-c2-m8"
      disk_type_id       = "network-ssd"
      disk_size          = 10
    }
  }

  host {
    zone             = local.main_zone
    subnet_id        = yandex_vpc_subnet.b.id
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