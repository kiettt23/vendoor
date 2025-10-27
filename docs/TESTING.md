# Testing Guide

## 📋 Overview

This project uses **Vitest** for unit testing with comprehensive coverage of business logic.

### Test Statistics
- **Total Tests**: 102 ✅
- **Test Files**: 10
- **Overall Coverage**: 19.28%
- **Service Coverage**: 87.65% 🎯

---

## 🚀 Quick Start

### Run Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Watch mode with coverage
npm run test:coverage:watch
```

---

## 📊 Coverage Report

### By Layer

| Layer | Coverage | Tests | Status |
|-------|---------|-------|--------|
| **Services** | 87.65% | 57 tests | ✅ Excellent |
| **Validations** | 48.27% | 18 tests | ✅ Good |
| **Utils** | 34.48% | 27 tests | ✅ Adequate |
| **API Routes** | 0% | N/A | ⚪ Integration tests needed |
| **Components** | 0% | N/A | ⚪ Component tests needed |

### Service Layer Detail

| Service | Coverage | Tests | Priority |
|---------|---------|-------|----------|
| addressService | 100% | 3 | ✅ Complete |
| cartService | 100% | 6 | ✅ Complete |
| productService | 100% | 9 | ✅ Complete |
| storeService | 90.69% | 18 | ✅ Excellent |
| orderService | 91.66% | 11 | ✅ Excellent |
| couponService | 81.25% | 6 | ✅ Very Good |
| ratingService | 55% | 4 | ✅ Adequate |

---

## 🏗️ Test Structure

```
lib/
├── services/
│   ├── __tests__/
│   │   ├── addressService.test.js    (3 tests)
│   │   ├── cartService.test.js       (6 tests)
│   │   ├── couponService.test.js     (6 tests)
│   │   ├── orderService.test.js      (11 tests)
│   │   ├── productService.test.js    (9 tests)
│   │   ├── ratingService.test.js     (4 tests)
│   │   └── storeService.test.js      (18 tests)
│   └── ...service files
│
├── utils/
│   └── __tests__/
│       ├── formatters.test.js        (12 tests)
│       └── helpers.test.js           (15 tests)
│
└── validations/
    └── __tests__/
        └── schemas.test.js           (18 tests)
```

---

## 🎯 Testing Philosophy

### What We Test (High Priority)

✅ **Business Logic** (Services)
- CRUD operations
- Validation logic
- Error handling
- Edge cases

✅ **Utilities** (Utils)
- Formatters (price, date, phone)
- Helpers (calculations)
- Validators

✅ **Validation** (Schemas)
- Zod schema validation
- Input sanitization

### What We Don't Test (Low Priority)

⚪ **Framework Code**
- Next.js routing
- React rendering
- External libraries

⚪ **Trivial Code**
- Getters/setters
- Simple constants
- Config files

⚪ **UI Components** (Needs separate strategy)
- Component tests (React Testing Library)
- E2E tests (Playwright/Cypress)

---

## 📝 Writing Tests

### Test Structure (AAA Pattern)

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ServiceName', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  describe('methodName', () => {
    it('should do something successfully', async () => {
      // Arrange - Setup test data
      const input = { /* test data */ };
      mockFunction.mockResolvedValue({ /* mock response */ });

      // Act - Execute the function
      const result = await service.method(input);

      // Assert - Verify results
      expect(result).toEqual({ /* expected output */ });
      expect(mockFunction).toHaveBeenCalledWith(/* expected args */);
    });

    it('should throw error when invalid input', async () => {
      // Arrange
      mockFunction.mockResolvedValue(null);

      // Act & Assert
      await expect(service.method('invalid')).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Mocking Prisma

```javascript
// Mock at top of test file
vi.mock('@/lib/prisma', () => ({
  default: {
    model: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Import after mocking
import prisma from '@/lib/prisma';
import { serviceToTest } from '../serviceToTest';
```

---

## 🎨 Best Practices

### ✅ DO

1. **Test business logic**, not implementation details
2. **Use descriptive test names**: "should create order when valid data"
3. **Test edge cases**: null, empty, invalid inputs
4. **Mock external dependencies**: Prisma, APIs, file system
5. **Follow AAA pattern**: Arrange → Act → Assert
6. **Clear mocks** between tests: `beforeEach(vi.clearAllMocks)`

### ❌ DON'T

1. **Don't test framework code** (Next.js, React internals)
2. **Don't test trivial code** (getters, constants)
3. **Don't aim for 100% coverage** (diminishing returns)
4. **Don't test implementation** (test behavior, not how it works)
5. **Don't make tests dependent** (each test should be isolated)

---

## 🔍 Coverage Thresholds

### Current Thresholds

```javascript
// Global (whole project)
lines: 15%
functions: 14%
branches: 15%
statements: 15%

// Services layer (business logic)
lines: 70%
functions: 70%
branches: 65%
statements: 70%
```

### Why These Numbers?

- **Global 15%**: Realistic for full-stack app (APIs, UI not unit tested)
- **Services 70%**: Business logic MUST be well-tested
- **Not 100%**: Following industry best practices (Google, Facebook use 60-80%)

---

## 🐛 Debugging Tests

### Test Fails?

```bash
# Run specific test file
npx vitest lib/services/__tests__/orderService.test.js

# Run with verbose output
npx vitest --reporter=verbose

# Run single test
npx vitest -t "should create order successfully"
```

### Check Coverage

```bash
# Generate HTML coverage report
npm run test:coverage

# Open report in browser
open coverage/index.html
```

---

## 📈 Future Improvements

### Phase 2: Integration Tests
- [ ] API route testing (Supertest)
- [ ] Database integration tests
- [ ] Authentication flows

### Phase 3: Component Tests
- [ ] React component testing (Testing Library)
- [ ] User interaction tests
- [ ] Accessibility testing

### Phase 4: E2E Tests
- [ ] Critical user flows (Playwright)
- [ ] Cross-browser testing
- [ ] Performance testing

---

## 🎓 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest to Vitest Migration](https://vitest.dev/guide/migration.html)

---

## 📞 Support

If tests are failing or you need help:

1. Check test output for error messages
2. Run `npm run test:coverage` to see what's not covered
3. Review this guide for best practices
4. Ask the team! 🙋‍♂️

---

**Last Updated**: October 27, 2025
**Test Framework**: Vitest 4.0.3
**Coverage**: 87.65% (Services Layer)
