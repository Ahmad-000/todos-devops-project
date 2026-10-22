variable "aws_region" {
  description = "AWS region for Todo DevOps infrastructure"
  type        = string
  default     = "eu-north-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "project_name" {
  description = "Name of the Todo DevOps project"
  type        = string
  default     = "todo-devops"
}

variable "public_key_path" {
  description = "Path to the SSH public key"
  type        = string
  default     = "~/.ssh/todo-devops-key.pub"
}

variable "admin_ip" {
  description = "Your public IP address allowed for SSH"
  type        = string
}