import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { transactionService } from '@/services/api/transactionService';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const getChartData = () => {
    const months = selectedPeriod === '6months' ? 6 : 12;
    const startDate = startOfMonth(subMonths(new Date(), months - 1));
    const endDate = endOfMonth(new Date());
    
    const monthlyData = eachMonthOfInterval({ start: startDate, end: endDate }).map(month => {
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfMonth(month) && transactionDate <= endOfMonth(month);
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        income,
        expenses,
        net: income - expenses
      };
    });

    return monthlyData;
  };

  const getCategoryData = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    expenseTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);
  };

  const handleExport = (type) => {
    toast.info(`${type} export functionality coming soon!`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  const chartData = getChartData();
  const categoryData = getCategoryData();

  const lineChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#10b981', '#ef4444', '#4f46e5'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    xaxis: {
      categories: chartData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${(value / 1000).toFixed(0)}k`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString()}`
      }
    }
  };

  const lineChartSeries = [
    {
      name: 'Income',
      data: chartData.map(d => d.income)
    },
    {
      name: 'Expenses', 
      data: chartData.map(d => d.expenses)
    },
    {
      name: 'Net',
      data: chartData.map(d => d.net)
    }
  ];

  const pieChartOptions = {
    chart: {
      type: 'donut'
    },
    labels: categoryData.map(([category]) => category),
    colors: ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    }
  };

  const pieChartSeries = categoryData.map(([, amount]) => amount);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-800">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingDown" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-r ${netIncome >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'} mb-1`}>
                Net Income
              </p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                ₹{netIncome.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 ${netIncome >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-xl flex items-center justify-center`}>
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="6months">Last 6 months</option>
            <option value="12months">Last 12 months</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="Download"
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            icon="FileText"
            onClick={() => handleExport('PDF')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Income vs Expenses Trend
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Monthly financial overview
            </p>
          </div>
          
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300}
          />
        </Card>

        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Expense Categories
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Where your money goes
            </p>
          </div>
          
          {categoryData.length > 0 ? (
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No expense data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Reports;