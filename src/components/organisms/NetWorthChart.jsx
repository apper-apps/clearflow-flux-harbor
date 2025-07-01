import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';

const NetWorthChart = ({ investments = [] }) => {
  const [viewMode, setViewMode] = useState('trend'); // 'trend' or 'allocation'

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  }, [investments]);

  // Calculate total invested amount
  const totalInvested = useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  }, [investments]);

  // Calculate portfolio performance
  const portfolioGain = totalValue - totalInvested;
  const portfolioGainPercent = totalInvested > 0 ? ((portfolioGain / totalInvested) * 100) : 0;

  // Generate historical trend data (mock data based on current values)
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValue = totalInvested;
    
    return months.map((month, index) => {
      // Simulate growth over time
      const growthFactor = 1 + (index * 0.02) + (Math.random() * 0.01 - 0.005);
      return {
        x: month,
        y: Math.round(baseValue * growthFactor)
      };
    });
  }, [totalInvested]);

  // Calculate asset allocation by type
  const allocationData = useMemo(() => {
    const typeGroups = investments.reduce((acc, inv) => {
      const type = inv.type === 'stock' ? 'Stocks' : 'Mutual Funds';
      acc[type] = (acc[type] || 0) + inv.currentValue;
      return acc;
    }, {});

    return Object.entries(typeGroups).map(([type, value]) => ({
      label: type,
      value: Math.round((value / totalValue) * 100)
    }));
  }, [investments, totalValue]);

  // Chart configurations
  const trendChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      show: true,
      borderColor: '#F3F4F6',
      strokeDashArray: 3
    },
    xaxis: {
      categories: trendData.map(d => d.x),
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' },
        formatter: (value) => `₹${(value / 1000).toFixed(0)}K`
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value) => `₹${value.toLocaleString()}`
      }
    }
  };

  const allocationChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    labels: allocationData.map(d => d.label),
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Value',
              formatter: () => `₹${(totalValue / 1000).toFixed(0)}K`
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Net Worth Overview
        </h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <ApperIcon name="TrendingUp" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No investment data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Net Worth Overview
        </h3>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'trend'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trend
          </button>
          <button
            onClick={() => setViewMode('allocation')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'allocation'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Allocation
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Value</p>
          <p className="text-xl font-semibold text-gray-900">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
          <p className={`text-xl font-semibold flex items-center justify-center ${
            portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <ApperIcon 
              name={portfolioGain >= 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className="mr-1" 
            />
            {portfolioGain >= 0 ? '+' : ''}₹{portfolioGain.toLocaleString()}
            <span className="text-sm ml-1">
              ({portfolioGainPercent >= 0 ? '+' : ''}{portfolioGainPercent.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {viewMode === 'trend' ? (
          <Chart
            options={trendChartOptions}
            series={[{
              name: 'Portfolio Value',
              data: trendData.map(d => d.y)
            }]}
            type="area"
            height={300}
          />
        ) : (
          <Chart
            options={allocationChartOptions}
            series={allocationData.map(d => d.value)}
            type="donut"
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default NetWorthChart;