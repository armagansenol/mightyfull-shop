# Codebase Structure

**Analysis Date:** 2026-02-27

## Directory Layout

```
mightyfull-shop/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # RootLayout: Providers, global setup
│   ├── (main)/                    # Route group for main pages
│   │   ├── home/                  # Homepage
│   │   │   ├── page.tsx
│   │   │   └── home.module.scss
│   │   ├── shop/                  # Product catalog
│   │   │   ├── page.tsx           # Shop listing
│   │   │   └── [slug]/            # Dynamic product detail
│   │   │       └── page.tsx
│   │   ├── contact/               # Contact page
│   │   ├── our-story/             # Brand story page
│   │   ├── faq/                   # FAQ page
│   │   ├── privacy-policy/        # Legal page
│   │   └── store-locator/         # Store locator page
│   └── api/                       # Route handlers
│       ├── contact/               # POST form submissions
│       ├── revalidate/            # ISR revalidation webhook
│       └── debug/                 # Development debugging
│
├── components/                    # Reusable UI components
│   ├── cart/                      # Shopping cart feature
│   │   ├── actions.ts             # Server actions (mutations)
│   │   ├── cart-context.tsx       # Cart context + reducer
│   │   ├── add-to-cart/           # Add to cart button
│   │   ├── cart-content/          # Cart drawer content
│   │   ├── cart-item/             # Individual cart item
│   │   ├── checkout-button/       # Checkout trigger
│   │   ├── hooks/                 # Cart-specific hooks
│   │   └── ...other cart subcomponents/
│   │
│   ├── header/                    # Navigation header
│   ├── footer/                    # Footer with links
│   ├── wrapper/                   # Layout wrapper with Lenis
│   │
│   ├── product-card/              # Product card component
│   ├── product-highlight-carousel/ # Featured product carousel
│   ├── product-images/            # Product image gallery
│   ├── product-specs/             # Product specifications table
│   ├── purchase-panel/            # Add-to-cart panel with options
│   │
│   ├── ui/                        # Radix UI + shadcn/ui components
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── accordion.tsx
│   │   └── ...other UI components/
│   │
│   ├── utility/                   # Utility wrapper components
│   │   ├── img/                   # Next.js Image wrapper
│   │   ├── link/                  # Next.js Link wrapper
│   │   ├── video/                 # Video player component
│   │   ├── loading-spinner/       # Loading indicator
│   │   └── scrollable-box/        # Scrollable container
│   │
│   ├── providers/                 # Context providers
│   │   ├── cart/                  # CartProvider
│   │   └── react-query/           # ReactQueryProvider
│   │
│   ├── gsap/                      # GSAP animation setup
│   ├── lenis/                     # Lenis smooth scroll setup
│   ├── parallax/                  # Parallax animation component
│   ├── marquee/                   # Scrolling marquee component
│   ├── letter-swap-forward/       # Text animation component
│   ├── letter-swap-on-hover/      # Letter swap on hover animation
│   ├── package-animation/         # Package animation
│   ├── fade-in/                   # Fade in animation
│   ├── fade-in-out-carousel/      # Fade carousel
│   ├── animated-card/             # Animated card component
│   │
│   ├── okendo-widget/             # Reviews widget integration
│   ├── customer-reviews/          # Reviews display component
│   ├── follow-us/                 # Social follow component
│   ├── contact-form/              # Contact form
│   ├── custom-toast/              # Custom toast notifications
│   ├── feature-highlight/         # Feature grid component
│   ├── faq-list/                  # FAQ accordion list
│   ├── out-of-stock/              # Out of stock indicator
│   ├── quantity/                  # Quantity selector
│   ├── price/                     # Price display component
│   ├── product/                   # Product-specific components
│   ├── icons/                     # SVG icon components
│   ├── customized-portable-text/  # Sanity portable text renderer
│   ├── auto-scroll-carousel/      # Auto-scrolling carousel
│   └── horizontal-scroll/         # Horizontal scroll container
│
├── hooks/                         # Custom React hooks
│   ├── use-debounce/
│   ├── use-interval/
│   ├── use-mouse-position/
│   ├── use-page-change/
│   ├── use-scroll-lock/
│   ├── use-overlapping-layers/
│   └── use-reload-on-resize/
│
├── context/                       # React Context definitions
│   └── layout-data.tsx            # Global layout data context
│
├── lib/                           # Business logic & utilities
│   ├── shopify/                   # Shopify API integration
│   │   ├── index.ts               # cartService + shopifyFetch
│   │   ├── types.ts               # GraphQL response types
│   │   ├── config.ts              # API config & headers
│   │   ├── logger.ts              # API call logging
│   │   ├── transformers.ts        # Response transformers
│   │   ├── mutations/             # GraphQL mutations
│   │   │   ├── cart.ts            # Cart mutations (add/remove/update)
│   │   │   └── ...other mutations/
│   │   ├── queries/               # GraphQL queries
│   │   │   ├── product.ts         # Product queries
│   │   │   ├── cart.ts            # Cart queries
│   │   │   └── ...other queries/
│   │   └── fragments/             # GraphQL fragments
│   │
│   ├── sanity/                    # Sanity CMS integration
│   │   ├── client.ts              # Sanity client + sanityFetch
│   │   ├── types.ts               # Sanity schema types
│   │   ├── layout.ts              # Layout query (nav, footer, etc)
│   │   ├── home.ts                # Home page query
│   │   ├── productPage.ts         # Product detail query
│   │   ├── products.ts            # Products list query
│   │   ├── productHighlight.ts    # Featured products query
│   │   ├── testimonials.ts        # Testimonials query
│   │   ├── faq.ts                 # FAQ query
│   │   ├── productSlider.ts       # Slider query
│   │   ├── guide.ts               # Guide query
│   │   ├── featureHighlightQuery.ts
│   │   ├── animatedCards.ts
│   │   ├── collection.ts
│   │   ├── noticebar.ts
│   │   ├── person.ts
│   │   ├── store.ts
│   │   ├── productDetail.ts
│   │   └── fragments/             # GROQ fragments
│   │
│   ├── actions/                   # Server actions (data aggregation)
│   │   ├── product-highlight.ts   # Fetch + enrich highlighted products
│   │   ├── related-products.ts    # Fetch related products for detail page
│   │   └── all-products.ts        # Fetch all products
│   │
│   ├── okendo/                    # Okendo reviews API
│   │   ├── queries.ts             # Review queries
│   │   ├── types.ts               # Review types
│   │   └── hooks/                 # Okendo-specific hooks
│   │
│   ├── klaviyo/                   # Klaviyo email API
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── hooks/
│   │
│   ├── store/                     # Zustand stores
│   │   ├── modal/                 # Modal state store
│   │   └── purchase/              # Purchase option state
│   │
│   ├── constants.ts               # App constants (routes, colors, tags)
│   ├── utils.ts                   # Utility functions
│   └── type-guards.ts             # TypeScript type guards
│
├── types/                         # Global TypeScript types
│   └── index.ts                   # App-specific types (AnimatedCard, StoreDetails, etc)
│
├── styles/                        # Global styles
│   ├── global.scss                # Global styles + Tailwind reset
│   ├── tailwind-initial.css       # Tailwind CSS import
│   ├── okendo-widget.scss         # Okendo widget overrides
│   ├── buttons.module.scss        # Global button styles
│   ├── _colors.scss               # Color palette
│   ├── _fonts.scss                # Font definitions
│   ├── _functions.scss            # SCSS functions/mixins
│   ├── _variables.scss            # SCSS variables
│   ├── _themes.scss               # Theme variables
│   ├── _utils.scss                # Utility classes
│   ├── _reset.scss                # CSS reset
│   ├── _layout.scss               # Layout utilities
│   ├── _scroll.scss               # Scroll styling
│   ├── _spacers.scss              # Spacing utilities
│   ├── _easings.scss              # Animation easing functions
│   └── _forms.scss                # Form styling
│
├── public/                        # Static assets
│   ├── img/                       # Images
│   ├── video/                     # Video files
│   ├── fonts/                     # Font files
│   │   └── bomstad-display/       # Custom display font
│   └── favicon/                   # Favicon variants
│
├── .planning/
│   └── codebase/                  # Documentation files
│
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config (baseUrl: ".", paths: "@/*": ["./*"])
├── tailwind.config.ts             # Tailwind customization
├── next.config.mjs                # Next.js config (image remotes, SASS, rewrites)
└── README.md                      # Project documentation
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components (`.tsx`), layout files, API handlers
- Key files: `layout.tsx` (root), `(main)/*/page.tsx` (routes), `api/*/route.ts` (handlers)

**components/**
- Purpose: Reusable UI components organized by feature/domain
- Contains: React components (client + server), module styles, sub-components
- Key files: Cart feature (largest), product components, animation wrappers, providers

**lib/**
- Purpose: Business logic, external API integrations, utilities
- Contains: Service classes, query builders, server actions, type definitions
- Key files: `shopify/index.ts` (cart service), `sanity/client.ts`, `actions/*.ts` (server functions)

**hooks/**
- Purpose: Custom React hooks for reusable logic
- Contains: Each hook in its own directory with `index.ts`
- Key files: None particularly large; mostly animation/scroll/observer hooks

**context/**
- Purpose: React Context definitions for global state
- Contains: Context creation, provider components, custom hooks
- Key files: `layout-data.tsx` (global data from Sanity)

**styles/**
- Purpose: Global and component-scoped styles
- Contains: SCSS files (modules + globals), CSS custom properties, design tokens
- Key files: `global.scss` (entry point), `_colors.scss`, `_functions.scss` (mixins)

**types/**
- Purpose: Shared TypeScript type definitions
- Contains: Interfaces and types for app-wide use
- Key files: `index.ts` (all types)

**public/**
- Purpose: Static assets served by Next.js
- Contains: Images, videos, fonts, favicon
- Key files: Images (cookie graphics), video (hero), custom fonts

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: RootLayout with all providers, hydrates layout data
- `app/(main)/home/page.tsx`: Homepage (hero, testimonials, feature grid)
- `app/(main)/shop/page.tsx`: Product listing
- `app/(main)/shop/[slug]/page.tsx`: Product detail (images, specs, reviews, related)

**Configuration:**
- `lib/constants.ts`: Routes, colors, breakpoints, API versions
- `lib/shopify/config.ts`: Shopify API endpoint, headers, cache strategy
- `lib/sanity/client.ts`: Sanity client config, fetch wrapper
- `next.config.mjs`: Image remotes, SASS config, rewrites
- `tsconfig.json`: Path alias `@/*` for imports

**Core Logic:**
- `lib/shopify/index.ts`: cartService (create, get, add, remove, update)
- `components/cart/actions.ts`: Server actions for cart mutations
- `components/cart/cart-context.tsx`: Cart state + reducer
- `lib/actions/product-highlight.ts`: Fetch + enrich featured products
- `components/providers/cart/index.tsx`: CartProvider setup

**Testing:**
- Not detected - no test files in codebase

**Data Queries:**
- `lib/sanity/*.ts`: GROQ queries for each page/section
- `lib/shopify/queries/*.ts`: GraphQL queries for products, cart
- `lib/shopify/mutations/cart.ts`: GraphQL mutations for cart operations

## Naming Conventions

**Files:**
- Component files: `index.tsx` (exports component) or named (e.g., `Cart.tsx`)
- Style files: `[component-name].module.scss` (component-scoped) or `.scss` (global)
- Server actions: `actions.ts` (multiple actions per file)
- Queries/mutations: `*.ts` in `queries/` and `mutations/` directories
- Hooks: `index.ts` inside hook directories
- Types: `types.ts` for domain-specific types, `index.ts` for app-wide types

**Directories:**
- Feature directories use kebab-case (e.g., `add-to-cart`, `product-highlight-carousel`)
- Context files: `[context-name].tsx` (e.g., `layout-data.tsx`)
- API routes follow app structure (e.g., `app/api/contact/route.ts`)

**Components:**
- Components: PascalCase (e.g., `Cart`, `ProductCard`, `PurchasePanel`)
- Props interfaces: `${ComponentName}Props`
- Exported from `index.tsx` or named file

**Functions & Variables:**
- Functions: camelCase (e.g., `sanityFetch`, `cartService.add()`)
- Constants: UPPER_SNAKE_CASE (e.g., `TAGS.cart`, `HIDDEN_PRODUCT_TAG`)
- Server actions: camelCase with clear action name (e.g., `addItem`, `removeItem`)

**Styles:**
- BEM-like classes in module SCSS (e.g., `.product-card`, `.product-card__image`)
- Utility classes via Tailwind (e.g., `flex`, `grid`, `gap-4`)
- CSS custom properties for themes (e.g., `--primary`, `--secondary`)
- Module exports: `import s from './component.module.scss'` + usage as `className={s.selector}`

## Where to Add New Code

**New Feature:**
- Primary code: `components/[feature-name]/index.tsx` + subcomponents in `components/[feature-name]/`
- Server actions: `components/[feature-name]/actions.ts` (if mutations needed)
- Styles: `components/[feature-name]/[feature-name].module.scss`
- Hooks: `hooks/use-[feature-name]/index.ts` (if complex logic)
- Tests: Not present in codebase currently

**New Page:**
- Implementation: `app/(main)/[page-name]/page.tsx`
- Styles: `app/(main)/[page-name]/[page-name].module.scss` (optional)
- Query: `lib/sanity/[page-name].ts` (if needs Sanity data)
- Layout: Use `<Wrapper>` component with `colorTheme` prop

**New Component/Module:**
- Implementation: `components/[component-name]/index.tsx`
- Sub-components: Create subdirectories for complex components
- Export pattern: `export { default as ComponentName } from './ComponentName.tsx'` in `index.tsx`
- Add to appropriate feature folder (e.g., `components/cart/`, `components/ui/`)

**Utilities:**
- Shared helpers: `lib/utils.ts` (general utilities)
- Domain-specific: `lib/[domain]/utils.ts` or inline in service files
- Type guards: `lib/type-guards.ts` (TypeScript validation)

**Hooks:**
- Location: `hooks/use-[hook-name]/index.ts`
- Naming: Start with `use-` prefix following React convention
- Export: `export { useHookName } from './index.ts'` or direct from `index.ts`

**Styles:**
- Global styles: `styles/global.scss` (append to file)
- Component styles: `components/[component]/[component].module.scss`
- Shared variables: `styles/_variables.scss`, `styles/_colors.scss`
- Mixins/functions: `styles/_functions.scss`

**API Routes:**
- Location: `app/api/[feature]/route.ts`
- Pattern: Export `async function POST(request: Request)` or `GET`
- Error handling: Try-catch with NextResponse for errors
- Authentication: Use environment variables for secrets

**Server Actions:**
- Location: `components/[feature]/actions.ts` or `lib/actions/[action-name].ts`
- Pattern: Top-level `'use server'` directive, then export async functions
- Validation: Check inputs before calling services
- Error handling: Wrap with `try-catch`, return `{ success, message }`

## Special Directories

**components/providers/:**
- Purpose: Context and provider setup
- Generated: No
- Committed: Yes
- Contains: ReactQueryProvider, CartProvider with setup logic

**components/ui/:**
- Purpose: Base UI components from Radix UI + shadcn/ui
- Generated: No
- Committed: Yes
- Contains: Button, Input, Select, Form, Dialog, etc. with Tailwind + custom styling

**components/utility/:**
- Purpose: Wrapper components around common patterns
- Generated: No
- Committed: Yes
- Contains: Img (Next.js Image wrapper), Link (Next.js Link wrapper), Video, etc.

**components/icons/:**
- Purpose: SVG icon components
- Generated: No
- Committed: Yes
- Contains: Custom icons (IconCloud, IconLeftArm, etc.) + imported from lucide-react

**lib/shopify/queries/ & mutations/:**
- Purpose: GraphQL query/mutation strings
- Generated: No
- Committed: Yes
- Contains: GROQ strings for Shopify Storefront API

**lib/sanity/fragments/:**
- Purpose: Reusable GROQ query fragments
- Generated: No
- Committed: Yes
- Contains: Field selection fragments for Sanity queries

**public/**
- Purpose: Static assets
- Generated: No (images/videos checked in)
- Committed: Yes
- Contains: Images, fonts, video files for hero and product displays

**.next/**
- Purpose: Build artifacts
- Generated: Yes (after `npm run build`)
- Committed: No
- Contains: Compiled JS, optimized images, server bundles

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes (via `npm install`)
- Committed: No

---

*Structure analysis: 2026-02-27*
