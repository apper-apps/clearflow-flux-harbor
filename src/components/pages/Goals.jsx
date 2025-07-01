import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { goalService } from '@/services/api/goalService';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleContribute = (goalId, amount) => {
    // Mock contribution functionality
    toast.info(`Contribution of ₹${amount} functionality coming soon!`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalService.delete(id);
      toast.success('Goal deleted successfully');
      loadGoals();
    } catch (err) {
      toast.error('Failed to delete goal');
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#06b6d4';
    if (percentage >= 50) return '#4f46e5';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalGoalAmount > 0 ? (totalSavedAmount / totalGoalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-accent-50 to-accent-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              Overall Progress
            </h3>
            <p className="text-3xl font-bold text-accent-700">
              {overallProgress.toFixed(1)}%
            </p>
            <p className="text-sm text-accent-600 mt-1">
              ₹{totalSavedAmount.toLocaleString()} of ₹{totalGoalAmount.toLocaleString()}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
            <ApperIcon name="Target" className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Empty
          title="No financial goals set"
          description="Create your first financial goal to start tracking your progress"
          actionLabel="Add Goal"
          icon="Target"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const progressColor = getProgressColor(progressPercentage);
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            
            return (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-display font-semibold text-gray-900">
                        {goal.name}
                      </h4>
                      <p className="text-sm text-gray-600">{goal.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleContribute(goal.Id, 1000)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Add contribution"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(goal.Id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-6">
                    <ProgressRing
                      percentage={progressPercentage}
                      color={progressColor}
                      size={120}
                    >
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {progressPercentage.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-600">Complete</p>
                      </div>
                    </ProgressRing>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current</span>
                      <span className="font-semibold text-gray-900">
                        ₹{goal.currentAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="font-semibold text-gray-900">
                        ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="font-semibold text-primary-600">
                        ₹{Math.max(0, remainingAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {progressPercentage >= 100 && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Check" className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;