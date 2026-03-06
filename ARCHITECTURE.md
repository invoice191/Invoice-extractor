# Vyaparmitra — System Architecture & Technology Stack

> **A Cloud-Native Business Intelligence Platform for Indian Retail Vendors**

---

## 1. Abstract

Vyaparmitra is a comprehensive, cloud-native Business Intelligence (BI) platform designed specifically for Indian retail vendors and small-to-medium enterprises (SMEs). The platform integrates point-of-sale (POS) operations, GST-compliant invoicing, inventory management, customer relationship management (CRM), financial analytics, and AI-powered business insights into a single unified web application. This document details the system architecture, technology stack, design decisions, data flow, and deployment strategy adopted in the development of Vyaparmitra.

---

## 2. System Architecture Overview

Vyaparmitra follows a **modern client-heavy Single Page Application (SPA) architecture** with a **Backend-as-a-Service (BaaS) model**, eliminating the need for a custom backend server. The architecture is organized into four principal layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│         React 19 + TypeScript + Vite + Recharts             │
├─────────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                            │
│     Database Service │ Gemini AI Service │ Storage Service   │
├──────────────────┬──────────────────┬───────────────────────┤
│  AUTHENTICATION  │    DATABASE      │   FILE STORAGE        │
│  Supabase Auth   │  Supabase        │  Supabase Storage     │
│  (Google OAuth,  │  (PostgreSQL     │  (Invoice PDFs,       │
│   Email/Pass)    │   + Realtime)    │   Profile Images)     │
├──────────────────┴──────────────────┴───────────────────────┤
│                 AI / INTELLIGENCE LAYER                     │
│          Google Gemini API (gemini-2.0-flash, gemini-2.0-pro)   │
│          Grounded Search for Market Insights                │
├─────────────────────────────────────────────────────────────┤
│                   DEPLOYMENT LAYER                          │
│              Netlify / Vercel (CDN-backed)                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Architectural Pattern

The application adopts a **hybrid BaaS (Backend-as-a-Service)** architecture, leveraging two complementary cloud platforms:

| Concern            | Provider             | Justification                                      |
|---------------------|----------------------|-----------------------------------------------------|
| Authentication      | Supabase Auth        | Robust OAuth 2.0, email/password, and Google Sign-In |
| Database (RDBMS)    | Supabase (PostgreSQL)| Relational data, real-time subscriptions, RLS       |
| File Storage        | Supabase Storage     | Scalable binary storage with CDN delivery           |
| AI Intelligence     | Google Gemini API    | Generative AI with grounded web search              |
| Hosting / CDN       | Netlify / Vercel     | Global CDN with SPA routing support                 |

This unified strategy leverages **Supabase** as the primary backend-as-a-service, providing a cohesive ecosystem for authentication, data, and storage, combined with Google's state-of-the-art Gemini AI model.

---

## 3. Technology Stack

### 3.1 Frontend Technologies

| Technology               | Version   | Purpose                                           |
|---------------------------|-----------|---------------------------------------------------|
| **React**                | 19.0.0    | Core UI library — component-based SPA framework   |
| **TypeScript**           | 5.8.2     | Static type checking for reliability and DX       |
| **Vite**                 | 6.2.0     | Build tool — fast HMR, ESM-native bundling        |
| **Recharts**             | 3.7.0     | Declarative charting library for data visualization|
| **Lucide React**         | 0.460.0   | Icon library — consistent, lightweight SVG icons  |
| **Motion (Framer Motion)**| 12.35.0  | Animation library for micro-interactions and transitions |
| **Radix UI**             | Various   | Accessible, unstyled UI primitives (Label, Switch, Tooltip, Slot) |
| **Class Variance Authority (CVA)** | 0.7.0 | Variant-based component styling utility    |
| **clsx / tailwind-merge**| 2.1.1 / 2.3.0 | Conditional class composition utilities      |

### 3.2 Backend-as-a-Service (BaaS)

