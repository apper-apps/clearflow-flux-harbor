import React, { useState, useEffect } from 'react';
import StatsGrid from '@/components/organisms/StatsGrid';
import RecentTransactions from '@/components/organisms/RecentTransactions';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { transactionService } from '@/services/api/transactionService';
import { subscriptionService } from '@/services/api/subscriptionService';
import { investmentService } from '@/services/api/investmentService';
import NetWorthChart from '@/components/organisms/NetWorthChart';
const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
try {
      const [transactions, subscriptions, investmentData] = await Promise.all([
        transactionService.getAll(),
        subscriptionService.getAll(),
        investmentService.getAll()
      ]);
      
      setInvestments(investmentData);

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
        
        <NetWorthChart investments={investments} />
      </div>
    </div>
  );
};

export default Dashboard;