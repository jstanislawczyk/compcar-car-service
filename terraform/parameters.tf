resource "aws_ssm_parameter" "mysql_db_url" {
  name        = "/${local.environment}/database/mysql/DB_URL"
  description = "MySQL database URL"
  type        = "String"
  value       = aws_db_instance.mysql.address
  overwrite   = true

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "mysql_db_name" {
  name        = "/${local.environment}/database/mysql/DB_NAME"
  description = "MySQL database name"
  type        = "String"
  value       = aws_db_instance.mysql.db_name
  overwrite   = true

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "mysql_db_port" {
  name        = "/${local.environment}/database/mysql/DB_PORT"
  description = "MySQL database port"
  type        = "String"
  value       = aws_db_instance.mysql.port
  overwrite   = true

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "mysql_db_username" {
  name        = "/${local.environment}/database/mysql/DB_USERNAME"
  description = "MySQL database login"
  type        = "String"
  value       = aws_db_instance.mysql.username
  overwrite   = true

  lifecycle {
    ignore_changes = [value]
  }
}


resource "aws_ssm_parameter" "mysql_db_password" {
  name        = "/${local.environment}/database/mysql/DB_PASSWORD"
  description = "MySQL database password"
  type        = "SecureString"
  value       = aws_db_instance.mysql.password
  overwrite   = true

  lifecycle {
    ignore_changes = [value]
  }
}
