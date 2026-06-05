# CoreSystems — E-commerce Frontend

React 18 · TypeScript · Vite · Redux Toolkit · Supabase

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| State | Redux Toolkit (RTK) |
| Backend | Supabase (Auth, Database, Storage) |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |
| Bundler | Vite 5 |
| Deploy | Vercel |

---

## Development setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your Supabase credentials
cp .env.example .env.local

# 3. Start dev server
npm run dev

# 4. Type-check
npm run lint
```

> The app works in **demo mode** (static data) if Supabase env vars are not set.

---

## Environment variables

```
VITE_SUPABASE_URL      # from Supabase > Project Settings > API
VITE_SUPABASE_ANON_KEY # from Supabase > Project Settings > API
```

---

## Supabase setup

### 1. Create project
Go to [supabase.com](https://supabase.com) → New project.

### 2. Run migrations
In Supabase Dashboard → SQL Editor:

```sql
-- Step 1: schema
-- Paste contents of supabase/schema.sql

-- Step 2: seed data
-- Paste contents of supabase/seed.sql
```

### 3. Configure Storage buckets
Go to Storage → New bucket for each:

| Bucket | Public |
|---|---|
| `product-images` | ✅ |
| `category-images` | ✅ |
| `avatars` | ✅ |
| `banners` | ✅ |
| `documents` | ❌ |

### 4. Configure Auth
Go to Authentication → Providers:
- Enable **Email** (email confirmations optional for dev)
- Optionally enable Google OAuth

Set **Site URL** to your Vercel URL or `http://localhost:5173`.

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

Or via GitHub integration: connect repo → add env vars → deploy.

Add a `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Project architecture

```
src/
├── app/store/              Redux store
│   ├── index.ts            configureStore + localStorage persistence
│   ├── hooks.ts            typed useAppDispatch / useAppSelector
│   └── slices/
│       ├── authSlice.ts    Auth state (user, session, profile)
│       ├── productsSlice.ts Products (items, deals, search, current)
│       ├── categoriesSlice.ts Categories
│       ├── cartSlice.ts    Cart with memoized summary selector
│       ├── favoritesSlice.ts Favorites with Set-based id lookup
│       └── uiSlice.ts      Loading, mobile menu state
│
├── services/               Supabase calls — components never query Supabase directly
│   ├── authService.ts
│   ├── productService.ts   → falls back to static data if Supabase not configured
│   ├── categoryService.ts
│   ├── storageService.ts   uploadFile / getPublicUrl / deleteFile
│   ├── cartService.ts
│   └── favoritesService.ts
│
├── lib/supabase.ts         Typed Supabase client
├── types/database.ts       Supabase row types (hand-written until `supabase gen types`)
├── utils/
│   ├── formatters.ts       formatCOP, formatPriceWithCurrency
│   └── validators.ts       Zod schemas for forms
├── constants/index.ts      Storage keys, bucket names, routes
│
├── hooks/
│   ├── useAuth.ts          Thin wrapper over authSlice
│   └── useDebounce.ts
│
├── routes/
│   ├── AppRouter.tsx       Lazy-loaded routes + Suspense
│   └── PrivateRoute.tsx    Redirects to /login if not authenticated
│
├── components/
│   ├── Navbar/             Uses Redux for cart count, favorites count, user state
│   ├── ProductCard/
│   ├── ProductListItem/    Uses Redux (addItem, toggleFavorite)
│   ├── ProductListing/     Accepts loading prop → shows skeleton
│   ├── Footer/
│   └── ui/
│       ├── Skeleton.tsx    ProductCardSkeleton, ProductListSkeleton
│       ├── EmptyState.tsx
│       └── LoadingSpinner.tsx
│
└── pages/
    ├── Home/               Dispatches fetchTodayDeals
    ├── ProductDetail/      Dispatches fetchProductById + fetchRelatedProducts
    ├── Cart/               Reads selectCartItems + selectCartSummary
    ├── Favorites/          Reads selectFavoriteItems
    ├── Search/             Local search via productService
    ├── Category/           Local fetch via productService
    ├── Login/              Real Supabase auth with Zod validation
    └── Register/           Real Supabase signUp with Zod validation
```

### Data flow

```
User interaction
  → Component dispatches Redux action/thunk
    → Thunk calls Service
      → Service calls Supabase (or static fallback)
        → Data returns to slice
          → Component re-renders via useAppSelector
```

### Cart & Favorites persistence

- **Unauthenticated**: stored in `localStorage` only (both are initialized from localStorage)
- **Authenticated**: on login, server state is fetched and merged into Redux store

The store's `subscribe` callback writes `cart.items` and `favorites.items` to localStorage on every state change.

---

## Database schema diagram

```
auth.users
    │
    └── profiles (1:1)

categories ──────────────── products
                                │
                           ┌────┴────┐
                           │         │
                    product_images  product_specs
                           │         │
                    product_sections  product_badges
                           │
                    featured_collection_items
                           │
                    featured_collections

auth.users ─── cart_items ──── products
auth.users ─── favorites  ──── products
```

---

## Adding Supabase generated types

Once your project is live, replace the manual types in `src/types/database.ts`:

```bash
npx supabase gen types typescript \
  --project-id your-project-id \
  --schema public \
  > src/types/database.ts
```

---

## Commands reference

```bash
npm run dev       # Start dev server on http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview   # Serve production build locally
npm run lint      # TypeScript type check (tsc --noEmit)
```
