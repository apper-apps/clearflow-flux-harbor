import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = `bg-white rounded-xl shadow-sm border border-gray-100 ${padding}`;
  
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, shadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        className={`${baseClasses} cursor-pointer transition-shadow duration-200 ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;