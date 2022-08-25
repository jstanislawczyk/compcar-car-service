resource "aws_db_instance" "mysql" {
  db_name                 = "${local.environment}compcardb"
  identifier              = "${local.environment}-compcar-db"
  port                    = 3306
  engine                  = "mysql"
  engine_version          = "8.0.28"
  instance_class          = "db.t3.micro"
  allocated_storage       = 10
  username                = "root"
  password                = "rootroot"
  db_subnet_group_name    = aws_db_subnet_group.mysql_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.mysql_security_group.id]
  parameter_group_name    = "default.mysql8.0"
  backup_retention_period = 5
  backup_window           = "01:00-02:00"
  skip_final_snapshot     = true
  publicly_accessible     = true
}
