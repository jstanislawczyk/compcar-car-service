resource "aws_cloudwatch_event_rule" "every_night" {
  name                = "${local.environment}-every-night"
  description         = "Fires every night at 1 AM"
  schedule_expression = "cron(0 1 * * ? *)"
}

resource "aws_cloudwatch_event_target" "lambda_every_night" {
  rule      = aws_cloudwatch_event_rule.every_night.name
  arn       = aws_lambda_function.registration_confirmation_clearer.arn
  target_id = "lambda"
}
