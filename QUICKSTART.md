# Budget Tracker - Quick Start Guide

Get your budget tracker up and running in minutes!

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Configure Database
Create a `.env.local` file in the project root:
```
DATABASE_URL=mysql://root:password@localhost:3306/budget_tracker
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Step 3: Initialize Database
```bash
pnpm db:push
```

### Step 4: Start Development Server
```bash
pnpm dev
```

### Step 5: Open in Browser
Navigate to `http://localhost:3000`

## Using the Application

### Dashboard
- View your financial summary at a glance
- See total balance, income, and expenses
- Check monthly spending trends
- View expense breakdown by category

### Add Transactions
1. Click "Add Transaction" button
2. Select transaction type (Income or Expense)
3. Enter amount and select category
4. Add optional description
5. Click "Add Transaction"

### View Transactions
1. Go to "Transactions" page
2. Filter by type (All/Income/Expense)
3. Search by description
4. Delete transactions as needed

### Analyze Spending
1. Go to "Analytics" page
2. View 12-month trend chart
3. Check income vs. expense breakdown
4. See category-based spending analysis

## Common Tasks

### Add Monthly Salary
1. Click "Add Transaction"
2. Select "Income"
3. Enter amount (e.g., 5000)
4. Select "Salary" category
5. Click "Add Transaction"

### Track Groceries
1. Click "Add Transaction"
2. Select "Expense"
3. Enter amount spent
4. Select "Groceries" category
5. Add description (optional)
6. Click "Add Transaction"

### Check Budget Status
1. Go to Dashboard
2. View "Total Balance" card
3. Check "Total Expenses" to see spending
4. Review "Monthly Trend" chart

### View Spending by Category
1. Go to Analytics page
2. Scroll to "Expense Categories"
3. See total and count for each category

## Tips & Tricks

- **Quick Add**: Use the "Add Transaction" button from any page
- **Filter Transactions**: Use the type filter to see only income or expenses
- **Search**: Use the search box to find specific transactions
- **Analytics**: Check the Analytics page weekly to monitor spending patterns
- **Categories**: Use consistent categories for better analysis

## Keyboard Shortcuts

- `Ctrl+K` or `Cmd+K` - Open command palette (if implemented)
- `Escape` - Close modals and dialogs

## Troubleshooting

### Can't Connect to Database
- Check MySQL is running: `mysql -u root -p`
- Verify DATABASE_URL in `.env.local`
- Ensure database exists: `CREATE DATABASE budget_tracker;`

### Port 3000 Already in Use
```bash
PORT=3001 pnpm dev
```

### Changes Not Showing
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server (Ctrl+C, then `pnpm dev`)

### Database Errors
```bash
# Reset database
pnpm db:push
```

## Next Steps

1. **Add Your First Transaction** - Start tracking income and expenses
2. **Set Up Categories** - Customize categories for your needs
3. **Review Analytics** - Check spending patterns weekly
4. **Plan Budget** - Use insights to plan monthly budget

## Getting Help

- Check README.md for detailed documentation
- Review database schema in `drizzle/schema.ts`
- Check tRPC procedures in `server/routers.ts`
- Review test files for usage examples

## Features Overview

| Feature | Location | Status |
|---------|----------|--------|
| Dashboard | Home page | ✅ Active |
| Transactions | Transactions page | ✅ Active |
| Add Transaction | Add Transaction page | ✅ Active |
| Analytics | Analytics page | ✅ Active |
| Categories | Built-in | ✅ Active |
| Authentication | OAuth | ✅ Active |
| Real-time Balance | Dashboard | ✅ Active |
| Charts | Dashboard & Analytics | ✅ Active |

## Performance Tips

- Use filters to reduce transaction list size
- Archive old transactions if needed
- Check analytics monthly for insights
- Keep categories organized

Enjoy tracking your budget! 💰
