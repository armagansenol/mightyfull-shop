# Coding Conventions

**Analysis Date:** 2026-02-27

## Naming Patterns

**Files:**
- Component files: lowercase with hyphens (`header.tsx`, `cart-content/index.tsx`)
- SCSS modules: `ComponentName.module.scss` (e.g., `header.module.scss`)
- Server actions: `actions.ts` (e.g., `components/cart/actions.ts`)
- Query/mutation files: suffixed with query or mutation (e.g., `getCartQuery`, `createCartMutation`)
- Hook files: `use-hook-name/index.ts` (e.g., `hooks/use-debounce/index.ts`)
- Type guard files: `type-guards.ts`
- Fragment files: `fragmentName.ts` (e.g., `lib/sanity/fragments/image.ts`)

**Functions:**
- camelCase for all function names
- Arrow functions for utility functions: `export const functionName = (params) => {}`
- Named async functions for server actions: `export async function actionName(params) {}`
- Private helper functions: lowercase with leading underscore or no prefix: `function helperName() {}`
- Type-guarding functions: `is<Type>` pattern (e.g., `isShopifyError`, `isObject`)

**Variables:**
- camelCase for all variables
- CONSTANT_CASE for environment-like constants and enums
- Enum members: UPPER_CASE (e.g., `CartOperationType.ADD`, `PurchaseOption.oneTime`)
- Context/provider hooks: `use<Context>` (e.g., `useLayoutData()`, `useFormField()`)
- Exported module objects: camelCase (e.g., `cartService`, `config`, `routes`)

**Types:**
- PascalCase for all interface and type names
- `Props` suffix for component prop types: `CartContentProps`, `HeaderProps`
- `Query`/`Response` suffix for API types: `CartOperation`, `ShopifyResponse`, `LayoutQueryResponse`
- Union types named descriptively: `CartUpdateType = 'plus' | 'minus' | 'delete'`
- Generic type parameters: `T`, `TFieldValues`, `TName` (common React patterns)

## Code Style

**Formatting:**
- Prettier configured with:
  - `printWidth: 80`
  - `tabWidth: 2`
  - `singleQuote: true`
  - `semi: true`
  - `trailingComma: none`
- All files auto-formatted on save

**Linting:**
- ESLint with Next.js plugin and TypeScript support
- Config: `eslint.config.mjs` (flat config format)
- Plugins: `@next/next`, `@typescript-eslint`
- Recommended and core-web-vitals rules enforced
- TypeScript strict mode enabled in `tsconfig.json`

## Import Organization

**Order:**
1. React/Node built-ins: `import React from 'react'`, `import { cookies } from 'next/headers'`
2. Third-party packages: `import { motion } from 'motion/react'`, `import { usePathname } from 'next/navigation'`
3. Absolute aliases: `import { cn } from '@/lib/utils'`, `import { Header } from '@/components/header'`
4. Relative imports: `import s from './header.module.scss'`

**Path Aliases:**
- Base alias: `@/*` → root directory (configured in `tsconfig.json`)
- Common patterns:
  - `@/components/` - React components
  - `@/lib/` - utilities, services, helpers
  - `@/hooks/` - custom React hooks
  - `@/types/` - TypeScript types and interfaces
  - `@/context/` - React context providers
  - `@/styles/` - global stylesheets

**Import Statements:**
- ESM syntax throughout: `import ... from '...'` and `export ...`
- No default exports from utilities (use named exports)
- Components may be default or named exports
- Server-side only files marked with `'use server'` directive at top of file
- Client-side only files marked with `'use client'` directive at top of file

## Error Handling

**Patterns:**
- Server actions return discriminated unions: `{ success: true, message: string } | { success: false, message: string }`
- Error objects caught as `unknown` type, then narrowed with type guards: `if (error instanceof Error) { error.message }`
- Validation functions return objects: `{ success: boolean; message?: string }`
- Async operations wrap in try-catch blocks
- Error messages extracted before returning: `formatErrorForToast(error)` function in `components/cart/actions.ts`
- Errors logged with context: `console.error('Operation description:', error)`
- Graphql errors parsed: `error.message.includes('GraphQL error:')` and split by delimiter

**Error Boundary Examples:**
- `lib/shopify/index.ts`: `handleShopifyError(error, query)` centralizes Shopify error handling
- `app/api/contact/route.ts`: Generic try-catch with 500 status response

## Logging

**Framework:** Native `console` object

**Patterns:**
- `console.log()` for informational messages with context description
- `console.error()` for error logging with context prefix
- Messages descriptive: `'Operation completed, running cart cleanup...'`
- JSON objects logged for debugging: `JSON.stringify(data, null, 2)`
- Performance timing: `const startTime = performance.now()` then calculate duration
- Conditional logging in development: Debug logs use `shopifyLogger.logApiCall(query, duration, { variables })`

**Examples:**
- `console.log('Found ${count} zero-quantity items to remove:', JSON.stringify(items, null, 2))`
- `console.error('Error cleaning up zero-quantity items:', e)`
- Performance-tracked API calls in `shopifyFetch<T>()`

## Comments

**When to Comment:**
- JSDoc comments for exported functions: `/** * Description of what the function does */`
- Inline comments for non-obvious logic or workarounds
- No comments for self-documenting code

**JSDoc/TSDoc:**
- Applied to helper functions in server actions (see `cleanupZeroQuantityItems`, `withCartCleanup`)
- Format: `/** * Description * @param paramName Description * @returns Description */`
- Not applied to component props (use TypeScript interfaces instead)
- Not applied to obvious one-liners

**Example:**
```typescript
/**
 * Helper function to check for and remove any zero-quantity items from the cart
 * @param cartId The cart ID to check
 * @returns True if any items were removed, false otherwise
 */
async function cleanupZeroQuantityItems(
  cartId: string,
  maxRetries = 2
): Promise<boolean> {
```

## Function Design

**Size:**
- Keep functions focused on single responsibility
- Server action wrapper functions handle cross-cutting concerns (validation, cleanup)
- Utility functions 10-30 lines typical (e.g., `truncateString`, `capitalize`, `extractShopifyId`)
- Complex operations split into helper functions (see `components/cart/actions.ts` with multiple helpers)

**Parameters:**
- Destructure object parameters: `{ cartId, lines }` instead of positional args
- Optional parameters with defaults: `maxRetries = 2`
- Generic type parameters for reusable functions: `<T>` in fetch/service functions
- Typed parameter objects: `{ success: boolean; message?: string }`

**Return Values:**
- Async functions return Promises: `Promise<Cart | undefined>`
- Server actions return result objects: `{ success: boolean; message: string }`
- Validation functions return narrowed types: never throws from type guards (return boolean instead)
- Generic functions return `T` with proper constraints: `Promise<T>`

## Module Design

**Exports:**
- Named exports preferred for utilities and constants
- `export const` for functions and objects
- `export function` for traditional functions
- Single default export for React components (sometimes both default and named)
- `export interface` for types (not exported as default)

**Barrel Files:**
- `index.ts` exports from directory (e.g., `components/cart/index.tsx` re-exports cart components)
- Used for cleaner imports: `import { Cart } from '@/components/cart'` instead of `from '@/components/cart/cart'`

**Module Organization:**
- Service modules encapsulate API logic: `createCartService()` factory returns service object
- Transformer modules handle data reshaping: `ShopifyTransformer` static methods
- Context modules provide React context setup: `LayoutDataProvider` in `context/layout-data.tsx`
- Query/mutation modules separate GraphQL definitions
- Fragment modules separate reusable GraphQL fragments

---

*Convention analysis: 2026-02-27*
