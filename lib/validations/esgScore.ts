import z from "zod";

export const electricityExtractionSchema = z.object({
  electricityCost: z.number(),
  unitsConsumed: z.number(),
  unit: z.string().nullable(),
});
