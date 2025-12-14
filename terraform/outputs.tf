output "load_balancer_ip" {
  value = yandex_lb_network_load_balancer.load-balancer.listener[0].external_address_spec[0].address
}

output "database_host" {
  value = yandex_mdb_postgresql_cluster.postgresql.host[0].fqdn
}

output "object_storage_bucket" {
  value = yandex_storage_bucket.static.bucket
}