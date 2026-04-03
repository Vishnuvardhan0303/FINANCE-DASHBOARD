import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getLast6Months, getCurrentMonth, getPreviousMonth } from '../utils/dateUtils';
import type { TransactionWithCategory, Category } from '../types/database';
import Header from './Header';
import SummaryCards from './SummaryCards';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import TransactionsList from './TransactionsList';
import TransactionForm from './TransactionForm';
import Insights from './Insights';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        supabase
          .from('transactions')
          .select('*, category:categories(*)')
          .eq('user_id', user?.id)
          .order('date', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (transactionsRes.data) {
        setTransactions(transactionsRes.data as any);
      }
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const previousMonth = getPreviousMonth();

    const currentMonthTxns = transactions.filter(t => t.date.startsWith(currentMonth));
    const previousMonthTxns = transactions.filter(t => t.date.startsWith(previousMonth));

    const income = currentMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousIncome = previousMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousExpenses = previousMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeChange = previousIncome > 0 ? ((income - previousIncome) / previousIncome) * 100 : 0;
    const expenseChange = previousExpenses > 0 ? ((expenses - previousExpenses) / previousExpenses) * 100 : 0;

    return {
      balance: income - expenses,
      income,
      expenses,
      incomeChange,
      expenseChange,
    };
  }, [transactions]);

  const balanceTrend = useMemo(() => {
    const months = getLast6Months();
    return months.map(({ month, year }) => {
      const monthStr = `${year}-${String(months.indexOf({ month, year }) + 1).padStart(2, '0')}`;
      const monthTxns = transactions.filter(t => t.date.startsWith(monthStr));

      const income = monthTxns
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTxns
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        label: month,
        value: income - expenses,
      };
    });
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const key = t.category.name;
        acc[key] = (acc[key] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => {
        const category = categories.find(c => c.name === name);
        return {
          label: name,
          value,
          color: category?.color || '#6366f1',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back, {profile?.full_name || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your financial overview
            </p>
          </div>
          {profile?.role === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>

        <div className="space-y-6">
          <SummaryCards
            balance={summary.balance}
            income={summary.income}
            expenses={summary.expenses}
            incomeChange={summary.incomeChange}
            expenseChange={summary.expenseChange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Balance Trend
              </h3>
              <LineChart data={balanceTrend} color="#3b82f6" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Spending by Category
              </h3>
              <PieChart data={spendingByCategory} />
            </div>
          </div>

          <Insights transactions={transactions} />

          <TransactionsList
            transactions={transactions}
            categories={categories}
            onUpdate={loadData}
          />
        </div>
      </main>

      {showAddForm && (
        <TransactionForm
          onClose={() => setShowAddForm(false)}
          onSuccess={loadData}
        />
      )}

      {profile?.role === 'viewer' && (
        <div className="fixed bottom-6 right-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-lg max-w-xs animate-slideUp">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Viewer Mode:</strong> You can view all data but cannot add or edit transactions. Switch to Admin role to make changes.
          </p>
        </div>
      )}
    </div>
  );
}
