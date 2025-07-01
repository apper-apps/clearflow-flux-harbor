import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { investmentService } from "@/services/api/investmentService";

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

  const simulateMarketUpdates = async () => {
    await loadInvestments();
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
<Card className="shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Portfolio Holdings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time tracking of your Indian market investments
                </p>
              </div>
              <button 
                onClick={simulateMarketUpdates}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <ApperIcon name="RefreshCw" className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Gain/Loss
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Units
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {investments.map((investment, index) => {
                  const returns = calculateReturns(investment.investedAmount, investment.currentValue);
                  const avgPrice = investment.investedAmount / investment.units;
                  const currentPrice = investment.currentValue / investment.units;
                  
                  return (
                    <motion.tr
                      key={investment.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            investment.type === 'stock' 
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200' 
                              : 'bg-gradient-to-br from-purple-100 to-purple-200'
                          }`}>
                            <ApperIcon 
                              name={investment.type === 'stock' ? 'TrendingUp' : 'PieChart'} 
                              className={`w-6 h-6 ${
                                investment.type === 'stock' ? 'text-blue-600' : 'text-purple-600'
                              }`} 
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base">{investment.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-gray-600 font-mono">{investment.symbol}</p>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <p className="text-xs text-gray-500">
                                Avg: ₹{avgPrice.toFixed(2)} | Current: ₹{currentPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4 text-right">
                        <div className="text-gray-900 font-semibold text-lg">
                          ₹{investment.investedAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          @ ₹{avgPrice.toFixed(2)}/unit
                        </div>
                      </td>
                      
                      <td className="py-5 px-4 text-right">
                        <div className="text-gray-900 font-semibold text-lg">
                          ₹{investment.currentValue.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          @ ₹{currentPrice.toFixed(2)}/unit
                        </div>
                      </td>
                      
                      <td className="py-5 px-4 text-right">
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`font-bold text-lg flex items-center ${
                            returns.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <ApperIcon 
                              name={returns.amount >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                              className="w-4 h-4 mr-1" 
                            />
                            {returns.amount >= 0 ? '+' : ''}₹{Math.abs(returns.amount).toLocaleString('en-IN')}
                          </div>
                          <Badge 
                            variant={getReturnsBadgeVariant(returns.percentage)} 
                            className={`font-semibold px-3 py-1 ${
                              returns.percentage >= 0 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {returns.percentage >= 0 ? '+' : ''}{returns.percentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4 text-center">
                        <Badge 
                          variant={investment.type === 'stock' ? 'info' : 'primary'}
                          className="font-medium px-3 py-1"
                        >
                          {investment.type === 'stock' ? 'Equity' : 'Mutual Fund'}
                        </Badge>
                      </td>

                      <td className="py-5 px-4 text-center">
                        <div className="text-gray-900 font-semibold">
                          {investment.units.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          units
                        </div>
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