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
