terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.85"
    }
  }
}

provider "yandex" {
  token     = var.yc_token
  cloud_id  = var.yc_cloud_id
  folder_id = var.yc_folder_id
  zone      = var.yc_zone
}

# 1. Создание VPC сети
resource "yandex_vpc_network" "main" {
  name = "main-network"
}

resource "yandex_vpc_subnet" "subnet-a" {
  name           = "subnet-a"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.main.id
  v4_cidr_blocks = ["192.168.10.0/24"]
}

resource "yandex_vpc_subnet" "subnet-b" {
  name           = "subnet-b"
  zone           = "ru-central1-b"
  network_id     = yandex_vpc_network.main.id
  v4_cidr_blocks = ["192.168.20.0/24"]
}

# 2. Security Groups
resource "yandex_vpc_security_group" "app-sg" {
  name        = "application-sg"
  network_id  = yandex_vpc_network.main.id

  ingress {
    description    = "HTTP"
    protocol       = "TCP"
    port           = 80
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description    = "HTTPS"
    protocol       = "TCP"
    port           = 443
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description    = "SSH"
    protocol       = "TCP"
    port           = 22
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description    = "Outgoing traffic"
    protocol       = "ANY"
    v4_cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Object Storage для статики
resource "yandex_storage_bucket" "static" {
  bucket     = "myapp-static-${random_id.bucket_suffix.hex}"
  access_key = yandex_iam_service_account_static_access_key.sa-static-key.access_key
  secret_key = yandex_iam_service_account_static_access_key.sa-static-key.secret_key

  anonymous_access_flags {
    read = true
    list = false
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 4. Managed PostgreSQL кластер
resource "yandex_mdb_postgresql_cluster" "postgresql" {
  name        = "myapp-postgresql"
  environment = "PRODUCTION"
  network_id  = yandex_vpc_network.main.id

  config {
    version = 15
    resources {
      resource_preset_id = "s2.micro"
      disk_type_id       = "network-ssd"
      disk_size          = 20
    }

    postgresql_config = {
      max_connections = 100
    }
  }

  host {
    zone      = "ru-central1-a"
    subnet_id = yandex_vpc_subnet.subnet-a.id
  }

  host {
    zone      = "ru-central1-b"
    subnet_id = yandex_vpc_subnet.subnet-b.id
  }

  user {
    name     = "myuser"
    password = var.db_password
    permission {
      database_name = "mydb"
    }
  }

  database {
    name  = "mydb"
    owner = "myuser"
  }
}

# 5. Service Account для Object Storage
resource "yandex_iam_service_account" "sa-static" {
  name        = "sa-static"
  description = "Service account for static files"
}

resource "yandex_resourcemanager_folder_iam_member" "sa-static-editor" {
  folder_id = var.yc_folder_id
  role      = "storage.editor"
  member    = "serviceAccount:${yandex_iam_service_account.sa-static.id}"
}

resource "yandex_iam_service_account_static_access_key" "sa-static-key" {
  service_account_id = yandex_iam_service_account.sa-static.id
}

# 6. Cloud Functions (Serverless)
resource "yandex_function" "notification-function" {
  name               = "notification-function"
  runtime            = "python311"
  entrypoint         = "handler.handler"
  memory             = "128"
  execution_timeout  = "10"
  service_account_id = yandex_iam_service_account.sa-static.id

  content {
    zip_filename = "function.zip"
  }

  environment = {
    BUCKET_NAME = yandex_storage_bucket.static.bucket
  }
}

# 7. Load Balancer
resource "yandex_lb_network_load_balancer" "load-balancer" {
  name = "app-load-balancer"

  listener {
    name        = "http-listener"
    port        = 80
    target_port = 80
    protocol    = "tcp"
  }

  attached_target_group {
    target_group_id = yandex_lb_target_group.app-target-group.id

    healthcheck {
      name = "http"
      http_options {
        port = 80
        path = "/health/"
      }
    }
  }
}

resource "yandex_lb_target_group" "app-target-group" {
  name = "app-target-group"

  dynamic "target" {
    for_each = yandex_compute_instance_group.app-group.instances
    content {
      subnet_id = target.value.network_interface[0].subnet_id
      address   = target.value.network_interface[0].ip_address
    }
  }
}

# 8. Instance Group для приложения
resource "yandex_compute_instance_group" "app-group" {
  name               = "app-instance-group"
  service_account_id = yandex_iam_service_account.sa-static.id

  instance_template {
    platform_id = "standard-v3"

    resources {
      memory = 2
      cores  = 2
    }

    boot_disk {
      initialize_params {
        image_id = "fd8emvfmfoaordspe1jr"  # Ubuntu 22.04
        size     = 20
      }
    }

    network_interface {
      network_id = yandex_vpc_network.main.id
      subnet_ids = [yandex_vpc_subnet.subnet-a.id, yandex_vpc_subnet.subnet-b.id]
      nat        = true
    }

    metadata = {
      docker-container-declaration = file("${path.module}/docker-compose.yml")
      ssh-keys                     = "ubuntu:${file("~/.ssh/id_rsa.pub")}"
    }
  }

  scale_policy {
    fixed_scale {
      size = 2
    }
  }

  allocation_policy {
    zones = ["ru-central1-a", "ru-central1-b"]
  }

  deploy_policy {
    max_unavailable = 1
    max_expansion   = 0
  }
}

output "load_balancer_ip" {
  value = yandex_lb_network_load_balancer.load-balancer.listener[*].external_address_spec[*].address
}

output "object_storage_endpoint" {
  value = "https://${yandex_storage_bucket.static.bucket}.storage.yandexcloud.net"
}