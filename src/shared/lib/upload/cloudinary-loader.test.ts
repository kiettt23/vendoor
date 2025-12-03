import { describe, it, expect } from "vitest";
import {
  buildTransformString,
  isCloudinaryUrl,
  transformCloudinaryUrl,
  getBlurPlaceholderUrl,
} from "./cloudinary-loader";

describe("buildTransformString", () => {
  it("returns empty string for empty options", () => {
    const result = buildTransformString({});

    expect(result).toBe("");
  });

  it("builds width parameter", () => {
    const result = buildTransformString({ width: 400 });

    expect(result).toBe("w_400");
  });

  it("builds height parameter", () => {
    const result = buildTransformString({ height: 300 });

    expect(result).toBe("h_300");
  });

  it("builds crop parameter", () => {
    const result = buildTransformString({ crop: "fill" });

    expect(result).toBe("c_fill");
  });

  it("builds gravity parameter", () => {
    const result = buildTransformString({ gravity: "face" });

    expect(result).toBe("g_face");
  });

  it("builds quality parameter", () => {
    const result = buildTransformString({ quality: "auto" });

    expect(result).toBe("q_auto");
  });

  it("builds numeric quality parameter", () => {
    const result = buildTransformString({ quality: 80 });

    expect(result).toBe("q_80");
  });

  it("builds format parameter", () => {
    const result = buildTransformString({ format: "webp" });

    expect(result).toBe("f_webp");
  });

  it("builds dpr parameter", () => {
    const result = buildTransformString({ dpr: 2 });

    expect(result).toBe("dpr_2");
  });

  it("combines multiple parameters with comma", () => {
    const result = buildTransformString({
      width: 400,
      height: 300,
      crop: "fill",
      quality: "auto",
      format: "auto",
    });

    expect(result).toBe("w_400,h_300,c_fill,q_auto,f_auto");
  });

  it("maintains parameter order", () => {
    const result = buildTransformString({
      format: "webp",
      width: 200,
      quality: "auto:best",
      crop: "thumb",
    });

    expect(result).toBe("w_200,c_thumb,q_auto:best,f_webp");
  });
});

describe("isCloudinaryUrl", () => {
  it("returns true for Cloudinary URL", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

    expect(isCloudinaryUrl(url)).toBe(true);
  });

  it("returns true for Cloudinary URL with transformations", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/w_400,h_300/sample.jpg";

    expect(isCloudinaryUrl(url)).toBe(true);
  });

  it("returns false for non-Cloudinary URL", () => {
    const url = "https://example.com/images/sample.jpg";

    expect(isCloudinaryUrl(url)).toBe(false);
  });

  it("returns false for localhost URL", () => {
    const url = "http://localhost:3000/images/sample.jpg";

    expect(isCloudinaryUrl(url)).toBe(false);
  });

  it("returns false for relative path", () => {
    const url = "/images/sample.jpg";

    expect(isCloudinaryUrl(url)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isCloudinaryUrl("")).toBe(false);
  });
});

describe("transformCloudinaryUrl", () => {
  const baseUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  it("adds width transformation", () => {
    const result = transformCloudinaryUrl(baseUrl, { width: 400 });

    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg"
    );
  });

  it("adds multiple transformations", () => {
    const result = transformCloudinaryUrl(baseUrl, {
      width: 400,
      height: 300,
      crop: "fill",
    });

    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill/sample.jpg"
    );
  });

  it("returns original URL for non-Cloudinary URL", () => {
    const nonCloudinaryUrl = "https://example.com/image.jpg";

    const result = transformCloudinaryUrl(nonCloudinaryUrl, { width: 400 });

    expect(result).toBe(nonCloudinaryUrl);
  });

  it("returns original URL for empty options", () => {
    const result = transformCloudinaryUrl(baseUrl, {});

    expect(result).toBe(baseUrl);
  });

  it("handles URL with existing transformations", () => {
    const urlWithTransform =
      "https://res.cloudinary.com/demo/image/upload/w_100/sample.jpg";

    const result = transformCloudinaryUrl(urlWithTransform, { width: 400 });

    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_400/w_100/sample.jpg"
    );
  });

  it("handles URL with folder path", () => {
    const urlWithFolder =
      "https://res.cloudinary.com/demo/image/upload/products/image123.jpg";

    const result = transformCloudinaryUrl(urlWithFolder, {
      width: 300,
      quality: "auto",
    });

    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/w_300,q_auto/products/image123.jpg"
    );
  });

  it("handles all quality modes", () => {
    expect(transformCloudinaryUrl(baseUrl, { quality: "auto:best" })).toContain(
      "q_auto:best"
    );
    expect(transformCloudinaryUrl(baseUrl, { quality: "auto:eco" })).toContain(
      "q_auto:eco"
    );
  });
});

describe("getBlurPlaceholderUrl", () => {
  const baseUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  it("generates low quality placeholder", () => {
    const result = getBlurPlaceholderUrl(baseUrl);

    expect(result).toContain("w_10");
    expect(result).toContain("q_30");
    expect(result).toContain("f_auto");
  });

  it("returns original URL for non-Cloudinary URL", () => {
    const nonCloudinaryUrl = "https://example.com/image.jpg";

    const result = getBlurPlaceholderUrl(nonCloudinaryUrl);

    expect(result).toBe(nonCloudinaryUrl);
  });

  it("maintains URL structure", () => {
    const result = getBlurPlaceholderUrl(baseUrl);

    expect(result).toContain("res.cloudinary.com");
    expect(result).toContain("sample.jpg");
  });
});
