resource "aws_sns_topic" "notifications" {
  name = "${var.environment}-bookings-notifications"
}

resource "aws_ssm_parameter" "bookings_notifications_topic" {
  name  = "${var.environment}-bookings-notifications-topic"
  type  = "String"
  value = "${aws_sns_topic.notifications.arn}"
}

output "bookings_notifications_topic_arn" {
  value = "${aws_sns_topic.notifications.arn}"
}


