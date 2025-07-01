import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { subscriptionService } from '@/services/api/subscriptionService';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await subscriptionService.getAll();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const getFrequencyText = (frequency) => {
    const frequencies = {
      'monthly': 'per month',
      'yearly': 'per year', 
      'weekly': 'per week'
    };
    return frequencies[frequency] || frequency;
  };

  const getDaysUntilRenewal = (nextDue) => {
    const today = new Date();
    const due = new Date(nextDue);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRenewalBadgeVariant = (daysUntil) => {
    if (daysUntil <= 3) return 'error';
    if (daysUntil <= 7) return 'warning';
    return 'success';
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const subscription = subscriptions.find(s => s.Id === id);
      await subscriptionService.update(id, { ...subscription, active: !currentStatus });
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadSubscriptions();
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await subscriptionService.delete(id);
      toast.success('Subscription deleted successfully');
      loadSubscriptions();
    } catch (err) {
      toast.error('Failed to delete subscription');
    }
  };

  const totalMonthlyAmount = subscriptions
    .filter(s => s.active)
    .reduce((sum, s) => {
      if (s.frequency === 'monthly') return sum + s.amount;
      if (s.frequency === 'yearly') return sum + (s.amount / 12);
      if (s.frequency === 'weekly') return sum + (s.amount * 4.33);
      return sum;
    }, 0);

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadSubscriptions} />;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              Monthly Subscription Cost
            </h3>
            <p className="text-3xl font-bold text-purple-700">
              ₹{totalMonthlyAmount.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {subscriptions.filter(s => s.active).length} active subscriptions
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ApperIcon name="Calendar" className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {/* Subscriptions Grid */}
      {subscriptions.length === 0 ? (
        <Empty
          title="No subscriptions tracked"
          description="Start tracking your recurring expenses by adding your first subscription"
          actionLabel="Add Subscription"
          icon="Calendar"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription, index) => {
            const daysUntilRenewal = getDaysUntilRenewal(subscription.nextDue);
            
            return (
              <motion.div
                key={subscription.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative ${!subscription.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-display font-semibold text-gray-900">
                        {subscription.name}
                      </h4>
                      <p className="text-sm text-gray-600">{subscription.category}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {subscription.active && (
                        <Badge variant={getRenewalBadgeVariant(daysUntilRenewal)}>
                          {daysUntilRenewal > 0 ? `${daysUntilRenewal}d` : 'Due'}
                        </Badge>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleActive(subscription.Id, subscription.active)}
                          className={`p-2 rounded-lg transition-colors ${
                            subscription.active 
                              ? 'text-green-600 hover:bg-green-100' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <ApperIcon name={subscription.active ? 'Play' : 'Pause'} className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(subscription.Id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{subscription.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getFrequencyText(subscription.frequency)}
                      </span>
                    </div>

                    {subscription.active && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next renewal:</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(subscription.nextDue), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>

                  {!subscription.active && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">Paused</span>
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

export default Subscriptions;