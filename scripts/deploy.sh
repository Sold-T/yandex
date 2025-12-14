#!/bin/bash

# Инициализация Terraform
cd terraform
terraform init

# Планирование изменений
terraform plan -var="yc_token=$YC_TOKEN" \
               -var="yc_cloud_id=$YC_CLOUD_ID" \
               -var="yc_folder_id=$YC_FOLDER_ID" \
               -var="db_password=$DB_PASSWORD"

# Применение изменений
terraform apply -auto-approve \
               -var="yc_token=$YC_TOKEN" \
               -var="yc_cloud_id=$YC_CLOUD_ID" \
               -var="yc_folder_id=$YC_FOLDER_ID" \
               -var="db_password=$DB_PASSWORD"

# Получение выходных переменных
LB_IP=$(terraform output -raw load_balancer_ip)
DB_HOST=$(terraform output -raw database_host)
BUCKET_NAME=$(terraform output -raw object_storage_bucket)

# Настройка окружения
export DB_HOST
export AWS_STORAGE_BUCKET_NAME=$BUCKET_NAME

# Миграции базы данных
python backend/manage.py migrate

# Сборка статики
python backend/manage.py collectstatic --noinput

echo "Deployment completed!"
echo "Load Balancer IP: $LB_IP"