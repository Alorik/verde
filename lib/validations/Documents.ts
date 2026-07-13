import { DocumentType } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const documentSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(100, "Document name cannot exceed 100 characters"),

  documentType: z.nativeEnum(DocumentType),

  fileSize: z
    .number()
    .int()
    .positive("file size must be greater than 0"),
  
  assessmentId: z
    .string()
    .trim()
    .min(1, "Assessment ID is required"),
  
  
  mimeType: z
    .string()
    .startsWith("application/")
});