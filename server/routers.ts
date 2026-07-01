import { z } from "zod";
import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";
import { renderLeadEmail, renderLeadText, type LeadField } from "./_core/email-template";
import { publicProcedure, router } from "./_core/trpc";
import { insertContactSubmission } from "./db";

const contactInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  company: z.string().max(255).optional().default(""),
  email: z.string().email("Invalid email address").max(320),
  inquiryType: z.string().min(1, "Inquiry type is required").max(100),
  message: z.string().min(1, "Message is required"),
});

const departmentInputSchema = z.object({
  department: z.string().min(1).max(100),
  firstName: z.string().min(1, "First name is required").max(128),
  lastName: z.string().max(128).optional().default(""),
  email: z.string().email("Invalid email").max(320),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(255).optional().default(""),
  jobTitle: z.string().max(128).optional().default(""),
  message: z.string().min(1, "Message is required"),
});

async function deliverWebhook(body: Record<string, unknown>) {
  if (!ENV.departmentWebhookUrl) return;
  try {
    const resp = await fetch(ENV.departmentWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ENV.departmentWebhookToken
          ? { Authorization: `Bearer ${ENV.departmentWebhookToken}` }
          : {}),
      },
      body: JSON.stringify({ ...body, source: "website" }),
    });
    if (!resp.ok) {
      console.error(`[Webhook] returned ${resp.status}:`, await resp.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[Webhook] failed:", err);
  }
}

export const appRouter = router({
  contact: router({
    submit: publicProcedure
      .input(contactInputSchema)
      .mutation(async ({ input }) => {
        await insertContactSubmission({
          name: input.name,
          company: input.company || null,
          email: input.email,
          inquiryType: input.inquiryType,
          message: input.message,
        });

        const heading = "New website lead";
        const fields: LeadField[] = [
          { label: "Name", value: input.name },
          { label: "Company", value: input.company || "—" },
          { label: "Email", value: input.email, href: `mailto:${input.email}` },
          { label: "Inquiry", value: input.inquiryType },
          { label: "Received", value: new Date().toUTCString() },
        ];

        await notifyOwner({
          title: `New lead — ${input.inquiryType} — ${input.name}`,
          content: renderLeadText({ heading, badge: input.inquiryType, fields, message: input.message }),
          html: renderLeadEmail({ heading, badge: input.inquiryType, fields, message: input.message, replyEmail: input.email }),
          replyTo: input.email,
        });

        await deliverWebhook(input);

        return { success: true };
      }),
  }),

  department: router({
    contact: publicProcedure
      .input(departmentInputSchema)
      .mutation(async ({ input }) => {
        const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ");

        await insertContactSubmission({
          name: fullName,
          company: input.company || null,
          email: input.email,
          inquiryType: `Department: ${input.department}`,
          message: input.message,
        });

        const heading = `New ${input.department} inquiry`;
        const fields: LeadField[] = [
          { label: "Name", value: fullName },
          { label: "Company", value: input.company || "—" },
          { label: "Email", value: input.email, href: `mailto:${input.email}` },
          { label: "Phone", value: input.phone || "—", href: input.phone ? `tel:${input.phone}` : null },
          { label: "Job Title", value: input.jobTitle || "—" },
          { label: "Department", value: input.department },
          { label: "Received", value: new Date().toUTCString() },
        ];

        await notifyOwner({
          title: `New lead — ${input.department} — ${fullName}`,
          content: renderLeadText({ heading, badge: input.department, fields, message: input.message }),
          html: renderLeadEmail({ heading, badge: input.department, fields, message: input.message, replyEmail: input.email }),
          replyTo: input.email,
        });

        await deliverWebhook({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          company: input.company,
          jobTitle: input.jobTitle,
          message: input.message,
          department: input.department,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
