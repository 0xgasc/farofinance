# Faro Finance - Financial Planning & Analysis Platform

A modern financial planning and analysis platform inspired by Runway, built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

### Core Features
- **Dashboard**: Real-time financial metrics and KPIs visualization
- **Financial Models**: Create and manage complex financial models with drivers and formulas
- **Budget Management**: Track planned vs actual expenses with variance analysis
- **Scenario Planning**: Compare multiple business scenarios side-by-side
- **Metrics Tracking**: Monitor key business metrics with targets and trends

### Advanced Features (New!)
- **Integrations**: Connect to QuickBooks, Xero, Salesforce, Stripe, and more
  - No-code connections with field mapping
  - Automatic data syncing with configurable frequency
  - Support for multiple integration types (Accounting, CRM, HRIS, Payments)

- **Multi-Entity Support**: Manage subsidiaries and business units
  - Entity hierarchy with parent-child relationships
  - Consolidation rules and intercompany eliminations
  - Multi-currency support with conversion rules
  - Ownership percentages and proportional consolidation

- **Accounting Rules Engine**: Automate transaction processing
  - Create conditional rules for categorization and tagging
  - Expense allocation across departments
  - Revenue recognition rules
  - Intercompany transaction elimination
  - Priority-based rule execution

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB (with Mongoose ODM)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (for free tier database)

### Setup Instructions

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd farofinance
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure MongoDB**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster if you don't have one
   - Get your connection string
   - Update `.env.local` file with your MongoDB credentials:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/farofinance?retryWrites=true&w=majority
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
farofinance/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   │   ├── models/      # Financial models endpoints
│   │   ├── budgets/     # Budget management endpoints
│   │   └── metrics/     # Metrics tracking endpoints
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main dashboard page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── ModelBuilder.tsx # Financial model builder
│   ├── BudgetManager.tsx # Budget management
│   ├── ScenarioPlanner.tsx # Scenario planning
│   ├── MetricsView.tsx  # Metrics dashboard
│   └── Sidebar.tsx      # Navigation sidebar
├── lib/                 # Utilities
│   └── mongodb.ts       # MongoDB connection
├── models/              # Mongoose schemas
│   ├── Model.ts         # Financial model schema
│   ├── Budget.ts        # Budget schema
│   └── Metric.ts        # Metric schema
└── package.json         # Dependencies
```

## Features Overview

### Dashboard
- Revenue, expenses, profit, and headcount metrics
- Interactive charts for financial trends
- Department budget allocation visualization
- Key performance indicators (KPIs)

### Financial Models
- Create custom financial models with drivers
- Define relationships between metrics
- Run projections and forecasts
- Save and manage multiple models

### Budget Management
- Track planned vs actual expenses
- Automatic variance calculation
- Category and subcategory organization
- Editable budget items

### Scenario Planning
- Create multiple business scenarios
- Adjust growth assumptions in real-time
- Compare scenarios side-by-side
- Interactive revenue projections

### Metrics Tracking
- Monitor key business metrics
- Set and track targets
- Visualize trends over time
- Filter by category and time period

## MongoDB Schema

The app uses the following collections:

### Core Collections
1. **FinancialModel**: Stores financial models with drivers, scenarios, and time ranges
2. **Budget**: Manages budget items with planned/actual values
3. **Metric**: Tracks business metrics with historical data

### Integration & Multi-Entity Collections
4. **Integration**: Stores integration configurations, credentials, and sync status
5. **Entity**: Manages business entities, subsidiaries, and their relationships
6. **AccountingRule**: Defines automated rules for transaction processing
7. **Transaction**: Stores synchronized transactions from various sources

## Next Steps

To extend this demo:

1. **Authentication**: Add user authentication with NextAuth.js
2. **Real Data Integration**: Connect to actual data sources (QuickBooks, Stripe, etc.)
3. **Advanced Formulas**: Implement a formula engine for complex calculations
4. **Collaboration**: Add team features and permissions
5. **Export/Import**: Add data export to Excel/CSV
6. **API Integration**: Build REST/GraphQL APIs for external access

## License

MIT