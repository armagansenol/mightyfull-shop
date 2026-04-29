# Technology Stack

**Analysis Date:** 2026-02-27

## Languages

**Primary:**
- TypeScript 5 - Application code, React components, API routes, utilities
- JavaScript (ES6+) - Configuration files, build scripts

**Secondary:**
- SCSS/SASS 1.80.3 - Component styling and global styles
- CSS 3 - Tailwind utilities and PostCSS processing

## Runtime

**Environment:**
- Node.js - Latest LTS (inferred from `.env` setup)

**Package Manager:**
- npm - `package-lock.json` present
- Lockfile: Present and maintained

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
- React 19 - UI library and components
- React DOM 19 - DOM rendering

**UI Component Libraries:**
- Radix UI (multiple packages) 1.x - Unstyled, accessible component primitives
  - `@radix-ui/react-accordion` - Collapsible content
  - `@radix-ui/react-avatar` - User avatars
  - `@radix-ui/react-checkbox` - Form checkboxes
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-icons` - Icon set
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-radio-group` - Radio button groups
  - `@radix-ui/react-scroll-area` - Custom scrollable areas
  - `@radix-ui/react-select` - Dropdown selects
  - `@radix-ui/react-slot` - Render delegation
  - `@radix-ui/react-tooltip` - Hover tooltips

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8 - CSS transformations
- SASS 1.80.3 - SCSS preprocessing
- Tailwind Merge 2.5.4 - Utility class deduplication
- Tailwind Animate 1.0.7 - Animation utilities
- Class Variance Authority 0.7.0 - Type-safe component variant management

**Form Management:**
- React Hook Form 7.54.2 - Performant form state management
- `@hookform/resolvers` 4.1.3 - Schema validation integration (Zod, etc.)
- Zod 3.24.2 - TypeScript-first schema validation

**Data Management:**
- TanStack React Query 5.59.20 - Server state management and caching
- TanStack React Query DevTools 5.59.20 - Development debugging tools
- Zustand 5.0.0 - Lightweight client-side state management

**Animations & Motion:**
- GSAP 3.12.5 - Professional animation library
- `@gsap/react` 2.1.1 - React integration for GSAP
- Motion 12.6.3 - Framer Motion alternatives for animations
- Lenis 1.2.3 - Smooth scrolling library
- Embla Carousel 8.3.1 - Carousel/slider component
- Embla Carousel React 8.3.1 - React wrapper for Embla
- Embla Carousel Auto-Scroll 8.3.1 - Auto-scrolling plugin
- Embla Carousel Fade 8.3.1 - Fade effect plugin

**CMS & Content:**
- Sanity 3.61.0 - Headless CMS client
- Next Sanity 9.8.36 - Next.js integration for Sanity
- `@portabletext/react` 3.1.0 - Portable Text rich text renderer

**E-commerce:**
- Shopify Hydrogen React 2025.1.3 - Official Shopify React components
- Shopify Storefront API Client 1.0.4 - Shopify GraphQL client

**UI Utilities:**
- Sonner 1.7.4 - Toast notifications
- Lucide React 0.454.0 - Icon library
- NumberFlow React 0.5.7 - Animated number transitions
- Use Hooks TS 3.1.0 - TypeScript hooks collection
- `@uidotdev/usehooks` 2.4.1 - Modern React hooks
- React Use 17.6.0 - Collection of React utility hooks
- Use Resize Observer 9.1.0 - Window resize detection
- Next Themes 0.4.4 - Dark mode/theme management

**Image Processing:**
- Sharp 0.33.5 - High-performance image processing

**Development Tools:**
- Hamo 1.0.0-dev.6 - Development utility
- Tempus 1.0.0-dev.10 - Development utility

## Testing & Code Quality

**Linting:**
- ESLint 9 - JavaScript/TypeScript linting
- `@typescript-eslint/eslint-plugin` 8 - TypeScript-specific rules
- `@typescript-eslint/parser` 8 - TypeScript parser for ESLint
- `@next/eslint-plugin-next` 16.1.6 - Next.js-specific ESLint rules

**Formatting:**
- Prettier - Code formatting (configuration not detected but likely used)
- `@trivago/prettier-plugin-sort-imports` 5.2.0 - Import sorting for Prettier

**Type Checking:**
- TypeScript 5 - Static type checking

**Testing:**
- Not detected in current setup (Jest, Vitest, or other test runners not configured)

## Key Dependencies

**Critical:**
- Next.js 16.1.6 - Framework foundation, requires all Next.js features
- React 19 - Core rendering engine
- TypeScript 5 - Type system and development experience
- Shopify Storefront API Client 1.0.4 - E-commerce product and cart operations
- Sanity 3.61.0 - Content management and queries
- React Hook Form 7.54.2 - Form handling across application
- TanStack React Query 5.59.20 - Server state synchronization

**Infrastructure:**
- Sharp 0.33.5 - Image optimization for Next.js
- PostCSS 8 - CSS processing pipeline
- SASS 1.80.3 - Component styling preprocessing

## Configuration

**Environment:**
- Configuration via environment variables (`.env` and `.env.local` present)
- Next.js standard `.env` pattern used
- Node environment detection: `process.env.NODE_ENV`

**Build:**
- `next.config.mjs` - ESM configuration with image optimization for Shopify CDN and Sanity CDN
- `tsconfig.json` - TypeScript strict mode enabled, ES6 target, bundler module resolution
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS with Tailwind support
- `eslint.config.mjs` - ESLint configuration (ESLint 9 flat config)

**Image Processing:**
- Remote image sources configured in `next.config.mjs`:
  - `cdn.shopify.com` - Product images from Shopify
  - `cdn.sanity.io` - Content images from Sanity CMS
  - `images.unsplash.com` - External stock images

## Platform Requirements

**Development:**
- Node.js (version unspecified, likely 18+)
- npm package manager
- git version control
- SCSS/SASS compilation

**Production:**
- Node.js runtime
- Environment variables configured for:
  - Shopify API credentials
  - Sanity CMS credentials
  - Klaviyo email marketing
  - Okendo reviews platform
- Static export or server-side rendering via Next.js

**Deployment:**
- Compatible with Vercel (Next.js native)
- Compatible with any Node.js hosting (self-hosted or alternatives)
- Image optimization requires Sharp (provided)
- Serverless function support (API routes in `/app/api/`)

---

*Stack analysis: 2026-02-27*
