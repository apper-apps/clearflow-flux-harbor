import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { transactionService } from '@/services/api/transactionService';

const QuickAddModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'],
    income: ['Salary', 'Business', 'Investment', 'Other']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await transactionService.create({
        ...formData,
        amount: parseFloat(formData.amount),
        bankAccount: 'Main Account',
        recurring: false
      });
      toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`, {
        className: 'animate-bounce-gentle'
      });
      onClose();
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Quick Add Transaction
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div className="flex space-x-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('type', 'expense')}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ApperIcon name="TrendingDown" className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Expense</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChange('type', 'income')}
                className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <ApperIcon name="TrendingUp" className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Income</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                icon="DollarSign"
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="block w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 font-body focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>
            </div>

            <Input
              label="Description"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              icon="FileText"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories[formData.type].map((category) => (
                  <motion.button
                    key={category}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChange('category', category)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.category === category
                        ? 'border-primary-200 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                Add Transaction
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuickAddModal;