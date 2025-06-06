data "aws_iam_policy_document" "assume-role-policy" {
    statement {
      effect = "Allow"
      principals {
        type = "Service"
        identifiers = ["lambda.amazon.com"]
      }
      actions = ["sts:AssumeRole"]

      
    }
}
resource "aws_iam_role" "openAI-proxy-role" {
    name = "dvst-estatengine-backend-openApi-proxy-role"
    assume_role_policy = data.aws_iam_policy_document.assume-role-policy.json
    
}

resource "aws_cloudwatch_log_group" "openAI-proxy-lg" {
    name = "/aws/lambda/${var.lambda_function_name}"
    retention_in_days = 14

}
data "aws_iam_policy_document" "lambda-logging-policy" {
    statement {
      effect = "Allow"
      actions = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      resources = [aws_cloudwatch_log_group.openAI-proxy-lg.arn]

      
    }
}

data "aws_iam_policy_document" "lambda-secrets-policy" {
    statement {
      effect = "Allow"
      actions = [
        "secretsmanager:GetSecretValue",
      ]
      resources = [aws_cloudwatch_log_group.openAI-proxy-lg.arn]

      
    }
}
resource "aws_iam_policy" "lambda_logging" {
    name = "lambda_logging"
    policy = data.aws_iam_policy_document.lambda-logging-policy.json
}

resource "aws_iam_policy" "lambda_secrets" {
    name = "lambda_secrets"
    policy = data.aws_iam_policy_document.lambda-secrets-policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = aws_iam_role.openAI-proxy-role
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_iam_role_policy_attachment" "lambda_secrets" {
  role = aws_iam_role.openAI-proxy-role
  policy_arn = aws_iam_policy.lambda_secrets.arn
}


# Lambda Spec
data "archive_file" "lambda_zip" {
    type = "zip"
    source_dir = var.source_path
    output_path = var.output_path

}
resource "aws_lambda_function" "openAI-proxy" {
  function_name = var.lambda_function_name 
  role = aws_iam_role.openAI-proxy-role.arn
  runtime = var.lambda_runtime
  handler = var.handler
  filename = data.archive_file.lambda_zip.output_path
  environment {
    variables = {
        STAGE = var.stage
        REGION = var.region
    }
  }
  
}