| Service                   | Version / Platform | Purpose                                          |
|---------------------------|---------------------|---------------------------------------------------|
| **Supabase Authentication**| supabase-js 2.98.0  | User authentication — Email/Password, Google OAuth |
| **Supabase Storage**       | supabase-js 2.98.0  | Binary file storage (invoice PDFs, profile images) |
| **Supabase DB**           | supabase-js 2.98.0  | PostgreSQL database with real-time subscriptions  |
| **Vite**                  | 6.2.0               | Static site development and production bundling   |

### 3.3 AI and Intelligence

| Technology                  | Model                  | Purpose                                         |
|------------------------------|------------------------|--------------------------------------------------|
| **Google Gemini API**        | gemini-3-pro-preview   | Strategic business analysis with grounded search |
| **Google Gemini API**        | gemini-3-flash-preview | Real-time customer support chatbot              |
| **Google Search (Grounded)** | via Gemini Tools API   | Live Indian market trend analysis               |

### 3.4 Report & Document Generation

| Library           | Version | Purpose                                        |
|--------------------|---------|------------------------------------------------|
| **jsPDF**         | 4.2.0   | Client-side PDF generation for invoices/reports|
| **html2canvas**   | 1.4.1   | DOM-to-image capture for PDF rendering         |
| **xlsx (SheetJS)**| 0.18.5  | Excel spreadsheet generation and export        |

### 3.5 Development Toolchain

| Tool                       | Purpose                                  |
|-----------------------------|------------------------------------------|
| **Vite**                   | Dev server with HMR, production bundler  |
| **@vitejs/plugin-react**   | React Fast Refresh and JSX transform     |
| **TypeScript Compiler**    | Type checking via `tsc --noEmit`         |
| **ESM Modules**            | Native ES module resolution              |

---

## 4. Application Module Architecture

The application is structured into **19 distinct page-level modules**, each addressing a specific business function:

### 4.1 Module Map

```
┌──────────────────────────────────────────────────────┐
│                  APPLICATION MODULES                  │
├──────────────────┬───────────────────────────────────┤
│  PUBLIC MODULES  │  AUTHENTICATED MODULES            │
│                  │                                   │
│  • LandingPage   │  CORE BUSINESS                    │
│  • AuthPage      │  • DashboardExecutive (BI Hub)    │
│  • PartnerDir    │  • DashboardPOS (Point-of-Sale)   │
│                  │  • GSTInvoice (Billing)            │
│                  │  • Invoices (History)              │
│                  │                                   │
│                  │  ANALYTICS & INTELLIGENCE          │
│                  │  • DashboardSales                  │
│                  │  • DashboardFinancial              │
│                  │  • DashboardCustomers              │
│                  │  • DashboardProducts               │
│                  │  • DashboardInventory              │
│                  │  • ReportsLibrary                  │
│                  │                                   │
│                  │  OPERATIONS                        │
│                  │  • CustomerLedger                  │
│                  │  • ExpenseTracker                  │
│                  │  • DataManagement                  │
│                  │  • B2BMarketplace                  │
│                  │  • OnlineStore                     │
│                  │                                   │
│                  │  SYSTEM                            │
│                  │  • Settings                        │
└──────────────────┴───────────────────────────────────┘
```

### 4.2 Module Descriptions

