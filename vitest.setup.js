import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

/**
 * Vitest Setup File
 *
 * File này chạy TRƯỚC mỗi test suite
 * Dùng để:
 * 1. Extend Vitest với custom matchers từ jest-dom
 * 2. Cleanup sau mỗi test
 * 3. Setup global mocks nếu cần
 */

// ============================================
// EXTEND MATCHERS
// ============================================
// Thêm custom matchers từ @testing-library/jest-dom
// Giờ có thể dùng:
// - expect(element).toBeInTheDocument()
// - expect(button).toBeDisabled()
// - expect(input).toHaveValue('text')
// - etc.
expect.extend(matchers);

// ============================================
// CLEANUP AFTER EACH TEST
// ============================================
// Tự động cleanup DOM sau mỗi test
// Prevent memory leaks và test pollution
afterEach(() => {
  cleanup();
});

// ============================================
// GLOBAL MOCKS
// ============================================

// Mock Next.js router (nếu cần test components dùng useRouter)
global.mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: "/",
  query: {},
  asPath: "/",
};

// Mock window.matchMedia (nhiều components dùng responsive design)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver (dùng cho lazy loading, infinite scroll)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock fetch (nếu test code gọi API)
// Vitest tự có fetch mock, nhưng có thể custom thêm
global.fetch = vi.fn();

// Mock console methods (optional - để test không spam logs)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
//   log: vi.fn(),
// };
