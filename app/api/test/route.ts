import { gemini } from "@/lib/gemni";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Reply with exactly: Gemini connection successful",
    });

    return NextResponse.json({
      message: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gemini request failed" },
      { status: 500 },
    );
  }
}
