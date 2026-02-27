# Testing Patterns

**Analysis Date:** 2026-02-27

## Test Framework

**Runner:**
- Not configured - No test framework installed (Jest, Vitest, etc. not in dependencies)
- TypeScript compilation verified with `tsc` command

**Assertion Library:**
- Not applicable - No testing framework present

**Run Commands:**
```bash
npm run tsc              # Type checking only
npm run lint            # ESLint checking
npm run build           # Next.js build verification
npm run dev             # Development server
```

## Test File Organization

**Current Status:**
- **No test files found** in source code
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files in `src/`, `components/`, `lib/`, or `hooks/` directories
- Testing infrastructure not implemented

**Recommended Structure (if testing is added):**
- Co-located pattern: `__tests__` directory next to source files
- Alternative pattern: `tests/` directory at root with mirrored structure
- Files named: `[component/function].test.ts` or `[component/function].spec.ts`

## Test Structure

**No existing tests to analyze**

**Recommended approach when implementing:**
```typescript
describe('[Unit/Integration] [Module/Component]', () => {
  describe('[Feature/Method name]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = {};

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

**Patterns to consider:**
- Use describe blocks for grouping related tests
- Use it blocks with descriptive names starting with "should"
- Follow AAA pattern: Arrange, Act, Assert
- One assertion per test preferred (or grouped related assertions)

## Mocking

**Framework:**
- Not yet configured (would typically use Jest or Vitest mocking)
- TanStack React Query DevTools available for query state inspection

**Patterns (recommended when implementing):**
- Mock server functions: `vi.mock('@/components/cart/actions')` or jest equivalent
- Mock Next.js router: Mock `next/navigation` hooks
- Mock Shopify API calls: Mock `shopifyFetch<T>()` function
- Mock Sanity client: Mock `@/lib/sanity/client` exports

**What to Mock:**
- External API calls (Shopify, Sanity, email services)
- Next.js specific modules (`next/navigation`, `next/headers`, `next/cache`)
- Third-party SDK clients
- File system operations

**What NOT to Mock:**
- Utility functions (`cn()`, `capitalize()`, `truncateString()`)
- Type guards and validators
- Business logic in pure functions
- Context providers (wrap in tests instead)

## Fixtures and Factories

**Test Data:**
- No existing fixtures or factories
- Would typically create factory functions for types defined in `types/index.ts`
- Example structure for fixtures:

```typescript
// tests/fixtures/cart.ts
export const mockCart = (): Cart => ({
  id: 'test-cart-123',
  lines: [
    {
      id: 'line-1',
      quantity: 1,
      merchandise: {
        id: 'variant-1',
        title: 'Test Product',
        selectedOptions: [],
        product: { id: 'product-1', title: 'Test', handle: 'test' }
      },
      cost: {
        totalAmount: { amount: '10.00', currencyCode: 'USD' }
      }
    }
  ],
  checkoutUrl: 'https://checkout.shopify.com/...'
});
```

**Location:**
- Recommended: `tests/fixtures/` or `__fixtures__/` adjacent to test files
- Or co-located: `__mocks__/` directory in each feature area

## Coverage

**Requirements:**
- Not enforced - No coverage configuration present
- No coverage thresholds set

**View Coverage (when implemented):**
```bash
vitest --coverage     # If using Vitest
jest --coverage       # If using Jest
```

## Test Types

**Unit Tests (recommended scope when implementing):**
- Test individual functions in isolation
- Test utilities: `cn()`, `capitalize()`, `truncateString()`, `extractShopifyId()`
- Test type guards: `isShopifyError()`, `isObject()`
- Test pure functions without side effects

**Integration Tests (recommended scope when implementing):**
- Test server actions with mocked Shopify/Sanity APIs
- Test complex workflows: cart operations with cleanup
- Test data transformations: `ShopifyTransformer.reshapeCart()`
- Test API routes: `app/api/contact/route.ts`
- Test hooks with context providers
- Test form submission flows

**E2E Tests:**
- Not configured
- Framework recommendation: Playwright or Cypress
- Scope: User workflows like add-to-cart, checkout, navigation
- Would test against staging environment

## Common Patterns

**Async Testing (recommended when implementing):**
```typescript
// Using async/await
it('should fetch cart data', async () => {
  const result = await cartService.get('cart-123');
  expect(result).toBeDefined();
});

// Using waitFor for state updates
it('should update cart after adding item', async () => {
  const { getByText } = render(<CartComponent />);
  fireEvent.click(getByText('Add to Cart'));

  await waitFor(() => {
    expect(getByText('1 item')).toBeInTheDocument();
  });
});
```

**Error Testing (recommended when implementing):**
```typescript
it('should handle Shopify errors gracefully', async () => {
  vi.mocked(shopifyFetch).mockRejectedValueOnce(
    new Error('GraphQL error: Invalid cart ID')
  );

  const result = await cartService.get('invalid-id');

  expect(result).toBeUndefined();
});

// For server actions
it('should return error object when validation fails', async () => {
  const result = await addItem(undefined, 0);

  expect(result.success).toBe(false);
  expect(result.message).toContain('variant');
});
```

**React Component Testing (recommended when implementing):**
```typescript
// Test with providers
const renderWithProviders = (component) => {
  return render(
    <ReactQueryProvider>
      <CartProvider>
        {component}
      </CartProvider>
    </ReactQueryProvider>
  );
};

it('should render empty cart message', () => {
  const { getByText } = renderWithProviders(<CartContent cart={undefined} />);
  expect(getByText('Your cart is empty')).toBeInTheDocument();
});
```

## Current Testing Approach

**Type Safety:**
- Primary testing method: TypeScript strict mode
- `tsconfig.json` enforces strict type checking
- Run `npm run tsc` to validate types

**Linting:**
- Secondary validation: ESLint with Next.js rules
- Run `npm run lint` to check code quality

**Build Validation:**
- Run `npm run build` to catch issues before deployment
- Next.js build process validates page structure, types, and imports

---

*Testing analysis: 2026-02-27*
