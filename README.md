# TEESOULZ — Premium Indian Streetwear & Fashion E-Commerce Frontend

<p align="center">
  <img src="public/teesoulz-logo.png" alt="TEESOULZ Official Emblem" width="160" />
</p>

<p align="center">
  <strong>Contemporary, bold, minimal, fashion-forward Indian streetwear ecommerce platform.</strong><br>
  Engineered with <strong>Next.js 16 (App Router & Turbopack)</strong>, <strong>React 19</strong>, <strong>TypeScript</strong>, <strong>Tailwind CSS v4</strong>, and <strong>GSAP</strong>.
</p>

<p align="center">
  <a href="https://teesoulz.in"><strong>teesoulz.in</strong></a> • 
  <a href="#key-features">Key Features</a> • 
  <a href="#tech-stack">Tech Stack</a> • 
  <a href="#product-catalog">Product Catalog</a> • 
  <a href="#seo--geo-optimization">SEO & Geo</a> • 
  <a href="#quick-start">Quick Start</a>
</p>

---

## 🖤 Brand Vision & Design Direction

TEESOULZ bridges the editorial fashion presentation of international streetwear with the commercial browsing and product discovery patterns of India's leading streetwear labels (such as *Bonkers Corner* and *Warriorworld*).

### Official Design Tokens
- **Primary Black**: `#080808` (Deep, pure ink black)
- **Primary White**: `#FFFFFF` (Crisp contrast)
- **Silver Grey**: `#B8B8B8` (Refined streetwear accent)
- **Soft Grey**: `#F3F3F3` (Muted surface)
- **Primary Text**: `#111111`
- **Secondary Text**: `#666666`
- **Border**: `#E5E5E5` / `#222222` (Dark surfaces)

---

## ⚡ Key Features

### 1. Header & Navigation
- **Official Monogram Brand Logo**: Preserved proportions, crisp rendering on all displays.
- **Infinite Running Marquee Ticker**: Real-time promotional announcements, active coupon codes (`SOUL10`), and pan-India free shipping thresholds.
- **Mega-Menu**: Categorized dropdown navigation with editorial drop imagery and keyboard accessibility.
- **Mobile Navigation Drawer**: Background scroll-locked responsive drawer with direct access to categories, search, accounts, and orders.
- **Global Search Modal**: Instant real-time search with live product previews and filter shortcuts.

### 2. Full-Width Split Editorial Hero Slider
- **Auto-Play Kinetics**: Seamless **3-second auto-advance** between curated streetwear drops (*01 Noir Monolith*, *02 Cyber Tokyo*, *03 Architectural Hoodies*, *04 Streetwear Essentials*).
- **Synchronized 3-Second Progress Bar**: Continuous visual indicator showing slide timing.
- **GSAP Staggered Motion**: Dynamic text reveal, subtitle shifts, and smooth crossfade image zoom.
- **Micro-Specs Bar**: Live fabric and tailoring callouts (`280 GSM French Terry`, `Boxy Drop-Shoulder`, `Zero-Sag Lycra Collar`).
- **Interactive Controls**: Manual override with previous/next arrows, slide index counter (`01 / 04`), and desktop thumbnail strips.

### 3. Product Discovery & Listings
- **Multi-Row Responsive Grids**: 2-column mobile layout, 3-column tablet layout, and 4-column desktop layout (8 items per curated homepage carousel).
- **Comprehensive Shop Page (`/shop`)**: Dynamic URL search param syncing with multi-facet filters:
  - Category (Oversized, Graphic, Hoodies, Bottomwear, Accessories)
  - Gender (Unisex, Men, Women)
  - Size (XS, S, M, L, XL, XXL)
  - Price Range & In-Stock toggle
  - Sorting (Featured, Newest, Price: Low to High, Price: High to Low, Bestselling)
- **Interactive Product Cards**: Secondary image crossfade on hover, direct size-picker Quick Add, color swatches, and live stock tags.

