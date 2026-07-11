import { NextResponse } from "next/server";

export async function POST() {
  try {
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "" },
      {
        status: 400,
      },
    );
  }
}
