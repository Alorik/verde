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

export const csrExtractionSchema = z.object({
  boardIndependence: z.number().nullable(),
  ethicsPolicy: z.boolean().nullable(),
  antiCorruptionPolicy: z.boolean().nullable(),
  whistleblowerPolicy: z.boolean().nullable(),
  riskManagement: z.boolean().nullable(),
  regulatoryCompliance: z.boolean().nullable(),
  governanceTraining: z.number().nullable(),
  complianceIncidents: z.number().nullable(),
});