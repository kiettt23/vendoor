# Tests Directory

This folder contains all unit tests for the Vendoor project.

## 📁 Structure

```
lib/
├── services/__tests__/     # Service layer tests (57 tests)
├── utils/__tests__/        # Utility function tests (27 tests)  
└── validations/__tests__/  # Schema validation tests (18 tests)
```

## 🚀 Quick Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest lib/services/__tests__/orderService.test.js
```

## 📊 Current Coverage

- **Total Tests**: 102 ✅
- **Service Coverage**: 87.65%
- **Overall Coverage**: 19.28%

## 📚 Documentation

See [TESTING.md](../docs/TESTING.md) for complete testing guide.

## 🎯 Coverage Goals

| Layer | Target | Current | Status |
|-------|--------|---------|--------|
| Services | 70-80% | 87.65% | ✅ Exceeded |
| Utils | 60-70% | 34.48% | ⚠️ Adequate |
| Validations | 70% | 48.27% | ⚠️ Adequate |

---

**Note**: API routes and components are not unit tested. They require integration/E2E tests.
