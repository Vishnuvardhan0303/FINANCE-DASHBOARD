/*
  # Finance Dashboard Schema

  ## Overview
  Complete database schema for a finance dashboard application with role-based access control.

  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (text, either 'viewer' or 'admin')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. categories
  - `id` (uuid, primary key)
  - `name` (text, category name like 'Food', 'Transport', etc.)
  - `type` (text, either 'income' or 'expense')
  - `color` (text, hex color for UI)
  - `icon` (text, icon identifier)
  - `created_at` (timestamptz)
  
  ### 3. transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `category_id` (uuid, references categories)
  - `amount` (numeric, transaction amount)
  - `type` (text, either 'income' or 'expense')
  - `description` (text, transaction description)
  - `date` (date, transaction date)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  
  ### RLS Policies
  
  #### profiles table
  - Users can view their own profile
  - Users can update their own profile
  - New users can insert their own profile
  
  #### categories table
  - All authenticated users can view categories
  - Only admins can manage categories
  
  #### transactions table
  - Users can view their own transactions
  - Users can create their own transactions
  - Only admins can update transactions
  - Only admins can delete transactions

  ## Notes
  - All tables have RLS enabled for security
  - Timestamps use timestamptz for proper timezone handling
  - Foreign keys ensure data integrity
  - Default values prevent null errors
  - Categories are shared across all users for consistency
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  color text NOT NULL DEFAULT '#6366f1',
  icon text NOT NULL DEFAULT 'DollarSign',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount numeric NOT NULL CHECK (amount > 0),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  description text DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any transaction"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete any transaction"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default categories
INSERT INTO categories (name, type, color, icon) VALUES
  ('Salary', 'income', '#10b981', 'Briefcase'),
  ('Freelance', 'income', '#14b8a6', 'Code'),
  ('Investments', 'income', '#8b5cf6', 'TrendingUp'),
  ('Other Income', 'income', '#6366f1', 'DollarSign'),
  ('Food & Dining', 'expense', '#f59e0b', 'UtensilsCrossed'),
  ('Transportation', 'expense', '#ef4444', 'Car'),
  ('Shopping', 'expense', '#ec4899', 'ShoppingBag'),
  ('Entertainment', 'expense', '#a855f7', 'Film'),
  ('Bills & Utilities', 'expense', '#3b82f6', 'Receipt'),
  ('Healthcare', 'expense', '#06b6d4', 'Heart'),
  ('Education', 'expense', '#8b5cf6', 'GraduationCap'),
  ('Other Expenses', 'expense', '#64748b', 'MoreHorizontal')
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);