resource "aws_lambda_function" "registration_confirmation_clearer" {
  filename      = "registration-confirmation-clearer.zip"
  function_name = "${local.environment}-registration-confirmation-clearer"
  role          = aws_iam_role.registration_confirmation_clearer_role.arn
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  source_code_hash = filebase64sha256("registration-confirmation-clearer.zip")
}

resource "aws_lambda_permission" "registration_confirmation_clearer_permission" {
  function_name = aws_lambda_function.registration_confirmation_clearer.function_name
  source_arn    = aws_cloudwatch_event_rule.every_night.arn
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  principal     = "events.amazonaws.com"
}
