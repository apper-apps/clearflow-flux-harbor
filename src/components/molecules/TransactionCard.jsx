import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import CategoryPill from '@/components/molecules/CategoryPill';
import Card from '@/components/atoms/Card';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card hover className="transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
              <ApperIcon 
                name={isIncome ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-5 h-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <CategoryPill category={transaction.category} />
                <span className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-lg font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </span>
            
            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(transaction.Id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;