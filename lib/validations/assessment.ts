import { AssessmentStatus } from "@prisma/client";
import { z } from "zod";

export const assessmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Assessment name is required")
    .max(100, "Assessment name cannot exceed 100 characters"),

  reportingYear: z
    .number()
    .int()
    .min(2000, "Reporting year must be at least 2000")
    .max(2100, "Reporting year cannot exceed 2100"),

  status: z.nativeEnum(AssessmentStatus),

  description: z.string().trim().optional(),
});
