locals {
  common_prefix        = "hrportal"
  cert_name            = "${local.common_prefix}-sergei-kiprin"
  domain               = "hrportal.sergei-kiprin.ru"
  db_port              = "6432"
  db_name              = "db"
  email_host           = "smtp.mailtrap.io"
  email_port           = "2525"
  default_from_email   = "server@hrportal.com"
  verification_path    = "/account/confirm-email/"
  recovery_path        = "/account/recovery-password/"
  main_zone            = "ru-central1-b"
}

variable "iam_token" {
  type = string
}

variable "cloud_id" {
  type = string
}

variable "folder_id" {
  type = string
}

variable "db_user_name" {
  type = string
}

variable "db_user_password" {
  type = string
}

variable "email_host_user" {
  type = string
}

variable "email_host_password" {
  type = string
}

variable "django_secret_key" {
  type = string
}

variable "django_container_tag" {
  type = string
}

variable "old_network_id" {
  type = string
}

variable "old_subnet_id" {
  type = string
}