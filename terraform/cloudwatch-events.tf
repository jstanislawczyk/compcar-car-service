resource "aws_cloudwatch_event_rule" "every_one_minute" {
  name                = "${local.environment}-every-one-minute"
  description         = "Fires every one minute"
  schedule_expression = "rate(1 minute)"
}

resource "aws_cloudwatch_event_target" "check_foo_every_one_minute" {
  rule      = aws_cloudwatch_event_rule.every_one_minute.name
  arn       = aws_lambda_function.registration_confirmation_clearer.arn
  target_id = "lambda"
}
