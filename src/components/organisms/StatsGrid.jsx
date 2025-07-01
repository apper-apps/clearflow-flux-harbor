import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatsGrid = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Balance',
      value: `₹${stats.totalBalance?.toLocaleString() || '0'}`,
      change: stats.balanceChange || 0,
      icon: 'Wallet',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Monthly Income',
      value: `₹${stats.monthlyIncome?.toLocaleString() || '0'}`,
      change: stats.incomeChange || 0,
      icon: 'TrendingUp',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Monthly Expenses',
      value: `₹${stats.monthlyExpenses?.toLocaleString() || '0'}`,
      change: stats.expenseChange || 0,
      icon: 'TrendingDown',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions || 0,
      change: stats.subscriptionChange || 0,
      icon: 'Calendar',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <div className={`flex items-center text-sm ${
                    stat.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ApperIcon 
                      name={stat.change > 0 ? 'ArrowUp' : 'ArrowDown'} 
                      className="w-4 h-4 mr-1" 
                    />
                    <span>{Math.abs(stat.change)}% from last month</span>
                  </div>
                )}
              </div>
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Hover effect gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;