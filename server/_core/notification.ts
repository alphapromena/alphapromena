import { Resend } from "resend";
import { ENV } from "./env";

export type NotificationPayload = {
  title: string;
  content: string;
};

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  const { title, content } = payload;

  if (!ENV.resendApiKey || !ENV.notificationEmailTo) {
    console.log(`[Notification] (logging only — Resend not configured)\n${title}\n${content}`);
    return true;
  }

  try {
    const resend = new Resend(ENV.resendApiKey);
    const result = await resend.emails.send({
      from: ENV.notificationEmailFrom,
      to: ENV.notificationEmailTo,
      subject: title,
      text: content,
    });

    if (result.error) {
      console.warn("[Notification] Resend returned error:", result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Failed to send email:", error);
    return false;
  }
}
