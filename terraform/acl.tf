resource "aws_default_network_acl" "default_network_acl" {
  default_network_acl_id = aws_vpc.main.default_network_acl_id
  subnet_ids             = [
    aws_subnet.public_subnet.*.id,
    aws_subnet.private_subnet.id
  ]

  ingress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  egress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
}
