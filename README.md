# Budget Tracker Application

An elegant, full-featured personal budget tracking web application built with React, TypeScript, and tRPC.

## Features

### Core Functionality
- **User Authentication**: Secure login with OAuth integration
- **Transaction Management**: Create, read, update, and delete income and expense transactions
- **Real-time Balance Calculation**: Automatic calculation of total balance, income, and expenses
- **Category Management**: Organize transactions by customizable categories
- **Financial Analytics**: Visualize spending patterns with charts and reports

### Dashboard
- Summary cards showing Total Balance, Total Income, and Total Expenses
- Monthly trend chart displaying income vs. expenses over time
- Expense breakdown pie chart by category
- Recent transactions widget

### Transaction Management
- Complete transaction list with filtering and sorting
- Filter by transaction type (Income/Expense)
- Search transactions by description
- Delete transactions with confirmation
- Add new transactions with date, category, and description

### Analytics
- 12-month trend analysis with bar charts
- Income vs. Expenses comparison pie chart
- Category-based expense breakdown
- Category-based income breakdown
- Detailed transaction counts and totals

### Design
- Responsive design for mobile, tablet, and desktop
- Clean, professional UI with Tailwind CSS
- Elegant color scheme with gradient cards
- Smooth transitions and animations
- Accessible navigation with sidebar menu

## Project Structure

```
budget_tracker_export/
├── public/                 # Built HTML, CSS, and assets
│   ├── index.html         # Main HTML file
│   └── assets/            # Compiled CSS and JavaScript
├── src/                   # React source code
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── AddTransaction.tsx
│   │   └── Analytics.tsx
│   ├── components/       # Reusable components
│   │   └── BudgetDashboardLayout.tsx
│   ├── lib/              # Utilities and helpers
│   │   └── trpc.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── server/               # Backend code
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database helpers
│   └── _core/            # Core server utilities
├── drizzle/              # Database schema
│   └── schema.ts         # Table definitions
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite build config
└── index.js              # Built server file
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **tRPC** - Type-safe RPC framework
- **Wouter** - Lightweight routing

### Backend
- **Express 4** - Web server
- **tRPC 11** - RPC framework
- **Drizzle ORM** - Database ORM
- **MySQL** - Database

### Testing
- **Vitest** - Unit testing framework

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- MySQL database

### Development Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file with:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/budget_tracker
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   ```

3. **Set up database**:
   ```bash
   pnpm db:push
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3000`

## Building for Production

```bash
pnpm build
pnpm start
```

The built application will be available in the `dist/` directory.

## Testing

Run the test suite:
```bash
pnpm test
```

Tests include:
- Transaction CRUD operations
- Analytics calculations
- Category management
- Balance calculations
- Data persistence

## API Endpoints

### Transaction Procedures
- `transaction.list` - Get all transactions with pagination
- `transaction.create` - Create a new transaction
- `transaction.update` - Update an existing transaction
- `transaction.delete` - Delete a transaction
- `transaction.getByDateRange` - Get transactions within a date range

### Analytics Procedures
- `analytics.getSummary` - Get financial summary (balance, income, expenses)
- `analytics.getMonthlyTrend` - Get 12-month trend data
- `analytics.getCategoryBreakdown` - Get spending by category

### Category Procedures
- `category.list` - Get all categories (optionally filtered by type)
- `category.create` - Create a new category
- `category.update` - Update a category
- `category.delete` - Delete a category

## Database Schema

### Users Table
- `id` - Primary key
- `openId` - OAuth identifier
- `name` - User name
- `email` - User email
- `role` - User role (user/admin)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Transactions Table
- `id` - Primary key
- `userId` - Foreign key to users
- `type` - Transaction type (income/expense)
- `amount` - Transaction amount
- `categoryId` - Foreign key to categories
- `description` - Transaction description
- `date` - Transaction date
- `createdAt` - Creation timestamp

### Categories Table
- `id` - Primary key
- `userId` - Foreign key to users
- `name` - Category name
- `type` - Category type (income/expense)
- `createdAt` - Creation timestamp

## Features Implemented

✅ User authentication with OAuth
✅ Complete transaction management (CRUD)
✅ Real-time balance calculation
✅ Category-based tracking
✅ Advanced analytics with charts
✅ Responsive design
✅ Professional UI/UX
✅ Comprehensive unit tests
✅ Database persistence
✅ Error handling

## Future Enhancements

- Recurring transactions (automatic monthly/weekly)
- Budget goals and spending alerts
- CSV/PDF export and reports
- Transaction editing interface
- Category customization UI
- Dark/light theme toggle
- Mobile app version
- Multi-user support
- Advanced filtering and date ranges

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 pnpm dev
```

### Database Connection Issues
Ensure your MySQL server is running and the connection string in `.env.local` is correct.

### Build Errors
Clear the build cache and reinstall dependencies:
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

## Support

For issues or questions, please refer to the project documentation or contact support.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Credits

Built with modern web technologies and best practices for elegant, efficient budget tracking.
