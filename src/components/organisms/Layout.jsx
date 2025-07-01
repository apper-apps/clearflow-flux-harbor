import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import QuickAddButton from '@/components/molecules/QuickAddButton';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Transactions', href: '/transactions', icon: 'Receipt' },
    { name: 'Subscriptions', href: '/subscriptions', icon: 'Calendar' },
    { name: 'Reports', href: '/reports', icon: 'BarChart3' },
    { name: 'Goals', href: '/goals', icon: 'Target' },
    { name: 'Investments', href: '/investments', icon: 'TrendingUp' },
  ];

  const getPageTitle = () => {
    const currentPage = navigation.find(nav => nav.href === location.pathname);
    return currentPage ? currentPage.name : 'ClearFlow';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-display font-bold gradient-text">
              ClearFlow
            </h1>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <h1 className="text-2xl font-display font-bold gradient-text">
                ClearFlow
              </h1>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 flex-shrink-0 h-5 w-5"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="text-xl font-display font-bold gradient-text">
                      ClearFlow
                    </h1>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <nav className="flex-1 px-4 py-4 space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <ApperIcon
                          name={item.icon}
                          className="mr-3 flex-shrink-0 h-5 w-5"
                        />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-display font-bold text-gray-900">
                    {getPageTitle()}
                  </h1>
                </div>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      <QuickAddButton />
    </div>
  );
};

export default Layout;