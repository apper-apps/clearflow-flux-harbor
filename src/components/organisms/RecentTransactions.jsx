import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import CategoryPill from '@/components/molecules/CategoryPill';
import { transactionService } from '@/services/api/transactionService';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transactionService.getAll();
      const recent = data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setTransactions(recent);
    } catch (err) {
      setError('Failed to load recent transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;
  if (transactions.length === 0) {
    return (
      <Empty
        title="No transactions yet"
        description="Start tracking your finances by adding your first transaction"
        actionLabel="Add Transaction"
        icon="Receipt"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <ApperIcon 
                  name={transaction.type === 'income' ? 'TrendingUp' : 'TrendingDown'} 
                  className={`w-4 h-4 ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`} 
                />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <CategoryPill category={transaction.category} />
                  <span className="text-xs text-gray-500">
                    {format(new Date(transaction.date), 'MMM dd')}
                  </span>
                </div>
              </div>
            </div>
            
            <span className={`text-sm font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTransactions;