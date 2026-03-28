# Backend

## Personal Finance Tracker - Backend

### Features

- User authentication with JWT
- Expense management (add, delete, view)
- Income management with recurring support and active toggle
- Monthly budget setting per category
- Combined transaction history (income + expense)
- Overview analytics (monthly totals and balance)
- Charts data APIs (income vs expense, expense by category)

### Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### API Modules

- Auth: register, login
- Expense: CRUD operations
- Income: CRUD + recurring + toggle active
- Budget: set and track category-wise budgets
- Transaction: combined history with sorting and filtering
- Overview: monthly summary
- Analytics: chart data endpoints

### Setup

```
git clone https://github.com/ssacharya2002/Personal-Finance-Tracker
cd backend
npm install
npm run start
```

### Deployment

Backend URL: [https://personal-finance-tracker-5itk.onrender.com](https://personal-finance-tracker-5itk.onrender.com)

---

# Frontend

## Personal Finance Tracker - Frontend

### Features

- Secure login and authentication
- Add and manage expenses and income
- Category-based budgeting with progress tracking
- Interactive dashboard with charts
- Transaction history with search and filters
- Toggle recurring income active/inactive

### UI Features

- Dashboard overview with income, expense, and balance
- Bar chart for income vs expense trends
- Pie chart for expense by category
- Budget cards with progress bars and mini graphs

### Tech Stack

- React.js (with TypeScript)
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Axios for API calls

### Pages

- Overview
- Expenses
- Income
- Budget
- Transactions

### Setup

```
git clone https://github.com/ssacharya2002/Personal-Finance-Tracker
cd frontend
npm install
npm run dev
```

### Deployment

Frontend URL: [https://personal-finance-tracker-shakti.netlify.app](https://personal-finance-tracker-shakti.netlify.app)
