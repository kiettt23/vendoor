import { describe, it, expect } from "vitest";
import { FILE_UPLOAD, IMAGE_DIMENSIONS, CLOUDINARY_PRESETS } from "./upload";

describe("FILE_UPLOAD constants", () => {
  it("defines max file size in MB", () => {
    expect(FILE_UPLOAD.MAX_SIZE_MB).toBe(5);
  });

  it("defines max file size in bytes matching MB value", () => {
    expect(FILE_UPLOAD.MAX_SIZE_BYTES).toBe(5 * 1024 * 1024);
  });

  it("allows JPEG, PNG, WebP formats", () => {
    expect(FILE_UPLOAD.ALLOWED_IMAGE_TYPES).toContain("image/jpeg");
    expect(FILE_UPLOAD.ALLOWED_IMAGE_TYPES).toContain("image/png");
    expect(FILE_UPLOAD.ALLOWED_IMAGE_TYPES).toContain("image/webp");
  });

  it("does not allow GIF format", () => {
    expect(FILE_UPLOAD.ALLOWED_IMAGE_TYPES).not.toContain("image/gif");
  });

  it("defines matching file extensions", () => {
    expect(FILE_UPLOAD.ALLOWED_IMAGE_EXTENSIONS).toContain(".jpg");
    expect(FILE_UPLOAD.ALLOWED_IMAGE_EXTENSIONS).toContain(".jpeg");
    expect(FILE_UPLOAD.ALLOWED_IMAGE_EXTENSIONS).toContain(".png");
    expect(FILE_UPLOAD.ALLOWED_IMAGE_EXTENSIONS).toContain(".webp");
  });
});

describe("IMAGE_DIMENSIONS constants", () => {
  it("defines product thumbnail dimensions", () => {
    expect(IMAGE_DIMENSIONS.PRODUCT_THUMBNAIL.width).toBe(400);
    expect(IMAGE_DIMENSIONS.PRODUCT_THUMBNAIL.height).toBe(400);
  });

  it("defines product detail dimensions", () => {
    expect(IMAGE_DIMENSIONS.PRODUCT_DETAIL.width).toBe(800);
    expect(IMAGE_DIMENSIONS.PRODUCT_DETAIL.height).toBe(800);
  });

  it("defines product card dimensions", () => {
    expect(IMAGE_DIMENSIONS.PRODUCT_CARD.width).toBe(300);
    expect(IMAGE_DIMENSIONS.PRODUCT_CARD.height).toBe(300);
  });

  it("defines avatar dimensions", () => {
    expect(IMAGE_DIMENSIONS.AVATAR.width).toBe(200);
    expect(IMAGE_DIMENSIONS.AVATAR.height).toBe(200);
  });
});

describe("CLOUDINARY_PRESETS", () => {
  describe("PRODUCT_CARD preset", () => {
    it("has correct dimensions", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_CARD.width).toBe(300);
      expect(CLOUDINARY_PRESETS.PRODUCT_CARD.height).toBe(300);
    });

    it("uses fill crop mode", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_CARD.crop).toBe("fill");
    });

    it("uses auto quality and format", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_CARD.quality).toBe("auto");
      expect(CLOUDINARY_PRESETS.PRODUCT_CARD.format).toBe("auto");
    });
  });

  describe("PRODUCT_THUMBNAIL preset", () => {
    it("has smaller dimensions than card", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_THUMBNAIL.width).toBe(100);
      expect(CLOUDINARY_PRESETS.PRODUCT_THUMBNAIL.height).toBe(100);
    });
  });

  describe("PRODUCT_DETAIL preset", () => {
    it("has larger dimensions", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_DETAIL.width).toBe(800);
      expect(CLOUDINARY_PRESETS.PRODUCT_DETAIL.height).toBe(800);
    });

    it("uses limit crop to maintain aspect ratio", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_DETAIL.crop).toBe("limit");
    });

    it("uses best auto quality", () => {
      expect(CLOUDINARY_PRESETS.PRODUCT_DETAIL.quality).toBe("auto:best");
    });
  });

  describe("AVATAR preset", () => {
    it("has correct dimensions", () => {
      expect(CLOUDINARY_PRESETS.AVATAR.width).toBe(200);
      expect(CLOUDINARY_PRESETS.AVATAR.height).toBe(200);
    });

    it("uses face gravity for cropping", () => {
      expect(CLOUDINARY_PRESETS.AVATAR.gravity).toBe("face");
    });

    it("uses fill crop mode", () => {
      expect(CLOUDINARY_PRESETS.AVATAR.crop).toBe("fill");
    });
  });

  describe("STORE_LOGO preset", () => {
    it("has correct dimensions", () => {
      expect(CLOUDINARY_PRESETS.STORE_LOGO.width).toBe(400);
      expect(CLOUDINARY_PRESETS.STORE_LOGO.height).toBe(400);
    });
  });

  describe("BLUR_PLACEHOLDER preset", () => {
    it("has tiny width for fast loading", () => {
      expect(CLOUDINARY_PRESETS.BLUR_PLACEHOLDER.width).toBe(10);
    });

    it("uses low quality", () => {
      expect(CLOUDINARY_PRESETS.BLUR_PLACEHOLDER.quality).toBe(30);
    });
  });
});
