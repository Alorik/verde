import { gemini } from "@/lib/gemni";
import { csrExtractionSchema } from "@/lib/validations/extractionSchema";

export async function extractCSRData(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const response = await gemini.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
      {
        text: `
Extract the following governance-related information from this CSR report:

- number or percentage of independent board members
- whether an ethics or code of conduct policy exists
- whether an anti-corruption or anti-bribery policy exists
- whether a whistleblower policy or mechanism exists
- whether a formal risk management framework exists
- whether the company reports regulatory compliance
- governance or compliance training hours
- number of compliance or ethical incidents

Return only JSON in this exact structure:

{
  "boardIndependence": number | null,
  "ethicsPolicy": boolean | null,
  "antiCorruptionPolicy": boolean | null,
  "whistleblowerPolicy": boolean | null,
  "riskManagement": boolean | null,
  "regulatoryCompliance": boolean | null,
  "governanceTraining": number | null,
  "complianceIncidents": number | null
}

Rules:

- Return null when the information cannot be found.
- Do not guess or infer values that are not supported by the report.
- For policy fields, return true only when the report explicitly indicates that the policy or mechanism exists.
- For boardIndependence, return the reported number or percentage exactly as a number.
- For governanceTraining, return the number of training hours.
- For complianceIncidents, return the number of reported incidents.
- Do not include any other fields.
        `,
      },
    ],

    config: {
      responseMimeType: "application/json",
    },
  });

  const rawResult = response.text;

  if (!rawResult) {
    throw new Error("Gemini returned no extraction result");
  }

  const parsedResult = JSON.parse(rawResult);

  return csrExtractionSchema.parse(parsedResult);
}
