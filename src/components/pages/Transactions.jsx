import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import TransactionCard from '@/components/molecules/TransactionCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { transactionService } from '@/services/api/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, filterType, sortBy]);

  const handleEdit = (transaction) => {
    // Mock edit functionality
    toast.info('Edit functionality coming soon!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      toast.success('Transaction deleted successfully');
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon!');
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
        />

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="Download"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        {(searchQuery || filterType !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          description={searchQuery || filterType !== 'all' 
            ? "Try adjusting your search or filters" 
            : "Start tracking your finances by adding your first transaction"
          }
          actionLabel="Add Transaction"
          icon="Receipt"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>

          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.Id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Transactions;