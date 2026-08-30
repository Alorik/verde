import { DocumentType } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const documentSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(100, "Document name cannot exceed 100 characters"),

  documentType: z.nativeEnum(DocumentType),

  fileSize: z.number().int().positive("File size must be greater than 0"),

  mimeType: z.string().min(1, "MIME type is required"),

  assessmentId: z.string().min(1, "Assessment ID is required"),
});
