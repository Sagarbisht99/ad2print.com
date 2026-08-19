import { z } from "zod";

export const ENQUIRY_SOURCES = ["contact", "popup", "category", "newspaper"] as const;

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Name is too long")
  .regex(/^[a-zA-Z][a-zA-Z .'-]*$/, "Name can only contain letters");

const emailSchema = z
  .email("Enter a valid email")
  .max(160, "Email is too long")
  .transform((value) => value.trim().toLowerCase());

const mobileSchema = z
  .string()
  .trim()
  .min(1, "Enter your mobile number")
  .transform((value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
    return digits;
  })
  .refine((digits) => /^[6-9]\d{9}$/.test(digits), "Enter a valid 10-digit mobile number");

const messageSchema = z
  .string()
  .trim()
  .min(10, "Message should be at least 10 characters")
  .max(2000, "Message is too long");

export const enquirySchema = z
  .object({
    name: nameSchema,
    mobile: mobileSchema,
    email: emailSchema,
    message: messageSchema,
    category: z.string().trim().max(120).optional(),
    source: z.enum(ENQUIRY_SOURCES, { error: "Invalid enquiry source" }),
  })
  .superRefine((data, ctx) => {
    if ((data.source === "category" || data.source === "newspaper") && !data.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Category is required",
      });
    }
  });

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryPayload = z.output<typeof enquirySchema>;
export type EnquiryFieldErrors = Partial<Record<keyof EnquiryInput, string>>;

export function parseEnquiry(data: unknown) {
  const result = enquirySchema.safeParse(data);
  if (result.success) {
    return { ok: true as const, data: result.data };
  }

  const fields: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key as keyof EnquiryInput]) {
      fields[key as keyof EnquiryInput] = issue.message;
    }
  }

  return {
    ok: false as const,
    error: Object.values(fields)[0] || "Please check the form and try again.",
    fields,
  };
}
