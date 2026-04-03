import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react';
import { formatCurrency, getCurrentMonth, getPreviousMonth } from '../utils/dateUtils';
import type { TransactionWithCategory } from '../types/database';

interface InsightsProps {
  transactions: TransactionWithCategory[];
}

export default function Insights({ transactions }: InsightsProps) {
  const insights = useMemo(() => {
    const currentMonth = getCurrentMonth();
    const previousMonth = getPreviousMonth();

    const currentMonthTxns = transactions.filter(t => t.date.startsWith(currentMonth));
    const previousMonthTxns = transactions.filter(t => t.date.startsWith(previousMonth));

    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category.name] = (acc[t.category.name] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];

    const currentSpending = currentMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousSpending = previousMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const spendingChange = previousSpending > 0
      ? ((currentSpending - previousSpending) / previousSpending) * 100
      : 0;

    const currentIncome = currentMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgDailySpending = currentMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / new Date().getDate();

    const savingsRate = currentIncome > 0
      ? ((currentIncome - currentSpending) / currentIncome) * 100
      : 0;

    return {
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      spendingChange,
      avgDailySpending,
      savingsRate,
    };
  }, [transactions]);

  const insightCards = [
    {
      icon: Award,
      title: 'Top Spending Category',
      value: insights.topCategory?.name || 'N/A',
      subtitle: insights.topCategory ? formatCurrency(insights.topCategory.amount) : 'No expenses yet',
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: insights.spendingChange > 0 ? TrendingUp : TrendingDown,
      title: 'Monthly Spending Trend',
      value: `${insights.spendingChange > 0 ? '+' : ''}${insights.spendingChange.toFixed(1)}%`,
      subtitle: 'vs last month',
      color: insights.spendingChange > 0 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600',
      iconBg: insights.spendingChange > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30',
      iconColor: insights.spendingChange > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
    },
    {
      icon: TrendingUp,
      title: 'Avg. Daily Spending',
      value: formatCurrency(insights.avgDailySpending),
      subtitle: 'this month',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: AlertCircle,
      title: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      subtitle: 'of income saved',
      color: insights.savingsRate > 20 ? 'from-green-500 to-green-600' : 'from-yellow-500 to-yellow-600',
      iconBg: insights.savingsRate > 20 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: insights.savingsRate > 20 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Insights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insightCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 ${card.iconBg} rounded-lg`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Get Started
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Add your first transaction to see personalized insights and spending patterns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
