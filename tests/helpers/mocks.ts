import { vi } from "vitest";

// ============================================================================
// Prisma Mock
// ============================================================================

export const mockPrisma = {
  productVariant: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  order: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  orderItem: {
    createMany: vi.fn(),
  },
  payment: {
    create: vi.fn(),
  },
  vendorProfile: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((callback) => callback(mockPrisma)),
};

// ============================================================================
// Auth Mocks
// ============================================================================

export const mockSession = {
  user: {
    id: "user-123",
    email: "customer@test.com",
    name: "Test Customer",
    roles: ["CUSTOMER"],
  },
};

export const mockVendorSession = {
  user: {
    id: "vendor-123",
    email: "vendor@test.com",
    name: "Test Vendor",
    roles: ["CUSTOMER", "VENDOR"],
  },
};

export const mockAdminSession = {
  user: {
    id: "admin-123",
    email: "admin@test.com",
    name: "Test Admin",
    roles: ["CUSTOMER", "ADMIN"],
  },
};

// ============================================================================
// Next.js Mocks
// ============================================================================

export const mockRevalidateTag = vi.fn();
export const mockRevalidatePath = vi.fn();
export const mockRedirect = vi.fn();
export const mockHeaders = vi.fn(() => new Headers());

// ============================================================================
// Helper Functions
// ============================================================================

export function resetAllMocks() {
  vi.clearAllMocks();
}

export function setupAuthMock(session: typeof mockSession | null) {
  return vi.fn().mockResolvedValue({ session });
}
