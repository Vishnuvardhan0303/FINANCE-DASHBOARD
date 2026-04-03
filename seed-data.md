# Seed Data Instructions

To test the dashboard with realistic data, you can add sample transactions manually or use the following SQL queries directly in your Supabase SQL editor.

## Quick Start Demo Data

After creating an account, note your user ID from the auth.users table, then run these queries to populate sample data:

### Sample Transactions for Testing

Replace `YOUR_USER_ID` with your actual user ID from Supabase auth.

```sql
-- Get category IDs first
SELECT id, name FROM categories;

-- Insert sample income transactions (last 6 months)
INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Salary'), 5000.00, 'income', 'Monthly salary', '2024-01-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Salary'), 5000.00, 'income', 'Monthly salary', '2024-02-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Salary'), 5000.00, 'income', 'Monthly salary', '2024-03-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Freelance'), 1500.00, 'income', 'Website project', '2024-01-20'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Freelance'), 2000.00, 'income', 'Mobile app development', '2024-02-25'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Investments'), 300.00, 'income', 'Stock dividends', '2024-03-10');

-- Insert sample expense transactions
INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Food & Dining'), 85.50, 'expense', 'Grocery shopping', '2024-01-05'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Food & Dining'), 45.00, 'expense', 'Restaurant dinner', '2024-01-12'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Transportation'), 120.00, 'expense', 'Gas and maintenance', '2024-01-08'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Transportation'), 50.00, 'expense', 'Uber rides', '2024-01-22'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Shopping'), 150.00, 'expense', 'New shoes', '2024-01-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Shopping'), 89.99, 'expense', 'Books', '2024-02-03'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Entertainment'), 60.00, 'expense', 'Concert tickets', '2024-01-28'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Entertainment'), 45.00, 'expense', 'Movie and popcorn', '2024-02-14'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Bills & Utilities'), 200.00, 'expense', 'Electricity and water', '2024-01-01'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Bills & Utilities'), 100.00, 'expense', 'Internet and phone', '2024-01-05'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Healthcare'), 75.00, 'expense', 'Doctor visit', '2024-02-10'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Healthcare'), 35.00, 'expense', 'Pharmacy', '2024-02-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Education'), 120.00, 'expense', 'Online course', '2024-03-01'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Food & Dining'), 92.30, 'expense', 'Weekly groceries', '2024-02-12'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Food & Dining'), 67.80, 'expense', 'Lunch meetings', '2024-03-05'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Transportation'), 135.00, 'expense', 'Gas', '2024-02-15'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Shopping'), 220.00, 'expense', 'New jacket', '2024-03-10'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Bills & Utilities'), 195.00, 'expense', 'Utilities', '2024-02-01'),
  ('YOUR_USER_ID', (SELECT id FROM categories WHERE name = 'Bills & Utilities'), 210.00, 'expense', 'Utilities', '2024-03-01');
```

### Creating Test Accounts

You can create two test accounts to demonstrate role-based access:

1. **Admin Account**:
   - Email: admin@demo.com
   - Password: demo123
   - Role: Admin
   - Can add, edit, and delete transactions

2. **Viewer Account**:
   - Email: viewer@demo.com
   - Password: demo123
   - Role: Viewer
   - Can only view data

Create these through the UI signup form and select the appropriate role.

## Expected Results

After adding this data, your dashboard should show:

- **Total Balance**: Positive balance from income vs expenses
- **Income/Expense Trend**: Visible patterns over months
- **Category Breakdown**: Distribution across different spending categories
- **Insights**:
  - Top category will likely be "Bills & Utilities" or "Transportation"
  - Monthly trends showing spending patterns
  - Average daily spending calculation
  - Savings rate percentage

## Tips for Demo

1. **Show Both Roles**: Create accounts for both admin and viewer to demonstrate RBAC
2. **Add Real-Time**: Add a transaction as admin and show it appears immediately
3. **Filtering**: Demonstrate the advanced filtering and search
4. **Export**: Export data to CSV/JSON to show functionality
5. **Dark Mode**: Toggle between themes to showcase design
6. **Responsive**: Test on mobile device or resize browser

## Resetting Data

To clear all transactions for a user:

```sql
DELETE FROM transactions WHERE user_id = 'YOUR_USER_ID';
```

To delete a specific account (this will cascade delete all related data):

```sql
-- This should be done through Supabase Auth dashboard for safety
-- Or contact a database administrator
```