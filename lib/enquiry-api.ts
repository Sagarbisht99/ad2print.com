import type { EnquiryInput } from "@/lib/enquiry-schema";

export const ENQUIRY_API = "/api/enquiries";

export type EnquirySubmitBody = {
  name: string;
  mobile: string;
  email: string;
  message: string;
  category?: string;
  source: EnquiryInput["source"];
};

export async function postEnquiry(body: EnquirySubmitBody) {
  const res = await fetch(ENQUIRY_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