| Module                  | Lines of Code | Primary Function                                              |
|--------------------------|---------------|---------------------------------------------------------------|
| **Settings**            | ~2,200        | Business profile, invoice settings, theme, API key management |
| **DashboardExecutive**  | ~1,650        | AI-powered executive summary, KPIs, quick actions, activity feed |
| **DataManagement**      | ~1,650        | CRUD operations for all business entities, data sync          |
| **GSTInvoice**          | ~1,450        | GST-compliant invoice, quotation, and proforma creation       |
| **LandingPage**         | ~1,300        | Marketing page, feature showcase, public-facing entry point   |
| **DashboardPOS**        | ~1,100        | Real-time POS terminal, cart management, billing              |
| **ReportViewer**        | ~1,100        | Interactive report generation with filters and export         |
| **CustomerLedger**      | ~1,050        | Credit/debit tracking, payment history, balance management    |
| **B2BMarketplace**      | ~950          | Wholesale sourcing, supplier catalog, bulk ordering           |
| **ExpenseTracker**      | ~680          | Expense categorization, payment tracking, analytics           |
| **DashboardProducts**   | ~580          | SKU management, product health, stock alerts                  |
| **AuthPage**            | ~570          | Sign in/up forms, Google OAuth, error handling                |
| **ReportsLibrary**      | ~560          | Report catalog, filter modal, report selection                |
| **DashboardInventory**  | ~470          | Warehouse tracking, supply chain, stock levels                |
| **Invoices**            | ~440          | Invoice history, search, status filtering                     |
| **OnlineStore**         | ~420          | Shareable digital catalog generation                          |
| **PartnerDirectory**    | ~320          | Vendor/partner discovery and listing                          |
| **DashboardCustomers**  | ~310          | Customer segments, credit analysis                            |
| **DashboardSales**      | ~200          | Revenue trends, conversion metrics                            |
| **DashboardFinancial**  | ~280          | P&L statements, tax provisions, financial health              |

---

## 5. Database Schema (Supabase PostgreSQL)

The relational data model is organized around the following core entities:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  customers   │     │   products   │     │    warehouses     │
│──────────────│     │──────────────│     │──────────────────│
│ id (PK)      │     │ id (PK)      │     │ id (PK)          │
│ name         │     │ name         │     │ name             │
│ phone        │     │ sku          │     │ location         │
│ gstin        │     │ category     │     │ stock_value      │
│ address      │     │ price        │     │ capacity         │
│ credit_limit │     │ stock        │     └──────────────────┘
│ current_bal  │     │ reorder_pt   │
│ total_purch  │     └──────────────┘
└──────┬───────┘
       │ 1:M
┌──────┴───────┐     ┌──────────────┐     ┌──────────────────┐
│ledger_entries│     │   invoices   │────▶│  invoice_items   │
│──────────────│     │──────────────│ 1:M │──────────────────│
│ id (PK)      │     │ id (PK)      │     │ id (PK)          │
│ customer_id  │     │ invoice_no   │     │ invoice_id (FK)  │
│ date         │     │ customer_name│     │ item details...  │
│ type         │     │ date / gstin │     └──────────────────┘
│ amount       │     │ amounts...   │
│ balance      │     │ status       │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│   expenses   │     │  b2b_orders  │
│──────────────│     │──────────────│
│ id (PK)      │     │ id (PK)      │
│ date         │     │ supplier     │
│ category     │     │ date         │
│ amount       │     │ amount       │
│ method       │     │ status       │
└──────────────┘     └──────────────┘
```

### 5.1 Real-Time Subscriptions

Supabase's real-time engine (powered by PostgreSQL's logical replication) is utilized for **instant data synchronization** across the following tables:

- `customers` — Live customer updates across all dashboards
- `products` — Real-time stock level changes
- `invoices` — Instant invoice status updates
- `ledger_entries` — Live credit/debit tracking
- `expenses` — Real-time expense feed
- `warehouses` — Live warehouse capacity monitoring

---

## 6. Authentication Architecture

Authentication is implemented via **Firebase Authentication** with a React Context-based state management pattern:

```
┌─────────────────────────────────────────┐
│            AuthProvider                  │
│  (React Context + Firebase Auth SDK)     │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  onAuthStateChanged Listener    │    │
│  │  (Real-time auth state sync)    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Supported Methods:                     │
│  • Email/Password Sign-In & Sign-Up     │
│  • Google OAuth 2.0 (Popup Flow)        │
│  • Profile Update (displayName)         │
│  • Comprehensive Error Handling         │
│                                         │
│  Route Protection:                      │
│  • Public pages: Landing, Auth, Partner │
│  • All other pages require auth         │
└─────────────────────────────────────────┘
```

---

## 7. AI Integration Architecture

### 7.1 Strategic Business Insights (Gemini 3 Pro)

The `geminiService.ts` module interfaces with Google's Gemini 3 Pro model to deliver:

- **Executive-level business health summaries**
- **Identification of internal strengths** from live dashboard data
- **Actionable recommendations** contextualized for Indian retail
- **Grounded market trend analysis** using Google Search integration

The AI is configured with the `googleSearch` tool, enabling grounded responses backed by real-time web data. Sources are extracted from `groundingMetadata.groundingChunks` and presented alongside insights.

### 7.2 AI-Powered Customer Support (Gemini 3 Flash)

A lightweight chatbot powered by `gemini-3-flash-preview` provides:

- Platform feature guidance
- Business growth advisory
- Indian-market-contextualized responses

---

## 8. Client-Side Report Generation

Reports and invoices are generated entirely on the client side using a three-step pipeline:

```
DOM Rendering ──▶ html2canvas (Screenshot) ──▶ jsPDF (PDF Assembly)
                                                    │
                                               xlsx (SheetJS)
                                               (Excel Export)
