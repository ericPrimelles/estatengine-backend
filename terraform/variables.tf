variable "stage" {
  type        = string
  description = "Deploy satage"
  default     = "prod"
}

variable "aws_region" {
  type        = string
  description = "AWS deployment region"
  default     = "us-east-2"
}
