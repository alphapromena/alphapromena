/* Recipients for lead notifications.
   Override via NOTIFICATION_EMAIL_TO (comma-separated) if needed. */
const DEFAULT_RECIPIENTS = [
  "abood@alphapromena.com",
  "hamza@alphapromena.com",
  "Qusai@alphapromena.com",
];

const recipients = (process.env.NOTIFICATION_EMAIL_TO ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  notificationEmailTo: recipients.length > 0 ? recipients : DEFAULT_RECIPIENTS,
  notificationEmailFrom: process.env.NOTIFICATION_EMAIL_FROM ?? "Alpha Pro MENA <leads@alphapromena.com>",
  departmentWebhookUrl: process.env.DEPARTMENT_WEBHOOK_URL ?? "",
  departmentWebhookToken: process.env.DEPARTMENT_WEBHOOK_TOKEN ?? "",
};
