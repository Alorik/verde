import z from "zod";
import { Industry } from "@/app/generated/prisma/enums";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required")
    .max(100, "Organization name cannot exceed 100 characters"),

  industry: z.nativeEnum(Industry),

  employeeCount: z
    .number()
    .int()
    .positive("Employee count must be greater than 0"),

  country: z.string().trim().min(1, "Country is required"),

  city: z.string().trim().optional(),

  foundedAt: z.coerce.date().optional(),
});
