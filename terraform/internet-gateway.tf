resource "aws_internet_gateway" "main_gateway" {
  vpc_id = aws_vpc.main.id
}
