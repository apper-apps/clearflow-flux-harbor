import React, { useState, useEffect } from 'react';
import StatsGrid from '@/components/organisms/StatsGrid';
import RecentTransactions from '@/components/organisms/RecentTransactions';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { transactionService } from '@/services/api/transactionService';
import { subscriptionService } from '@/services/api/subscriptionService';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [transactions, subscriptions] = await Promise.all([
        transactionService.getAll(),
        subscriptionService.getAll()
      ]);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });

      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalBalance = transactions.reduce((sum, t) => {
        return t.type === 'income' ? sum + t.amount : sum - t.amount;
      }, 0);

      const activeSubscriptions = subscriptions.filter(s => s.active).length;

      setStats({
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        activeSubscriptions,
        balanceChange: 12, // Mock data for demo
        incomeChange: 8,
        expenseChange: -5,
        subscriptionChange: 2
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions />
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl text-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-primary-700">Add Income</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl text-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-700">Add Expense</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;