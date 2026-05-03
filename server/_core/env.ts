export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  notificationEmailTo: process.env.NOTIFICATION_EMAIL_TO ?? "",
  notificationEmailFrom: process.env.NOTIFICATION_EMAIL_FROM ?? "onboarding@resend.dev",
  departmentWebhookUrl: process.env.DEPARTMENT_WEBHOOK_URL ?? "",
  departmentWebhookToken: process.env.DEPARTMENT_WEBHOOK_TOKEN ?? "",
};
