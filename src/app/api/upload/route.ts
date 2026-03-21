import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// POST /api/upload - Upload an image file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: { message: "No file provided" } },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" } },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: { message: "File too large. Maximum size is 10MB" } },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to upload file" } },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete an uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { success: false, error: { message: "Filename is required" } },
        { status: 400 }
      );
    }

    // Security: Only allow deleting files from uploads directory
    const safeName = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", safeName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: { message: "File not found" } },
        { status: 404 }
      );
    }

    // Delete file
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete file" } },
      { status: 500 }
    );
  }
}
