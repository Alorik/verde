import { AssessmentStatus } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const assessmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Assessment name is required")
    .max(100, "Assessment name cannot exceed 100 characters"),

  reportingYear: z.coerce.date(),
  status: z.nativeEnum(AssessmentStatus),
  description: z.string().trim().optional(),
  organizationId: z
    .string()
    .trim()
    .min(2, "id is required")
    .max(100),
});
