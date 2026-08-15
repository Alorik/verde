import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function GET() {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: "test/s3-connection-test.txt",
        Body: "S3 connection successful!",
        ContentType: "text/plain",
      }),
    );

    return Response.json({
      success: true,
      message: "S3 upload successful",
    });
  } catch (error) {
    console.error("S3 connection error:", error);

    return Response.json(
      {
        success: false,
        error: "S3 connection failed",
      },
      { status: 500 },
    );
  }
}
