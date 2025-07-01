import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { investmentService } from '@/services/api/investmentService';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInvestments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await investmentService.getAll();
      setInvestments(data);
    } catch (err) {
      setError('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const calculateReturns = (invested, current) => {
    if (invested === 0) return { amount: 0, percentage: 0 };
    const amount = current - invested;
    const percentage = (amount / invested) * 100;
    return { amount, percentage };
  };

  const getReturnsBadgeVariant = (percentage) => {
    if (percentage > 0) return 'success';
    if (percentage < 0) return 'error';
    return 'default';
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadInvestments} />;

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = calculateReturns(totalInvested, totalCurrent);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-blue-800">
                ₹{totalInvested.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="PiggyBank" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-purple-800">
                ₹{totalCurrent.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-r ${totalReturns.amount >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${totalReturns.amount >= 0 ? 'text-green-700' : 'text-red-700'} mb-1`}>
                Total Returns
              </p>
              <p className={`text-2xl font-bold ${totalReturns.amount >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                {totalReturns.amount >= 0 ? '+' : ''}₹{totalReturns.amount.toLocaleString()}
              </p>
              <p className={`text-sm ${totalReturns.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturns.percentage >= 0 ? '+' : ''}{totalReturns.percentage.toFixed(2)}%
              </p>
            </div>
            <div className={`w-12 h-12 ${totalReturns.amount >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-xl flex items-center justify-center`}>
              <ApperIcon name={totalReturns.amount >= 0 ? 'ArrowUp' : 'ArrowDown'} className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      {investments.length === 0 ? (
        <Empty
          title="No investments tracked"
          description="Start tracking your investment portfolio by adding your first holding"
          actionLabel="Add Investment"
          icon="TrendingUp"
        />
      ) : (
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Your Holdings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your stocks and mutual funds performance
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-0 text-sm font-semibold text-gray-900">
                    Investment
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Invested
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Current
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Returns
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investments.map((investment, index) => {
                  const returns = calculateReturns(investment.investedAmount, investment.currentValue);
                  
                  return (
                    <motion.tr
                      key={investment.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            investment.type === 'stock' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            <ApperIcon 
                              name={investment.type === 'stock' ? 'BarChart3' : 'PieChart'} 
                              className={`w-5 h-5 ${
                                investment.type === 'stock' ? 'text-blue-600' : 'text-purple-600'
                              }`} 
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{investment.name}</p>
                            <p className="text-sm text-gray-600">{investment.symbol}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-900 font-medium">
                          ₹{investment.investedAmount.toLocaleString()}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-900 font-medium">
                          ₹{investment.currentValue.toLocaleString()}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${
                            returns.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {returns.amount >= 0 ? '+' : ''}₹{returns.amount.toLocaleString()}
                          </span>
                          <Badge variant={getReturnsBadgeVariant(returns.percentage)} size="sm">
                            {returns.percentage >= 0 ? '+' : ''}{returns.percentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <Badge variant={investment.type === 'stock' ? 'info' : 'primary'}>
                          {investment.type === 'stock' ? 'Stock' : 'Mutual Fund'}
                        </Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Investments;