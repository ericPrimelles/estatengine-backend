module "openAI-proxy-lambda" {
  source               = "./modules/openAI-proxy-lambda"
  lambda_function_name = "dvst-estatengine-backend-openApi-proxy-function-${var.stage}"
  stage                = var.stage
  source_path          = "../src/openAI_proxy"
  output_path          = "openAI-proxy.zip"
  region               = var.aws_region
  handler              = "openAI_proxy.handler"
}