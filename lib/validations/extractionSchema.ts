import z from "zod";

export const electricityExtractionSchema = z.object({
  electricityCost: z.number(),
  unitsConsumed: z.number(),
  unit: z.string().nullable(),
});

export const waterExtractionSchema = z.object({
  waterCost: z.number(),
  unitsConsumed: z.number(),
  unit: z.string().nullable(),
});

export const employeeExtractionSchema = z.object({
  totalEmployees: z.number(),
  male: z.number(),
  female: z.number(),
  employeeTurnover: z.number(),
  trainingHours: z.number(),
});