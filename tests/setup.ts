/**
 * Vitest Setup File
 *
 * Chạy trước mỗi test file để setup môi trường test.
 */

/// <reference types="vitest/globals" />

import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// Reset mocks sau mỗi test
afterEach(() => {
  vi.clearAllMocks();
});
