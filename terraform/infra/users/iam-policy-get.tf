resource "aws_iam_policy" "get_iam_policy" {
  name = "${var.environment}-get-user-iam-policy"

  policy = templatefile("${path.module}/templates/dynamodb-policy.tpl", {
    action   = "dynamodb:GetItem",
    resource = "${aws_dynamodb_table.users.arn}"
  })
}

output "policy_get_user_arn" {
  value = "${aws_iam_policy.get_iam_policy.arn}"
}
