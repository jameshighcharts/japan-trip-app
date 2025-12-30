import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not configured");
      return NextResponse.json(
        { error: "Blob storage not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading file:", file.name, "Size:", file.size);

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    console.log("Upload successful:", blob.url);

    return NextResponse.json({
      url: blob.url,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Failed to upload: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