### 4. Product Detail Experience (`/product/[slug]`)
- **Multi-Angle Gallery**: High-definition zoom and thumbnail switcher.
- **Live Variant Selection**: Dynamic pricing, real-time stock limits, and out-of-stock disabling.
- **Pan-India PIN Code Checker**: Validates 6-digit Indian PIN codes with estimated delivery dates (Blue Dart / Delhivery Express).
- **Interactive Size Guide**: Modal with chest, length, and shoulder measurements in inches and centimeters with fit recommendations.
- **Doorstep Exchange & Specifications**: Accordions for fabric composition, care instructions, and 7-day return policies.
- **Mobile Sticky "Add to Bag" Bar**: Thumb-accessible bottom bar ensuring 1-tap conversion while reading reviews.

### 5. Cart, Checkout & Order Tracking
- **Slide-In Mini Cart Drawer**: Free shipping threshold calculation meter (`₹1,499`), quantity steppers, item removal, and live coupon application.
- **Active Promotional Engine**: Pre-configured coupon codes (`SOUL10`, `STREET15`, `FIRSTDROP`, `FREESHIP`).
- **Full Dedicated Cart Page (`/cart`)**: Complete cart breakdown, price summary, and coupon management.
- **2-Step Streamlined Checkout (`/checkout`)**:
  - Step 1: Shipping address with state/PIN code validation.
  - Step 2: Payment method selection supporting **UPI (Google Pay, PhonePe, Paytm)**, **Credit / Debit Cards**, **Net Banking**, and **Cash on Delivery (COD)**.
- **Order Confirmation Page (`/order-confirmation/[orderId]`)**: Printable receipt with live AWB courier tracking simulation.

---

## 🌐 SEO & Geo-Targeting Optimization

The application is engineered to dominate Google Search and Indian localized streetwear queries:

- **Official Logo as Favicon**: High-resolution icons configured for all standard browser tabs, Android home screens, and Apple touch devices (`favicon.png`, `icon.png`, `apple-touch-icon.png`).
- **Schema.org Structured Data (JSON-LD)**:
  - `ClothingStore` / `Organization` Schema: Official logo, brand description, price range, INR currency, and India headquarters.
  - `WebSite` Schema with `SearchAction` (Google Sitelinks Searchbox).
  - `Product` Schema on all 28 product pages with aggregate ratings, price, INR currency, stock availability, and merchant return policies.
  - `BreadcrumbList` Schema for hierarchical Google search listings.
- **Geo-Location Meta Tags**:
  - `geo.region`: `IN-MH` (Maharashtra, India)
  - `geo.placename`: `Mumbai, India`
  - `geo.position`: `19.0760;72.8777`
  - `ICBM`: `19.0760, 72.8777`
  - `og:locale`: `en_IN`
- **Dynamic Sitemap & Robots**:
  - `sitemap.xml`: Auto-generated sitemap covering all 71+ static and dynamic product/category routes.
  - `robots.txt`: Directs search engine crawlers and points to the sitemap index.

---

## 👕 Product Catalog

The platform includes **28 production-quality streetwear garments and accessories**:

