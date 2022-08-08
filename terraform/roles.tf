resource "aws_iam_role" "registration_confirmation_clearer_role" {
  name = "${local.environment}-registration-confirmation-clearer-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "registration_confirmation_clearer_policy_attachment" {
  role       = aws_iam_role.registration_confirmation_clearer_role.name
  policy_arn = aws_iam_policy.lambda_new_order_processor_policy.arn
}
