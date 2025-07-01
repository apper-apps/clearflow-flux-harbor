import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#4f46e5",
  backgroundColor = "#e5e7eb",
  showMilestones = false,
  milestones = [25, 50, 75, 100],
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate milestone positions
  const getMilestonePosition = (milestone) => {
    const angle = (milestone / 100) * 360 - 90; // Start from top
    const radians = (angle * Math.PI) / 180;
    const x = (size / 2) + (radius * Math.cos(radians));
    const y = (size / 2) + (radius * Math.sin(radians));
    return { x, y };
  };
return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Milestone markers */}
        {showMilestones && milestones.map((milestone, index) => {
          const position = getMilestonePosition(milestone);
          const isAchieved = percentage >= milestone;
          
          return (
            <motion.g key={milestone}>
              {/* Milestone dot */}
              <motion.circle
                cx={position.x}
                cy={position.y}
                r={4}
                fill={isAchieved ? color : backgroundColor}
                stroke={isAchieved ? "white" : color}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.8 + (index * 0.1), 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }}
              />
              
              {/* Achievement pulse animation */}
              {isAchieved && (
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r={4}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  opacity={0.6}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: [1, 1.8, 1], 
                    opacity: [0.6, 0, 0.6] 
                  }}
                  transition={{ 
                    delay: 1.2 + (index * 0.1),
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              )}
            </motion.g>
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;