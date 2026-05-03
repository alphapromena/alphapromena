import { z } from "zod";
import { ENV } from "./_core/env";
import { notifyOwner } from "./_core/notification";
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

        await notifyOwner({
          title: `New Contact Inquiry: ${input.inquiryType}`,
          content: `From: ${input.name} (${input.company || "No company"})\nEmail: ${input.email}\nType: ${input.inquiryType}\n\n${input.message}`,
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

        await notifyOwner({
          title: `Department Inquiry — ${input.department}`,
          content: `From: ${fullName} (${input.company || "No company"})\nEmail: ${input.email}\nPhone: ${input.phone || "N/A"}\nJob Title: ${input.jobTitle || "N/A"}\nDepartment: ${input.department}\n\n${input.message}`,
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
