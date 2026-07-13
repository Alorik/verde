import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
  try {
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:"Document upload failed",
      }, {
        status: 500
      }
    )
  }
}