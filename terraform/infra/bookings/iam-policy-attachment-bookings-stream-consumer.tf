resource "aws_iam_policy_attachment" "bookings_stream_consumer_policy_attachment" {
  name       = "${var.environment}-bookings-stream-consumer-iam-policy-attachment"
  roles      = ["${aws_iam_role.bookings_stream_consumer_iam_role.name}"]
  policy_arn = "${aws_iam_policy.bookings_stream_consumer_policy.arn}"
}

resource "aws_iam_policy_attachment" "bookings_get_user_policy_attachment" {
  name       = "${var.environment}-bookings-get-user-iam-policy-attachment"
  roles      = ["${aws_iam_role.bookings_stream_consumer_iam_role.name}"]
  policy_arn = "${var.policy_get_user}"
}
