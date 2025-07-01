import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import accountService from '@/services/api/accountService';

const BankAccountSwitcher = ({ onAccountChange, className = '' }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferForm, setTransferForm] = useState({
    toAccountId: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountService.getActiveAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0]);
        onAccountChange?.(data[0]);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (option) => {
    const account = accounts.find(a => a.Id === option.value);
    setSelectedAccount(account);
    onAccountChange?.(account);
    toast.success(`Switched to ${account.accountName}`);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!transferForm.toAccountId || !transferForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(transferForm.amount) <= 0) {
      toast.error('Transfer amount must be positive');
      return;
    }

    if (selectedAccount.Id === parseInt(transferForm.toAccountId)) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    try {
      setTransferLoading(true);
      
      const result = await accountService.transfer({
        fromAccountId: selectedAccount.Id,
        toAccountId: transferForm.toAccountId,
        amount: transferForm.amount,
        description: transferForm.description
      });

      // Update local state with new balances
      setAccounts(prev => prev.map(account => {
        if (account.Id === result.fromAccount.Id) {
          return result.fromAccount;
        }
        if (account.Id === result.toAccount.Id) {
          return result.toAccount;
        }
        return account;
      }));

      // Update selected account if it was the source account
      if (selectedAccount.Id === result.fromAccount.Id) {
        setSelectedAccount(result.fromAccount);
        onAccountChange?.(result.fromAccount);
      }

      toast.success(`Transfer of $${result.amount.toFixed(2)} completed successfully`);
      setShowTransferModal(false);
      setTransferForm({ toAccountId: '', amount: '', description: '' });
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const formatBalance = (balance) => {
    const isNegative = balance < 0;
    const formattedBalance = Math.abs(balance).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return isNegative ? `-${formattedBalance}` : formattedBalance;
  };

  const getBalanceColor = (balance, accountType) => {
    if (accountType === 'Credit') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const accountOptions = accounts.map(account => ({
    value: account.Id,
    label: (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{account.accountName}</span>
          <span className="text-sm text-gray-500">{account.accountNumber}</span>
        </div>
        <div className="text-right">
          <span className={`font-semibold ${getBalanceColor(account.balance, account.accountType)}`}>
            {formatBalance(account.balance)}
          </span>
        </div>
      </div>
    )
  }));

  const transferOptions = accounts
    .filter(account => account.Id !== selectedAccount?.Id)
    .map(account => ({
      value: account.Id,
      label: `${account.accountName} (${account.accountNumber})`
    }));

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAccounts} />;
  if (accounts.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <ApperIcon name="CreditCard" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Accounts</h3>
          <p className="text-gray-500">Add a bank account to get started</p>
        </div>
      </Card>
    );
  }

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#d1d5db'
      }
    }),
    option: (provided) => ({
      ...provided,
      padding: '12px 16px'
    }),
    singleValue: (provided) => ({
      ...provided,
      width: '100%'
    })
  };

  return (
    <>
      <Card className={`p-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Wallet" size={20} />
              Account Switcher
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTransferModal(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <ApperIcon name="ArrowRightLeft" size={16} />
              Quick Transfer
            </Button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Account
            </label>
            <Select
              options={accountOptions}
              value={accountOptions.find(option => option.value === selectedAccount?.Id)}
              onChange={handleAccountChange}
              styles={customSelectStyles}
              isSearchable={false}
              placeholder="Choose an account..."
            />
          </div>

          {selectedAccount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(selectedAccount.balance, selectedAccount.accountType)}`}>
                    {formatBalance(selectedAccount.balance)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedAccount.bankName} • {selectedAccount.accountType}
                  </p>
                </div>
                <div className="text-right">
                  <ApperIcon 
                    name="CreditCard" 
                    size={32} 
                    className="text-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Quick Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="ArrowRightLeft" size={20} />
                  Quick Transfer
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedAccount?.accountName}</p>
                    <p className="text-sm text-gray-500">{selectedAccount?.accountNumber}</p>
                    <p className={`text-sm font-semibold ${getBalanceColor(selectedAccount?.balance, selectedAccount?.accountType)}`}>
                      Balance: {formatBalance(selectedAccount?.balance || 0)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Account *
                  </label>
                  <Select
                    options={transferOptions}
                    value={transferOptions.find(option => option.value === parseInt(transferForm.toAccountId))}
                    onChange={(option) => setTransferForm(prev => ({ ...prev, toAccountId: option.value }))}
                    styles={customSelectStyles}
                    placeholder="Select destination account..."
                    isSearchable={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Transfer description..."
                    value={transferForm.description}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowTransferModal(false)}
                    disabled={transferLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={transferLoading || !transferForm.toAccountId || !transferForm.amount}
                    className="flex-1"
                  >
                    {transferLoading ? (
                      <>
                        <ApperIcon name="Loader" size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" size={16} />
                        Transfer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BankAccountSwitcher;