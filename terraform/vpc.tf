resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "public_subnet" {
  count = length(data.aws_availability_zones.available_zones.names)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = element(data.aws_availability_zones.available_zones.names, count.index)
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private_subnet" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.32.0/24"
}

resource "aws_db_subnet_group" "mysql_subnet_group" {
  name       = "${local.environment}-mysql-subnet-group"
  subnet_ids = aws_subnet.public_subnet.*.id
}
