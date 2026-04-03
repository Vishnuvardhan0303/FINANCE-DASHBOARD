# FinanceFlow - Financial Dashboard

A comprehensive, production-ready finance dashboard built with React, TypeScript, Tailwind CSS, and Supabase. This application demonstrates advanced frontend development skills with real-time data persistence, role-based access control, and modern UI/UX patterns.

## Features

### Core Functionality
- **Dashboard Overview**: Real-time financial summary with balance, income, and expenses
- **Interactive Visualizations**: Custom-built SVG charts showing balance trends and spending breakdown
- **Transaction Management**: Complete CRUD operations with filtering, sorting, and search
- **Financial Insights**: Automated analysis showing spending patterns and trends
- **Role-Based Access Control**: Viewer (read-only) and Admin (full access) roles

### Advanced Features
- **Dark Mode**: Full theme support with smooth transitions
- **Data Export**: Export transactions to CSV or JSON formats
- **Real-time Updates**: Instant UI updates after data changes
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Animations**: Smooth transitions and micro-interactions throughout
- **Data Persistence**: Supabase backend with PostgreSQL database
- **Authentication**: Secure email/password authentication

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (PostgreSQL + Authentication + RLS)
- **Charts**: Custom SVG-based visualizations
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API

## Architecture Highlights

### Component Structure
- **Modular Components**: Each component follows single responsibility principle
- **Type Safety**: Full TypeScript coverage with database type generation
- **Custom Hooks**: Reusable context hooks for auth and theme
- **Utility Functions**: Separated business logic from components

### Database Design
- **Row Level Security**: All tables protected with RLS policies
- **Foreign Keys**: Referential integrity maintained
- **Indexes**: Optimized for common query patterns
- **Type Safety**: Database types auto-generated and used throughout

### Security
- **RLS Policies**: Users can only access their own data
- **Role-Based Access**: Admin and Viewer roles with different permissions
- **Input Validation**: Client and server-side validation
- **Secure Authentication**: Supabase Auth with JWT tokens

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (already configured)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start the development server:
```bash
npm run dev
```

### Demo Accounts

Create accounts with different roles to test functionality:
- **Admin**: Full access to create, edit, and delete transactions
- **Viewer**: Read-only access to view all data

## Usage Guide

### For Admins
1. Sign up with Admin role or sign in to existing admin account
2. Use the "Add Transaction" button to create new transactions
3. Filter, sort, and search through transactions
4. Export data to CSV or JSON
5. Delete transactions using the trash icon
6. Toggle between light and dark modes

### For Viewers
1. Sign up with Viewer role or sign in to existing viewer account
2. View dashboard with all financial summaries
3. Explore transactions and insights
4. Export data to CSV or JSON
5. All modification features are disabled

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication UI
│   ├── Dashboard.tsx   # Main dashboard container
│   ├── Header.tsx      # App header with theme toggle
│   ├── SummaryCards.tsx # Financial summary cards
│   ├── TransactionForm.tsx # Add/edit transaction modal
│   ├── TransactionsList.tsx # Transaction table with filters
│   ├── Insights.tsx    # Financial insights panel
│   └── charts/         # Custom chart components
│       ├── LineChart.tsx
│       └── PieChart.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Theme state
├── lib/               # Configuration
│   └── supabase.ts   # Supabase client
├── types/            # TypeScript types
│   └── database.ts   # Database type definitions
├── utils/            # Utility functions
│   ├── dateUtils.ts  # Date formatting helpers
│   └── exportData.ts # Export functionality
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles + animations
```

## Key Features Explained

### Custom Charts
Instead of using a library, charts are built from scratch using SVG:
- **LineChart**: Shows balance trends over time with smooth curves
- **PieChart**: Displays spending distribution by category
- **Interactive**: Hover states and smooth animations
- **Responsive**: Scales perfectly on all screen sizes

### Role-Based UI
The UI dynamically adapts based on user role:
- Admins see "Add Transaction" button and delete actions
- Viewers see a notification about their read-only status
- All filtering and viewing features available to both roles

### Insights Panel
Automatically calculates and displays:
- Top spending category
- Monthly spending trends (vs previous month)
- Average daily spending
- Savings rate (income - expenses / income)

### Advanced Filtering
Transaction list supports:
- **Search**: By description or category name
- **Type Filter**: Show all, income only, or expenses only
- **Category Filter**: Filter by specific category
- **Sorting**: By date or amount, ascending or descending

### Export Functionality
- **CSV Export**: Spreadsheet-compatible format
- **JSON Export**: For programmatic access
- Includes all transaction details with category names

## Design Decisions

### Why Custom Charts?
Building charts from scratch demonstrates:
- Deep understanding of SVG and visualization
- Ability to create exactly what's needed without library overhead
- Fine control over styling and animations
- Better performance (no large dependencies)

### Why Context API?
For this application size:
- Simple and effective state management
- No external dependencies needed
- Easy to understand and maintain
- Perfect for auth and theme state

### Why Tailwind CSS?
- Rapid development with utility classes
- Consistent design system
- Easy dark mode implementation
- Small production bundle with purging
- No CSS naming conflicts

### Why Supabase?
- Real backend with PostgreSQL database
- Built-in authentication
- Row Level Security for data protection
- Real-time capabilities (if needed later)
- Easy to scale and deploy

## Performance Optimizations

- **useMemo**: Expensive calculations cached
- **Lazy Loading**: Components loaded as needed
- **Optimized Re-renders**: Context split by concern
- **CSS Animations**: Hardware-accelerated transforms
- **Indexed Database**: Fast query performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential additions to make it even more impressive:
- Recurring transactions
- Budget tracking and alerts
- Multi-currency support
- PDF report generation
- Data visualization dashboard
- Mobile app (React Native)
- Real-time collaboration
- AI-powered insights

## License

This project is created for evaluation purposes.

## Author

Built with attention to detail, modern best practices, and a focus on user experience.