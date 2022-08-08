resource "aws_cloudwatch_log_group" "lambda_pdf_generator_logging" {
  name              = "/aws/lambda/${aws_lambda_function.registration_confirmation_clearer.function_name}"
  retention_in_days = 3
}
