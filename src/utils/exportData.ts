import type { TransactionWithCategory } from '../types/database';

export function exportToCSV(transactions: TransactionWithCategory[]) {
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
  const rows = transactions.map(t => [
    t.date,
    t.type,
    t.category.name,
    t.amount.toString(),
    t.description || ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJSON(transactions: TransactionWithCategory[]) {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