1. **Noir Heavyweight Oversized Tee** — 260 GSM Super-combed French Terry
2. **Cyber Tokyo Archival Graphic Tee** — Neo-Tokyo silkscreen backprint
3. **Architectural Boxy Hoodie** — 420 GSM Brushed loopback cotton
4. **Tactical Multi-Pocket Cargo Trousers** — 290 GSM Ripstop with bungee cuffs
5. **Vintage Washed Charcoal Graphic Tee** — Acid wash with distressed hem
6. **Heavy French Terry Crewneck Sweatshirt** — 380 GSM minimal drop-shoulder
7. **Monochrome Distressed Street Cap** — 3D embroidered logo chino twill
8. **Heavyweight Oversized Boxy Tee (Off-White)** — 260 GSM optical white
9. **Raw Canvas Heavy Utility Tote Bag** — 16oz industrial canvas
10. **Relic Skull Gothic Backprint Tee** — Discharge zero-handfeel print
11. **Heavy Knit Relaxed Sweatpants** — 380 GSM diagonal loop terry
12. **Pure White Minimal Oversized Tee** — Foundational uniform staple
13. **Matrix Cyber Distortion Tee** — Underground glitch series
14. **Vintage Mineral Washed Boxy Tee** — 280 GSM volcanic stone washed
15. **Tactical Parachute Cargo Trousers** — 6-pocket accordion cargo
16. **Archival Minimal Half-Zip Sweatshirt** — 400 GSM with gunmetal YKK hardware
17. **Women’s Heavyweight Boxy Crop Tee** — 240 GSM architectural waist cut
18. **Concrete Melange Architectural Hoodie** — 420 GSM heathered grey fleece
19. **Neo-Tokyo Kanji Heavy Long-Sleeve Tee** — Japanese typography sleeve prints
20. **Noir Raw Cut Wide-Leg Denim** — 14oz rigid shuttle-woven black denim
21. **Distressed Metal Tag Dad Cap** — Custom riveted gunmetal logo bar
22. **Acid Stone-Wash Oversized Heavy Tee** — 1-of-1 marble acid wash
23. **Cyber Glitch Typography Statement Tee** — 1mm embossed 3D silicone puff print
24. **Women’s Parachute High-Waist Cargo** — Bungee hem balloon silhouette
25. **Heavyweight Oversized Muscle Tank** — 240 GSM raw-cut armholes
26. **Boxy Heavy Fleece Two-Way Zip Hoodie** — 420 GSM reversible double-zip
27. **Heavy Ribbed Streetwear Socks 3-Pack** — Arch-support combed cotton trio
28. **Brutalist Chrome Monogram Heavy Tee** — 280 GSM liquid metal reflective ink

---

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [GSAP (GreenSock)](https://greensock.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom Brand SVGs
- **Deployment Ready**: Optimized for Vercel, Netlify, or Node.js Docker containers.

---

## 🚀 Quick Start

### Prerequisites
- Node.js `18.18+` or `20+`
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Kaushaltiwari27/teesoulz.git

# Navigate into the project folder
cd teesoulz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 📁 Project Structure

```text
teesoulz/
├── public/
│   ├── favicon.png              # Official browser favicon
│   ├── icon.png                 # App icon & OpenGraph logo
│   ├── apple-touch-icon.png     # iOS touch icon
│   └── teesoulz-logo.png        # Official high-resolution brand asset
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Global layout, SEO, Geo tags, and JSON-LD
│   │   ├── page.tsx             # Homepage layout
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   ├── robots.ts            # Robots.txt directives
│   │   ├── globals.css          # Design tokens & marquee keyframes
│   │   ├── shop/                # Complete catalog & multi-filter page
│   │   ├── product/[slug]/      # Dynamic PDP with Google Shopping schema
│   │   ├── category/[slug]/     # Dynamic category listing
│   │   ├── collections/[slug]/  # Dynamic capsule drops
│   │   ├── cart/                # Dedicated cart & coupon manager
│   │   ├── checkout/            # 2-step checkout (UPI, Cards, COD)
│   │   ├── order-confirmation/  # Live AWB tracking receipt
│   │   └── policies/            # Shipping, Returns, Privacy, Terms
│   ├── components/
│   │   ├── common/              # Header, Footer, Drawers, Modals
│   │   ├── home/                # Hero Slider, Marquee, Carousels, Stories
│   │   └── product/             # Cards, Grids, Filters, Size Guides
│   ├── context/
│   │   └── StoreContext.tsx     # Cart, Wishlist, Coupons, and Modals state
│   ├── data/
│   │   └── mockData.ts          # 28 products, categories, coupons data
│   └── types/
│       └── index.ts             # Strict TypeScript definitions
├── package.json
└── README.md
```

---

## 📄 License & Credits

Built for **TEESOULZ** — All rights reserved.
Developed as a production-grade Indian streetwear ecommerce experience.
