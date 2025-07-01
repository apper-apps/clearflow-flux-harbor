import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const CategoryPill = ({ category, className = "" }) => {
  const getCategoryColor = (categoryName) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Salary': 'bg-emerald-100 text-emerald-800',
      'Business': 'bg-indigo-100 text-indigo-800',
      'Investment': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[categoryName] || colors['Other'];
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Food': 'UtensilsCrossed',
      'Transport': 'Car',
      'Entertainment': 'Gamepad2',
      'Shopping': 'ShoppingBag',
      'Bills': 'Receipt',
      'Healthcare': 'Heart',
      'Salary': 'Banknote',
      'Business': 'Briefcase',
      'Investment': 'TrendingUp',
      'Other': 'Tag'
    };
    return icons[categoryName] || icons['Other'];
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)} ${className}`}>
      <ApperIcon name={getCategoryIcon(category)} className="w-3 h-3 mr-1" />
      {category}
    </span>
  );
};

export default CategoryPill;