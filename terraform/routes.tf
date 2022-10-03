resource "aws_route" "internet-route" {
  route_table_id         = aws_vpc.main.main_route_table_id
  gateway_id             = aws_internet_gateway.main_gateway.id
  destination_cidr_block = "0.0.0.0/0"
}
