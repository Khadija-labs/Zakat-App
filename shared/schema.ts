import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

/** Request body for POST /api/contact (includes reCAPTCHA token when enabled) */
export const contactSubmitSchema = contactFormSchema.extend({
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA").optional(),
});
export type ContactSubmit = z.infer<typeof contactSubmitSchema>;
