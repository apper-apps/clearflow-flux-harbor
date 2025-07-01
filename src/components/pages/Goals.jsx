import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import GoalProgressCard from '@/components/molecules/GoalProgressCard';
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
          {goals.map((goal, index) => (
            <GoalProgressCard
              key={goal.Id}
              goal={goal}
              index={index}
              onContribute={handleContribute}
              onDelete={handleDelete}
              getProgressPercentage={getProgressPercentage}
              getProgressColor={getProgressColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;