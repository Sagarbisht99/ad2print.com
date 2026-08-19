import mongoose, { Schema } from "mongoose";
import { ENQUIRY_SOURCES, type EnquiryPayload } from "@/lib/enquiry-schema";

export { ENQUIRY_SOURCES };
export type EnquirySource = EnquiryPayload["source"];
export const ENQUIRY_STATUSES = ["pending", "opened", "resolved"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type EnquiryDoc = {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  message: string;
  category?: string;
  source: EnquirySource;
  status: EnquiryStatus;
  createdAt: string;
};

export function resolveEnquiryStatus(item: { status?: string; read?: boolean }): EnquiryStatus {
  if (item.status === "pending" || item.status === "opened" || item.status === "resolved") {
    return item.status;
  }
  return item.read ? "opened" : "pending";
}

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    mobile: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    category: { type: String, trim: true, maxlength: 120 },
    source: {
      type: String,
      required: true,
      enum: ENQUIRY_SOURCES,
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "pending",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

if (mongoose.models.Enquiry) {
  delete mongoose.models.Enquiry;
}

export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
