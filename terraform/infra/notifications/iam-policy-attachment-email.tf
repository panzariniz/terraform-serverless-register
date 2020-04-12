resource "aws_iam_policy_attachment" "email_iam_policy_attachment" {
  name       = "${var.environment}-email-iam-policy-attachment"
  roles      = ["${aws_iam_role.email_iam_role.name}"]
  policy_arn = "${aws_iam_policy.email_iam_policy.arn}"
}