```

This approach eliminates server-side rendering dependencies and enables **offline-capable document generation**.

---

## 9. Deployment Architecture

```
┌──────────────┐     ┌───────────────────────┐     ┌──────────────┐
│  Vite Build  │────▶│   Firebase Hosting    │────▶│  Global CDN  │
│  (dist/)     │     │   (SPA Rewrites)      │     │  (Edge PoPs) │
└──────────────┘     │   Cache: 1yr static   │     └──────────────┘
                     │   assets immutable    │
                     └───────────────────────┘
```

- **Build Tool**: Vite produces optimized ESM bundles in `dist/`
- **Hosting**: Firebase Hosting serves the SPA with wildcard rewrite to `index.html`
- **Caching**: Static assets (`/assets/**`) are cached with `max-age=31536000, immutable`
- **CDN**: Firebase Hosting's built-in CDN distributes content globally

---

## 10. Component Architecture

### 10.1 Shared / Reusable Components

| Component         | Type       | Description                                      |
|--------------------|------------|--------------------------------------------------|
| `Sidebar`         | Navigation | Persistent side navigation with page routing     |
| `CommandPalette`  | Utility    | Keyboard-driven quick navigation (Cmd+K)         |
| `MetricCard`      | Display    | KPI cards with trend indicators                  |
| `DateRangePicker` | Input      | Date range selection for report filtering        |
| `ReportViewer`    | Composite  | Interactive report rendering with export          |
| `OnboardingWizard`| Flow       | First-time user setup guide                      |

### 10.2 UI Primitive Layer (Radix UI)

| Component   | Radix Package           | Purpose                    |
|-------------|--------------------------|----------------------------|
| `Button`    | Custom + CVA             | Variant-aware button       |
| `Input`     | Custom                   | Styled text input          |
| `Label`     | @radix-ui/react-label    | Accessible form labels     |
| `Switch`    | @radix-ui/react-switch   | Toggle switch control      |
| `Tooltip`   | @radix-ui/react-tooltip  | Contextual hover tooltips  |
| `Textarea`  | Custom                   | Multi-line text input      |

---

## 11. State Management

The application employs a **lightweight state management strategy**:

| Layer           | Approach                         | Scope                        |
|-----------------|----------------------------------|-------------------------------|
| Auth State      | React Context (`AuthContext`)     | Global — user session        |
| Page Routing    | `useState` in `App.tsx`          | Global — active page         |
| Component State | `useState` / `useEffect` hooks   | Local — per-component data   |
| Theme           | `localStorage` + `useState`      | Persistent dark/light mode   |
| Server State    | Direct Supabase queries + Realtime subscriptions | Per-component with sync |

No external state management library (Redux, Zustand, etc.) is required due to the direct BaaS integration pattern where each component fetches its own data via the service layer.

---

## 12. Security Considerations

| Aspect                  | Implementation                                           |
|--------------------------|----------------------------------------------------------|
| Authentication           | Firebase Auth with secure token management              |
| API Key Protection       | Environment variables via `.env.local` (not committed)  |
| Route Protection         | Client-side auth guards for all dashboard pages         |
| Database Security        | Supabase Row Level Security (RLS) policies              |
| Google OAuth 2.0         | Popup-based OAuth flow with error handling              |
| Storage Rules            | Firebase Storage security rules                         |
| HTTPS                    | Enforced via Firebase Hosting                           |

---

## 13. Data Flow Diagram

```
┌─────────┐    Auth     ┌──────────────┐
│  User   │◀──────────▶│ Firebase Auth │
│ Browser │             └──────────────┘
│         │    CRUD     ┌──────────────┐    Realtime
│         │◀──────────▶│  Supabase DB  │──────────▶ Live Updates
│         │             └──────────────┘
│         │   Upload    ┌──────────────┐
│         │────────────▶│Firebase Store │──▶ CDN URLs
│         │             └──────────────┘
│         │   Prompt    ┌──────────────┐
│         │────────────▶│  Gemini API  │──▶ Insights + Sources
│         │             └──────────────┘
│         │   Export    ┌──────────────┐
│         │────────────▶│ jsPDF / XLSX │──▶ PDF / Excel Files
└─────────┘             └──────────────┘
```

---

## 14. Key Design Decisions & Justifications

| Decision                          | Justification                                                  |
|------------------------------------|----------------------------------------------------------------|
| **React 19** over Next.js         | No SSR needed; pure SPA is sufficient for a BI dashboard       |
| **Dual BaaS** (Firebase + Supabase) | Firebase excels at auth/storage; Supabase excels at relational data |
| **Vite** over Webpack             | Significantly faster HMR and build times; native ESM support   |
| **Client-side PDF generation**    | Eliminates server dependency; works offline; reduces cost      |
| **Gemini with Grounding**         | Provides verified, source-cited market intelligence            |
| **TypeScript**                    | Catches type errors at compile time; improves maintainability  |
| **Radix UI primitives**           | Accessible by default; unstyled for full design control        |
| **Supabase Realtime**             | PostgreSQL-native change data capture; no WebSocket server needed |
| **No Redux/Zustand**              | BaaS pattern with direct data fetching keeps state simple      |

---

## 15. Performance Optimizations

| Technique                     | Implementation                                       |
|-------------------------------|------------------------------------------------------|
| Code Splitting                | Vite's automatic chunk splitting for lazy imports    |
| Asset Caching                 | Immutable cache headers (1 year) for static assets   |
| Memoization                   | `useMemo` for expensive computations (e.g., `pageMeta`) |
| Conditional Rendering         | Module-level switching prevents unnecessary DOM mounting |
| CDN Distribution              | Firebase Hosting's global edge network               |
| Optimized Animations          | Framer Motion with GPU-accelerated transforms        |

---

## 16. Scalability Considerations

| Concern              | Current Approach          | Scale Path                              |
|-----------------------|---------------------------|------------------------------------------|
| Database             | Supabase Free/Pro tier    | PostgreSQL scales vertically; read replicas |
| Authentication       | Firebase Auth             | Supports millions of users natively      |
| File Storage         | Firebase Storage          | Automatic scaling with GCS backend       |
| AI Inference         | Gemini API               | Rate limits manageable via quotas        |
| Frontend             | SPA + CDN                | Infinite horizontal scale via CDN        |

---

## 17. Conclusion

Vyaparmitra demonstrates a modern, cost-effective approach to building comprehensive business applications by leveraging multiple Backend-as-a-Service platforms in a complementary fashion. The architecture eliminates traditional server management overhead while providing enterprise-grade capabilities including real-time data synchronization, AI-powered business intelligence, GST-compliant document generation, and global content delivery. The technology choices are deliberately optimized for the Indian SME market, balancing developer productivity, operational cost, and end-user experience.

---

## References

1. React Documentation — https://react.dev
2. Vite Build Tool — https://vitejs.dev
3. Firebase Documentation — https://firebase.google.com/docs
4. Supabase Documentation — https://supabase.com/docs
5. Google Gemini API — https://ai.google.dev
6. Recharts Library — https://recharts.org
7. jsPDF — https://github.com/parallax/jsPDF
8. Radix UI — https://www.radix-ui.com
9. TypeScript — https://www.typescriptlang.org

---

*Document prepared for academic research purposes.*
*Project: Vyaparmitra — Business Intelligence Platform*
*Date: March 2026*
