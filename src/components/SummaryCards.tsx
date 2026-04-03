import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/dateUtils';

interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
  incomeChange: number;
  expenseChange: number;
}

export default function SummaryCards({
  balance,
  income,
  expenses,
  incomeChange,
  expenseChange,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-blue-100 text-sm font-medium">Total Balance</p>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            incomeChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {incomeChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(incomeChange).toFixed(1)}%
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Income</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(income)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">vs last month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            expenseChange >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {expenseChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(expenseChange).toFixed(1)}%
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(expenses)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">vs last month</p>
        </div>
      </div>
    </div>
  );
}
