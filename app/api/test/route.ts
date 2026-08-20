import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: "Reply with exactly: OpenAI connection successful",
    });

    return NextResponse.json({
      message: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "OpenAI request failed" },
      { status: 500 },
    );
  }
}
