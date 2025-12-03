import { describe, it, expect } from "vitest";
import {
  validateImageFile,
  validateFileSize,
  validateFileType,
  validateImageFiles,
} from "./validation";

function createMockFile(name: string, type: string, sizeInBytes: number): File {
  const buffer = new ArrayBuffer(sizeInBytes);
  return new File([buffer], name, { type });
}

describe("validateImageFile", () => {
  it("returns valid for JPEG file under size limit", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns valid for PNG file under size limit", () => {
    const file = createMockFile("test.png", "image/png", 2 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(true);
  });

  it("returns valid for WebP file under size limit", () => {
    const file = createMockFile("test.webp", "image/webp", 3 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(true);
  });

  it("returns error for unsupported file type (GIF)", () => {
    const file = createMockFile("test.gif", "image/gif", 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("JPEG");
    expect(result.error).toContain("PNG");
    expect(result.error).toContain("WEBP");
  });

  it("returns error for PDF file", () => {
    const file = createMockFile("test.pdf", "application/pdf", 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Chỉ chấp nhận các định dạng");
  });

  it("returns error for file exceeding 5MB limit", () => {
    const file = createMockFile("large.jpg", "image/jpeg", 6 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("quá lớn");
    expect(result.error).toContain("5MB");
  });

  it("returns error for very large file (10MB)", () => {
    const file = createMockFile("huge.png", "image/png", 10 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
  });

  it("returns valid for file exactly at 5MB limit", () => {
    const file = createMockFile("exact.jpg", "image/jpeg", 5 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(true);
  });

  it("checks file type before file size", () => {
    const file = createMockFile("large.gif", "image/gif", 10 * 1024 * 1024);

    const result = validateImageFile(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("định dạng");
  });
});

describe("validateFileSize", () => {
  it("returns valid for file under default limit", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 3 * 1024 * 1024);

    const result = validateFileSize(file);

    expect(result.valid).toBe(true);
  });

  it("returns error for file over default limit", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 6 * 1024 * 1024);

    const result = validateFileSize(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("quá lớn");
  });

  it("respects custom maxSizeMB parameter", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 3 * 1024 * 1024);

    const result = validateFileSize(file, 2);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("2MB");
  });

  it("allows larger files with higher limit", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 8 * 1024 * 1024);

    const result = validateFileSize(file, 10);

    expect(result.valid).toBe(true);
  });

  it("returns valid for empty file", () => {
    const file = createMockFile("empty.jpg", "image/jpeg", 0);

    const result = validateFileSize(file);

    expect(result.valid).toBe(true);
  });

  it("returns valid for file exactly at custom limit", () => {
    const file = createMockFile("exact.jpg", "image/jpeg", 2 * 1024 * 1024);

    const result = validateFileSize(file, 2);

    expect(result.valid).toBe(true);
  });
});

describe("validateFileType", () => {
  it("returns valid for allowed image type", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 1024);

    const result = validateFileType(file);

    expect(result.valid).toBe(true);
  });

  it("returns error for disallowed image type", () => {
    const file = createMockFile("test.gif", "image/gif", 1024);

    const result = validateFileType(file);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("Định dạng không hỗ trợ");
  });

  it("respects custom allowedTypes parameter", () => {
    const file = createMockFile("test.gif", "image/gif", 1024);

    const result = validateFileType(file, ["image/gif", "image/png"]);

    expect(result.valid).toBe(true);
  });

  it("rejects file not in custom allowedTypes", () => {
    const file = createMockFile("test.jpg", "image/jpeg", 1024);

    const result = validateFileType(file, ["image/png"]);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("PNG");
  });

  it("handles PDF file type", () => {
    const file = createMockFile("doc.pdf", "application/pdf", 1024);

    const result = validateFileType(file, ["application/pdf"]);

    expect(result.valid).toBe(true);
  });
});

describe("validateImageFiles", () => {
  it("returns valid for empty array", () => {
    const result = validateImageFiles([]);

    expect(result.valid).toBe(true);
  });

  it("returns valid for array of valid files", () => {
    const files = [
      createMockFile("test1.jpg", "image/jpeg", 1024 * 1024),
      createMockFile("test2.png", "image/png", 2 * 1024 * 1024),
      createMockFile("test3.webp", "image/webp", 1024 * 1024),
    ];

    const result = validateImageFiles(files);

    expect(result.valid).toBe(true);
  });

  it("returns error if any file has invalid type", () => {
    const files = [
      createMockFile("test1.jpg", "image/jpeg", 1024 * 1024),
      createMockFile("test2.gif", "image/gif", 1024 * 1024),
      createMockFile("test3.png", "image/png", 1024 * 1024),
    ];

    const result = validateImageFiles(files);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("test2.gif");
  });

  it("returns error if any file exceeds size limit", () => {
    const files = [
      createMockFile("small.jpg", "image/jpeg", 1024 * 1024),
      createMockFile("large.jpg", "image/jpeg", 10 * 1024 * 1024),
    ];

    const result = validateImageFiles(files);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("large.jpg");
    expect(result.error).toContain("quá lớn");
  });

  it("includes filename in error message", () => {
    const files = [createMockFile("invalid-file.bmp", "image/bmp", 1024)];

    const result = validateImageFiles(files);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("invalid-file.bmp");
  });

  it("stops at first invalid file", () => {
    const files = [
      createMockFile("invalid1.gif", "image/gif", 1024),
      createMockFile("invalid2.gif", "image/gif", 1024),
    ];

    const result = validateImageFiles(files);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("invalid1.gif");
    expect(result.error).not.toContain("invalid2.gif");
  });
});
