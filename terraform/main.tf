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

module "openAI-proxy-lambda" {
  source = "./modules/openAI-proxy-lambda"
  lambda_function_name = "dvst-estatengine-backend-openApi-proxy-function-${var.stage}"
  stage = var.stage
  source_path = "../src/openAI_proxy"
  output_path = "openAI-proxy.zip"
  region = var.aws_region
  handler = "openAI_proxy.handler"
}