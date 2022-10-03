provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Owner = "jstanislawczyk"
      Name  = "jstanislawczyk"
    }
  }
}

terraform {
  # backend "s3" {
  #   bucket = "jstanislawczyk-terraform"
  #   key    = "main/state_terraform"
  #   region = "us-east-1"
  # }

  required_version = ">= 1.0.0"
}
