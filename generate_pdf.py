import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#4B5563"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 755, "TEESOULZ -- Existing Project Technical Audit Report")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#6B7280"))
            self.drawRightString(572, 755, "STRICT MODE: INSPECT ONLY")
            self.setStrokeColor(colors.HexColor("#E5E7EB"))
            self.setLineWidth(0.75)
            self.line(40, 747, 572, 747)
        
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.75)
        self.line(40, 45, 572, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6B7280"))
        self.drawString(40, 32, "CONFIDENTIAL -- TEESOULZ Streetwear E-Commerce | Technical Architecture & Planning")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 32, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0F172A")
    c_muted = colors.HexColor("#475569")
    c_border = colors.HexColor("#E2E8F0")
    c_bg_light = colors.HexColor("#F8FAFC")
    
    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=c_muted,
        spaceAfter=10
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155"),
        spaceAfter=5
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3.5
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )
    table_cell_header = ParagraphStyle(
        'TableCellHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )
    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER HEADER, METADATA, EXECUTIVE SUMMARY, SECTION A
    # =========================================================================
    story.append(Paragraph("TEESOULZ -- EXISTING PROJECT TECHNICAL AUDIT", title_style))
    story.append(Paragraph("Comprehensive Frontend Architecture, Backend Readiness &amp; Security Assessment | Strict Mode: Inspect Only", subtitle_style))
    
    meta_data = [
        [
            Paragraph("<b>Target Domain:</b> teesoulz.vercel.app", table_cell),
            Paragraph("<b>Framework:</b> Next.js 16.4.2 (App Router)", table_cell),
            Paragraph("<b>Audit Date:</b> October 2026", table_cell)
        ],
        [
            Paragraph("<b>Architecture:</b> 100% Client-Side React 19 SPA", table_cell),
            Paragraph("<b>Database / API:</b> 0% Implemented (Mock Only)", table_cell),
            Paragraph("<b>Audit Mode:</b> Strict Read-Only Verification", table_cell)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[180, 180, 172])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # Executive Summary Card
    exec_summary = [
        [
            Paragraph("<b>EXECUTIVE SUMMARY &amp; AUDIT VERDICT:</b><br/>"
                      "The visual and interactive frontend for <b>TEESOULZ</b> is exceptionally complete, featuring <b>25 distinct client routes</b>, "
                      "responsive streetwear layouts, micro-animations (GSAP), and 3D visualizers (Three.js). However, <b>zero backend infrastructure exists</b>. "
                      "There are <b>no database tables, no server API endpoints, no authenticated sessions, and no active payment gateways</b>. "
                      "All state (cart, wishlist, user account, mock checkout) resides solely in browser memory and localStorage.<br/>"
                      "<b>Verdict:</b> The frontend is 100% production-ready visually and structurally. It can be wired directly to a PostgreSQL database, "
                      "Prisma ORM, Auth.js, and Razorpay without refactoring the UI layer.", callout_style)
        ]
    ]
    exec_table = Table(exec_summary, colWidths=[532])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#F59E0B")),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 10))

    # SECTION A: Current Technology Stack
    story.append(Paragraph("A. Current Technology Stack", h1_style))
    story.append(Paragraph("Rigorous inspection of <code>package.json</code>, dependencies, build toolchains, and configurations:", body_style))
    
    stack_data = [
        [Paragraph("Category", table_cell_header), Paragraph("Package / Technology", table_cell_header), Paragraph("Version", table_cell_header), Paragraph("Implementation Finding &amp; Role", table_cell_header)],
        [Paragraph("Framework", table_cell_bold), Paragraph("Next.js (App Router)", table_cell), Paragraph("16.4.2", table_cell), Paragraph("Implemented. Utilizing React Server Components runtime, though pages use 'use client'.", table_cell)],
        [Paragraph("UI Core", table_cell_bold), Paragraph("React / React-DOM", table_cell), Paragraph("19.3.0", table_cell), Paragraph("Implemented. Latest React 19 release powering client interactivity.", table_cell)],
        [Paragraph("Styling", table_cell_bold), Paragraph("Tailwind CSS", table_cell), Paragraph("^4.0.0", table_cell), Paragraph("Implemented via @tailwindcss/turbopack. Modern CSS-first engine.", table_cell)],
        [Paragraph("Icons", table_cell_bold), Paragraph("lucide-react", table_cell), Paragraph("^1.60.0", table_cell), Paragraph("Implemented across header, footer, product cards, filters, and modals.", table_cell)],
        [Paragraph("Animations", table_cell_bold), Paragraph("GSAP", table_cell), Paragraph("^3.15.0", table_cell), Paragraph("Implemented. High-performance tweening and micro-interactions.", table_cell)],
        [Paragraph("3D Rendering", table_cell_bold), Paragraph("Three.js &amp; @types/three", table_cell), Paragraph("^0.186.1", table_cell), Paragraph("Implemented. Interactive 3D garment/graphics display canvas.", table_cell)],
        [Paragraph("Language", table_cell_bold), Paragraph("TypeScript", table_cell), Paragraph("^5.0.0", table_cell), Paragraph("Strict typing verified across components, context, and data models.", table_cell)],
        [Paragraph("Linting / Build", table_cell_bold), Paragraph("ESLint 9 / next build", table_cell), Paragraph("16.4.2", table_cell), Paragraph("Standard Next.js compiler scripts (dev, build, start, lint).", table_cell)],
        [Paragraph("Backend / ORM", table_cell_bold), Paragraph("None (Prisma / Mongoose)", table_cell), Paragraph("N/A", table_cell), Paragraph("<b>NOT IMPLEMENTED.</b> No database driver or schema present.", table_cell)],
        [Paragraph("Auth Service", table_cell_bold), Paragraph("None (Auth.js / Supabase)", table_cell), Paragraph("N/A", table_cell), Paragraph("<b>NOT IMPLEMENTED.</b> Purely mocked client context.", table_cell)],
        [Paragraph("Payment SDK", table_cell_bold), Paragraph("None (Razorpay / Cashfree)", table_cell), Paragraph("N/A", table_cell), Paragraph("<b>NOT IMPLEMENTED.</b> Simulated checkout with JS setTimeout.", table_cell)]
    ]
    t_stack = Table(stack_data, colWidths=[75, 125, 52, 280])
    t_stack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_stack)
    
    # END PAGE 1 -> PAGE BREAK
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SECTION B - APPLICATION ROUTES
    # =========================================================================
    story.append(Paragraph("B. Current Architecture &amp; Application Routes", h1_style))
    story.append(Paragraph("The codebase adheres to the Next.js App Router specification under <code>src/app</code>. <b>25 distinct routes</b> were verified:", body_style))

    routes_data = [
        [Paragraph("Route URL", table_cell_header), Paragraph("File Path", table_cell_header), Paragraph("Classification", table_cell_header), Paragraph("Functional Evidence &amp; Status", table_cell_header)],
        [Paragraph("/", table_cell_bold), Paragraph("src/app/page.tsx", table_cell), Paragraph("<font color='#059669'>Implemented</font>", table_cell), Paragraph("Hero banners, category grids, featured items, recently viewed.", table_cell)],
        [Paragraph("/shop", table_cell_bold), Paragraph("src/app/shop/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Full catalog with client filtering (price, category, size, sort).", table_cell)],
        [Paragraph("/product/[slug]", table_cell_bold), Paragraph("src/app/product/[slug]/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Dynamic route resolving from static mock data. Add to cart works.", table_cell)],
        [Paragraph("/category/[slug]", table_cell_bold), Paragraph("src/app/category/[slug]/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Dynamic category filter based on static slug parameters.", table_cell)],
        [Paragraph("/collections", table_cell_bold), Paragraph("src/app/collections/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Seasonal and streetwear drop collection overviews.", table_cell)],
        [Paragraph("/collections/[slug]", table_cell_bold), Paragraph("src/app/collections/[slug]/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Collection-specific product listings mapped to static items.", table_cell)],
        [Paragraph("/cart", table_cell_bold), Paragraph("src/app/cart/page.tsx", table_cell), Paragraph("<font color='#059669'>Working Client State</font>", table_cell), Paragraph("Item quantity adjust, remove, subtotal, promo code client mock.", table_cell)],
        [Paragraph("/wishlist", table_cell_bold), Paragraph("src/app/wishlist/page.tsx", table_cell), Paragraph("<font color='#059669'>Working Client State</font>", table_cell), Paragraph("Favorite toggle, move to cart, localStorage persistence.", table_cell)],
        [Paragraph("/checkout", table_cell_bold), Paragraph("src/app/checkout/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Address form, pincode check, payment method selector (mocked).", table_cell)],
        [Paragraph("/order-confirmation/[id]", table_cell_bold), Paragraph("src/app/order-confirmation/...", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Static receipt display reading generated ID from query/param.", table_cell)],
        [Paragraph("/account", table_cell_bold), Paragraph("src/app/account/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Profile, mock order history, saved addresses in localStorage.", table_cell)],
        [Paragraph("/account/login", table_cell_bold), Paragraph("src/app/account/login/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Form accepts any input without password/credential check.", table_cell)],
        [Paragraph("/account/register", table_cell_bold), Paragraph("src/app/account/register/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Creates fake client user object in StoreContext.", table_cell)],
        [Paragraph("/track-order", table_cell_bold), Paragraph("src/app/track-order/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Visual progress bar accepting any order tracking number.", table_cell)],
        [Paragraph("/bestsellers", table_cell_bold), Paragraph("src/app/bestsellers/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Filtered list of mock products tagged as bestseller.", table_cell)],
        [Paragraph("/new-in", table_cell_bold), Paragraph("src/app/new-in/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Filtered list of mock products tagged as new arrivals.", table_cell)],
        [Paragraph("/sale", table_cell_bold), Paragraph("src/app/sale/page.tsx", table_cell), Paragraph("<font color='#D97706'>UI Only</font>", table_cell), Paragraph("Filtered list of items with discount / sale tags.", table_cell)],
        [Paragraph("/size-guide", table_cell_bold), Paragraph("src/app/size-guide/page.tsx", table_cell), Paragraph("<font color='#059669'>Implemented</font>", table_cell), Paragraph("Static size measurement chart for streetwear tees and hoodies.", table_cell)],
        [Paragraph("/about, /contact, /faq", table_cell_bold), Paragraph("src/app/(static)/page.tsx", table_cell), Paragraph("<font color='#059669'>Implemented</font>", table_cell), Paragraph("Brand story, contact form (unwired), accordion FAQ.", table_cell)],
        [Paragraph("/policies/* (4 routes)", table_cell_bold), Paragraph("src/app/policies/*/page.tsx", table_cell), Paragraph("<font color='#059669'>Implemented</font>", table_cell), Paragraph("Legal copy: Privacy, Terms, Shipping, Return &amp; Refund policies.", table_cell)],
        [Paragraph("/api/* (All routes)", table_cell_bold), Paragraph("None", table_cell), Paragraph("<font color='#DC2626'>Not Implemented</font>", table_cell), Paragraph("Zero API routes. No server handler exists in the project.", table_cell)],
        [Paragraph("/admin/*", table_cell_bold), Paragraph("None", table_cell), Paragraph("<font color='#DC2626'>Not Implemented</font>", table_cell), Paragraph("Zero administrative routes or backoffice interfaces.", table_cell)]
    ]
    t_routes = Table(routes_data, colWidths=[105, 125, 95, 207])
    t_routes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_routes)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Architectural Pattern Observed:</b> The application runs essentially as a Single Page Application (SPA) on top of Next.js. "
                           "While the directory layout follows modern App Router standards, nearly all leaf pages declare <code>'use client'</code> at the top "
                           "and bind directly to <code>StoreContext.tsx</code>. This means adding Next.js Route Handlers (<code>src/app/api</code>) and Server "
                           "Actions will not conflict with existing page components.", body_style))

    # END PAGE 2 -> PAGE BREAK
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: SECTIONS C, D, E, F
    # =========================================================================
    story.append(Paragraph("C. Database and Backend Status", h1_style))
    story.append(Paragraph("<b>Classification: NOT IMPLEMENTED (Mock Data Only)</b>", ParagraphStyle('SubWarn', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#DC2626"))))
    story.append(Paragraph("- <b>Source of Truth:</b> All product data originates from <code>src/data/mockData.ts</code>, containing an in-memory array of <b>28 hardcoded streetwear products</b>, 6 category objects, and 4 mock promo codes (WELCOME10, SOUL15, DROP20, FREESHIP).", bullet_style))
    story.append(Paragraph("- <b>Zero Database Clients:</b> There is no PostgreSQL, MySQL, MongoDB, Redis, Prisma, or Drizzle schema anywhere in the repository. No migration files exist.", bullet_style))
    story.append(Paragraph("- <b>Absence of API Handlers:</b> There is no <code>src/app/api</code> directory. No Next.js route handlers, Server Actions, or backend microservices are implemented. All data manipulation occurs client-side in React state.", bullet_style))
    story.append(Paragraph("- <b>Persistence Vulnerability:</b> Cart items, wishlist items, recently viewed IDs, and mock orders rely purely on browser <code>localStorage</code> under keys: <code>teesoulz_cart</code>, <code>teesoulz_wishlist</code>, <code>teesoulz_recent</code>, and <code>teesoulz_user</code>. If a user clears cookies or changes devices, all data disappears.", bullet_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("D. Authentication and Access-Control Status", h1_style))
    story.append(Paragraph("<b>Classification: UI ONLY / MOCKED (Critical Security Implication)</b>", ParagraphStyle('SubWarn2', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#D97706"))))
    story.append(Paragraph("- <b>Login &amp; Registration Logic:</b> Located inside <code>src/app/account/login/page.tsx</code> and <code>src/context/StoreContext.tsx</code>. The login form executes an artificial <code>setTimeout(..., 800)</code> and creates a fake session containing the entered email, a hardcoded name ('Alex Rivers'), and dummy loyalty points (150 pts).", bullet_style))
    story.append(Paragraph("- <b>No Passwords or Hashes:</b> Passwords entered in the UI are never hashed, verified against a store, or transmitted to any server. Any password string is accepted.", bullet_style))
    story.append(Paragraph("- <b>Zero Session Management:</b> There are no HTTP-only cookies, no JWT verification tokens, and no Next.js middleware guards. Any user can directly navigate to <code>/account</code> by altering local state.", bullet_style))
    story.append(Paragraph("- <b>Role-Based Access Control (RBAC):</b> Completely missing. The user type definition (<code>src/types/index.ts</code>) has no <code>role</code> property (e.g., 'ADMIN', 'STAFF', 'CUSTOMER').", bullet_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("E. Product, Inventory, Cart, Wishlist &amp; Order Status", h1_style))
    
    ecom_data = [
        [Paragraph("Feature", table_cell_header), Paragraph("Status", table_cell_header), Paragraph("Implementation Details &amp; Code Evidence", table_cell_header)],
        [
            Paragraph("Product Catalog", table_cell_bold),
            Paragraph("<font color='#D97706'>Mock / UI Only</font>", table_cell),
            Paragraph("28 products in <code>src/data/mockData.ts</code>. Includes images, variants (S-XXL), badges (HOT, DROP, LIMITED), tags, and descriptions. Cannot be updated without code deployment.", table_cell)
        ],
        [
            Paragraph("Inventory Control", table_cell_bold),
            Paragraph("<font color='#DC2626'>Not Implemented</font>", table_cell),
            Paragraph("Static boolean flag <code>inStock: true/false</code> on products. No SKU tracking, stock counts, size-specific inventory, or stock locking during checkout.", table_cell)
        ],
        [
            Paragraph("Shopping Cart", table_cell_bold),
            Paragraph("<font color='#059669'>Working Client State</font>", table_cell),
            Paragraph("Fully working in React state and <code>localStorage</code>. Supports quantity changes, size/color selection, subtotal calculation, tax calculation (18% GST), and coupon discounts.", table_cell)
        ],
        [
            Paragraph("Wishlist", table_cell_bold),
            Paragraph("<font color='#059669'>Working Client State</font>", table_cell),
            Paragraph("Fully functional client-side toggle. Persisted across page refreshes via localStorage. Move to cart helper verified in <code>StoreContext.tsx</code>.", table_cell)
        ],
        [
            Paragraph("Order Creation", table_cell_bold),
            Paragraph("<font color='#D97706'>Mock / UI Only</font>", table_cell),
            Paragraph("In <code>src/app/checkout/page.tsx</code>, orders are fabricated using <code>Math.random().toString(36)</code> and pushed into the user's localStorage array. No database record is created.", table_cell)
        ]
    ]
    t_ecom = Table(ecom_data, colWidths=[95, 95, 342])
    t_ecom.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ecom)
    story.append(Spacer(1, 8))

    story.append(Paragraph("F. Admin Panel Status", h1_style))
    story.append(Paragraph("<b>Classification: NOT IMPLEMENTED (0% Complete)</b>", ParagraphStyle('SubWarn3', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#DC2626"))))
    story.append(Paragraph("- There are no admin pages (e.g., <code>/admin</code>, <code>/dashboard</code>, <code>/admin/products</code>, <code>/admin/orders</code>).", bullet_style))
    story.append(Paragraph("- No UI exists for store managers to add products, adjust pricing, upload photos, manage stock levels, view customer orders, update delivery tracking statuses, or issue refunds.", bullet_style))
    story.append(Paragraph("- Any product change currently requires editing TypeScript code and re-deploying to Vercel.", bullet_style))

    # END PAGE 3 -> PAGE BREAK
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SECTIONS G, H, I
    # =========================================================================
    story.append(Paragraph("G. Payment, Shipping &amp; Notification Status", h1_style))
    story.append(Paragraph("- <b>Payment Gateways (Razorpay / Cashfree / Stripe): NOT IMPLEMENTED.</b> In <code>src/app/checkout/page.tsx</code>, selecting 'UPI', 'Card', or 'COD' merely changes a radio button. Clicking 'Place Order' triggers a JavaScript <code>setTimeout</code> of 2000ms that clears the cart and redirects to <code>/order-confirmation</code> without collecting payment or creating a payment intent.", bullet_style))
    story.append(Paragraph("- <b>Shipping Integration (Shiprocket / Delhivery): NOT IMPLEMENTED.</b> Pincode check on product and checkout pages evaluates a static regex (<code>/^[1-9][0-9]{5}$/</code>) and displays hardcoded delivery estimates (3-5 days). No logistics API is called.", bullet_style))
    story.append(Paragraph("- <b>Notifications (Email / SMS / WhatsApp): NOT IMPLEMENTED.</b> No Resend, SendGrid, Twilio, or WhatsApp Business API integration exists. When an order is placed, zero emails or text messages are dispatched.", bullet_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("H. Missing Environment Configuration", h1_style))
    story.append(Paragraph("Inspection confirms that no <code>.env</code>, <code>.env.local</code>, or <code>.env.production</code> files are active in the repository. The following <b>12 environment variables</b> are required for backend launch:", body_style))

    env_data = [
        [Paragraph("Category", table_cell_header), Paragraph("Variable Identifier", table_cell_header), Paragraph("Required Service / Purpose", table_cell_header)],
        [Paragraph("Database", table_cell_bold), Paragraph("<code>DATABASE_URL</code>", table_cell), Paragraph("PostgreSQL connection string (Supabase / Neon / AWS RDS)", table_cell)],
        [Paragraph("Database Pool", table_cell_bold), Paragraph("<code>DIRECT_URL</code>", table_cell), Paragraph("Direct connection string for Prisma schema migrations", table_cell)],
        [Paragraph("Authentication", table_cell_bold), Paragraph("<code>NEXTAUTH_SECRET</code>", table_cell), Paragraph("Cryptographic salt for JWT session tokens and encryption", table_cell)],
        [Paragraph("Auth URL", table_cell_bold), Paragraph("<code>NEXTAUTH_URL</code>", table_cell), Paragraph("Canonical app URL (https://teesoulz.vercel.app)", table_cell)],
        [Paragraph("OAuth (Google)", table_cell_bold), Paragraph("<code>GOOGLE_CLIENT_ID</code> / <code>_SECRET</code>", table_cell), Paragraph("One-tap social customer login authentication", table_cell)],
        [Paragraph("Payments", table_cell_bold), Paragraph("<code>RAZORPAY_KEY_ID</code>", table_cell), Paragraph("Public client key for Razorpay checkout modal checkout", table_cell)],
        [Paragraph("Payments Secret", table_cell_bold), Paragraph("<code>RAZORPAY_KEY_SECRET</code>", table_cell), Paragraph("Private server key to capture payments and sign orders", table_cell)],
        [Paragraph("Payment Webhook", table_cell_bold), Paragraph("<code>RAZORPAY_WEBHOOK_SECRET</code>", table_cell), Paragraph("HMAC signature verification for asynchronous webhook events", table_cell)],
        [Paragraph("Media Storage", table_cell_bold), Paragraph("<code>CLOUDINARY_URL</code> / <code>S3_*</code>", table_cell), Paragraph("Product image &amp; banner uploads for Admin Panel", table_cell)],
        [Paragraph("Transactional Email", table_cell_bold), Paragraph("<code>RESEND_API_KEY</code>", table_cell), Paragraph("Dispatching order confirmations and tracking updates", table_cell)],
        [Paragraph("Logistics API", table_cell_bold), Paragraph("<code>SHIPROCKET_API_TOKEN</code>", table_cell), Paragraph("Automated AWB generation and live shipping rate tracking", table_cell)]
    ]
    t_env = Table(env_data, colWidths=[80, 160, 292])
    t_env.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_env)
    story.append(Spacer(1, 8))

    story.append(Paragraph("I. Security Risks &amp; Implementation Blockers", h1_style))
    story.append(Paragraph("Deploying the current frontend to production as a live commercial store presents severe vulnerabilities:", body_style))
    story.append(Paragraph("1. <b>Client-Authoritative Pricing:</b> Product prices and cart totals are calculated solely in the browser. A malicious user could edit localStorage or intercepted payloads to purchase products for INR 1.", bullet_style))
    story.append(Paragraph("2. <b>Zero Authentication Guards:</b> Protected areas and sensitive order details are not protected by backend JWT/session verification.", bullet_style))
    story.append(Paragraph("3. <b>Race Conditions &amp; Overselling:</b> Without ACID database transactions or pessimistic locking, concurrent users could checkout the same limited streetwear drop item.", bullet_style))
    story.append(Paragraph("4. <b>Fake Checkout Exploit:</b> An attacker could trigger the checkout completion function to generate fraudulent order IDs and demand order fulfillment.", bullet_style))

    # END PAGE 4 -> PAGE BREAK
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: SECTIONS J, K, L
    # =========================================================================
    # SECTION J & K & L Compact Styles
    h2_compact = ParagraphStyle(
        'Heading2_Compact',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11.5,
        textColor=colors.HexColor("#1E293B"),
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )
    bullet_compact = ParagraphStyle(
        'Bullet_Compact',
        parent=body_style,
        fontSize=8,
        leading=10.5,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2
    )

    story.append(Paragraph("J. Recommended Architecture (Zero Rebuild)", h1_style))
    story.append(Paragraph("<b>Do NOT rewrite the existing application.</b> The current Next.js 16 App Router frontend is modern, well-typed, and modular. The recommended architecture augments the existing repo with a seamless full-stack layer:", body_style))
    
    arch_data = [
        [Paragraph("Layer", table_cell_header), Paragraph("Recommended Solution", table_cell_header), Paragraph("Justification &amp; Integration Path", table_cell_header)],
        [Paragraph("Database", table_cell_bold), Paragraph("PostgreSQL via Neon / Supabase", table_cell), Paragraph("Serverless connection pooling, instantaneous branching, robust relational integrity.", table_cell)],
        [Paragraph("ORM", table_cell_bold), Paragraph("Prisma ORM", table_cell), Paragraph("Type-safe database client matching existing TypeScript definitions (Product, Order, User).", table_cell)],
        [Paragraph("Authentication", table_cell_bold), Paragraph("Auth.js v5 (NextAuth)", table_cell), Paragraph("Native Next.js App Router support, secure HTTP-only cookies, OAuth (Google), and credentials hashing (bcrypt).", table_cell)],
        [Paragraph("Payment", table_cell_bold), Paragraph("Razorpay API + Webhooks", table_cell), Paragraph("Standard for Indian e-commerce (UPI, Netbanking, Cards, EMI). Secure server-side signature verification.", table_cell)],
        [Paragraph("Admin Panel", table_cell_bold), Paragraph("Unified src/app/admin/*", table_cell), Paragraph("Reuses the same Tailwind v4 styling and Lucide icons; protected by Next.js middleware (role === 'ADMIN').", table_cell)],
        [Paragraph("Media Storage", table_cell_bold), Paragraph("Cloudinary or Uploadthing", table_cell), Paragraph("Direct signed uploads for high-resolution product imagery and lookbook banners.", table_cell)]
    ]
    t_arch = Table(arch_data, colWidths=[75, 145, 312])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 5))

    story.append(Paragraph("K. Phased Implementation Plan", h1_style))

    story.append(Paragraph("<b>Phase 1: Database Foundation &amp; Product Data Migration (Days 1-3)</b>", h2_compact))
    story.append(Paragraph("- Initialize Prisma: <code>npm install prisma @prisma/client</code>. Configure PostgreSQL connection.", bullet_compact))
    story.append(Paragraph("- Define database schemas for User, Product, ProductVariant, Category, Order, OrderItem, Address, and Coupon.", bullet_compact))
    story.append(Paragraph("- Write a seed script (<code>prisma/seed.ts</code>) converting the 28 products from <code>mockData.ts</code> into permanent database rows.", bullet_compact))
    story.append(Paragraph("- Convert static product routes (<code>/shop</code>, <code>/product/[slug]</code>) to fetch dynamically via Prisma.", bullet_compact))

    story.append(Paragraph("<b>Phase 2: Authentication, User Accounts &amp; Server-Side Cart (Days 4-6)</b>", h2_compact))
    story.append(Paragraph("- Implement Auth.js v5 with bcrypt password hashing and Google OAuth provider.", bullet_compact))
    story.append(Paragraph("- Replace client mock login with genuine session creation and secure HTTP-only cookies.", bullet_compact))
    story.append(Paragraph("- Wire user account dashboard (<code>/account</code>) to real customer profile and order history records.", bullet_compact))
    story.append(Paragraph("- Synchronize cart state to database for logged-in users across mobile and desktop.", bullet_compact))

    story.append(Paragraph("<b>Phase 3: Real Payment Gateway &amp; Order Pipeline (Days 7-9)</b>", h2_compact))
    story.append(Paragraph("- Integrate official Razorpay Node SDK. Implement <code>/api/checkout/create-order</code> to generate verified payment IDs.", bullet_compact))
    story.append(Paragraph("- Enforce server-side pricing calculation so clients cannot manipulate item prices.", bullet_compact))
    story.append(Paragraph("- Create <code>/api/webhooks/razorpay</code> route to verify HMAC signatures and transition orders to 'PAID'.", bullet_compact))
    story.append(Paragraph("- Trigger automated customer confirmation emails via Resend.", bullet_compact))

    story.append(Paragraph("<b>Phase 4: Streetwear Admin Panel &amp; Inventory Manager (Days 10-14)</b>", h2_compact))
    story.append(Paragraph("- Construct protected <code>/admin</code> dashboard with role-based middleware guards.", bullet_compact))
    story.append(Paragraph("- Build Product Management: Add, edit, delete streetwear items; size/color matrix; image upload dropzone.", bullet_compact))
    story.append(Paragraph("- Build Order Management: Live order status tracking (Pending -&gt; Processing -&gt; Shipped -&gt; Delivered).", bullet_compact))
    story.append(Paragraph("- Build Customer &amp; Discount Management: Create flash drop coupons and inspect customer analytics.", bullet_compact))
    story.append(Spacer(1, 6))

    story.append(Paragraph("L. Final Recommendation &amp; Exact First Implementation Task", h1_style))
    
    final_card = [
        [
            Paragraph("<b>EXACT FIRST IMPLEMENTATION TASK TO PROCEED:</b><br/>"
                      "<b>Task 1:</b> Initialize Prisma ORM and create the PostgreSQL Database Foundation.<br/>"
                      "1. Run <code>npm install -D prisma</code> and <code>npm install @prisma/client</code>.<br/>"
                      "2. Execute <code>npx prisma init</code> to generate the schema structure.<br/>"
                      "3. Configure the <code>schema.prisma</code> models matching the audited TypeScript types.<br/>"
                      "4. Execute the initial migration and seed all 28 streetwear items from <code>mockData.ts</code> directly into PostgreSQL.<br/><br/>"
                      "<i>This establishes the persistent backbone without breaking any existing frontend pages.</i>", callout_style)
        ]
    ]
    t_final = Table(final_card, colWidths=[532])
    t_final.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3B82F6")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t_final)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF built successfully: {filename}")

if __name__ == "__main__":
    output_pdf = r"c:\Users\admin\Downloads\Teesoulz\TEESOULZ_Technical_Audit_Report.pdf"
    build_pdf(output_pdf)
