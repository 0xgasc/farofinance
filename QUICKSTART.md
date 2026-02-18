# Faro Finance - Quick Start Guide

## 🚀 What You Built

A production-ready FP&A (Financial Planning & Analysis) platform with:

- ✅ **Full Authentication** - NextAuth with email/password, Google, GitHub
- ✅ **Burn & Runway Calculator** - Track cash burn and runway projections
- ✅ **Cash Flow Forecasting** - 13-week rolling forecasts
- ✅ **SaaS Metrics** - MRR/ARR, churn, LTV:CAC, cohort analysis
- ✅ **Hiring Plan Modeler** - Headcount planning with cost impact
- ✅ **Fundraising Scenarios** - Model multiple raise scenarios
- ✅ **Financial Statements** - P&L, Balance Sheet, Cash Flow
- ✅ **Investor Dashboard** - Shareable read-only views
- ✅ **Multi-tenant Architecture** - Organization-based data isolation

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works: https://www.mongodb.com/cloud/atlas)
- (Optional) Google/GitHub OAuth apps for social login

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd "/Users/gs/Desktop/folder cleanup/finsuite"
npm install
```

### 2. Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update `.env.local`:

```bash
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/farofinance?retryWrites=true&w=majority
```

### 3. Generate Auth Secret

```bash
# Generate a random secret for NextAuth
openssl rand -base64 32
```

Update `.env.local`:
```bash
NEXTAUTH_SECRET=<paste-the-generated-secret>
```

### 4. (Optional) Set Up OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Update `.env.local` with CLIENT_ID and CLIENT_SECRET

#### GitHub OAuth:
1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Update `.env.local` with GITHUB_ID and GITHUB_SECRET

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps After Starting

1. **Sign Up** - Create your first account at `/signup`
2. **Explore Features**:
   - Dashboard - Overview of key metrics
   - Burn & Runway - See cash runway projections
   - SaaS Metrics - View MRR, churn, cohort analysis
   - Hiring Plan - Model headcount growth
   - Fundraising - Compare raise scenarios

## 📊 Demo Data

All components have demo data built-in, so you can see the full functionality immediately without connecting integrations.

## 🏗️ Architecture

```
farofinance/
├── app/
│   ├── (auth)/          # Login/signup pages
│   │   ├── login/
│   │   └── signup/
│   ├── api/             # API routes
│   │   ├── auth/        # NextAuth endpoints
│   │   ├── budgets/     # Budget CRUD
│   │   ├── models/      # Financial model CRUD
│   │   ├── cash/        # Cash position API
│   │   ├── revenue/     # Revenue records API
│   │   └── hiring/      # Hiring plan API
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Main app with routing
├── components/          # All UI components
│   ├── Dashboard.tsx
│   ├── RunwayCalculator.tsx
│   ├── CashFlowForecast.tsx
│   ├── SaaSMetrics.tsx
│   ├── HiringPlan.tsx
│   ├── FundraisingScenarios.tsx
│   ├── FinancialStatements.tsx
│   ├── InvestorDashboard.tsx
│   └── Sidebar.tsx
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Organization.ts
│   ├── CashPosition.ts
│   ├── RevenueRecord.ts
│   └── HiringPlan.ts
├── lib/
│   ├── auth/            # Auth config & middleware
│   ├── stores/          # Zustand state management
│   ├── validations/     # Zod schemas
│   └── mongodb.ts       # DB connection
└── .env.local           # Environment variables
```

## 🔐 User Roles

- **Admin** - Full access to all features
- **Editor** - Can create/edit models, budgets, scenarios
- **Viewer** - Read-only access
- **Investor** - Limited view for investor dashboards

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard.

### MongoDB Production

1. Whitelist Vercel IPs in MongoDB Atlas
2. Use production connection string
3. Update NEXTAUTH_URL to your domain

## 📈 Roadmap (Next Features)

- [ ] **Phase 3**: Real integrations (QuickBooks, Xero, Stripe, Plaid)
- [ ] **Phase 5**: Stripe billing for subscription tiers
- [ ] **Phase 6**: Tests, dark mode, performance optimization
- [ ] **AI Features**: Natural language queries, automated insights

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Auth**: NextAuth.js
- **State**: Zustand
- **Charts**: Recharts
- **Validation**: Zod

## 🆘 Troubleshooting

**"Failed to connect to MongoDB"**
- Check MONGODB_URI in .env.local
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)

**"OAuth sign-in not working"**
- Verify CLIENT_ID and CLIENT_SECRET in .env.local
- Check redirect URIs match exactly
- Ensure OAuth apps are not in "testing" mode (Google)

**"Module not found" errors**
- Run `npm install` again
- Delete `.next` folder and restart dev server

## 💡 Tips

- All components use demo data by default
- Auth is required - you'll be redirected to /login
- MongoDB connection is lazy - only connects when needed
- Zustand stores persist in memory only (refresh = reset)

## 📞 Support

For issues, check:
- MongoDB Atlas is running and accessible
- .env.local has all required variables
- Node.js 18+ is installed
- Port 3000 is not in use

## 🎉 You're Ready!

Your FP&A platform is ready to use. Start by signing up and exploring the features!
