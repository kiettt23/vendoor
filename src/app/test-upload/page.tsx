"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface UploadResult {
  success: boolean;
  url: string;
  publicId: string;
}

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Cloudinary Upload (POC)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-600 font-medium">
                  ✅ Upload success!
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium">URL:</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all text-xs"
                >
                  {result.url}
                </a>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium">Public ID:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {result.publicId}
                </code>
              </div>

              <img
                src={result.url}
                alt="Uploaded"
                className="w-full rounded border"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
