import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { vi } from "vitest";

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
