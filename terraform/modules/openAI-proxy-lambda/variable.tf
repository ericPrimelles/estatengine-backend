variable "stage" {
    type = string
}

variable "lambda_function_name" {
    type = string
}
variable "lambda_runtime" {
  type = string
  description = "Lambda runtime"
  default = "python3.9"
}
variable "region" {
  type = string
}
variable "handler" {
    type = string
    description = "Lambda handler"
}

variable "source_path" {
    type = string
    description = "Lambda implementation path"
  
}

variable "output_path" {
  type =  string
  description = "Lambda zip output path"
}