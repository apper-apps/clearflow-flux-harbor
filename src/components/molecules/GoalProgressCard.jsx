import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/molecules/ProgressRing';

const GoalProgressCard = ({ 
  goal, 
  index, 
  onContribute, 
  onDelete,
  getProgressPercentage,
  getProgressColor 
}) => {
  const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
  const progressColor = getProgressColor(progressPercentage);
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  
  // Calculate milestones
  const milestones = [
    { percentage: 25, label: "Started", variant: "info" },
    { percentage: 50, label: "Halfway", variant: "warning" },
    { percentage: 75, label: "Almost There", variant: "primary" },
    { percentage: 100, label: "Achieved", variant: "success" }
  ];
  
  const achievedMilestones = milestones.filter(m => progressPercentage >= m.percentage);
  const nextMilestone = milestones.find(m => progressPercentage < m.percentage);
  
  // Determine milestone status for badges
  const getMilestoneBadges = () => {
    if (progressPercentage >= 100) {
      return [{ label: "Goal Achieved", variant: "success" }];
    } else if (progressPercentage >= 75) {
      return [{ label: "Almost There", variant: "primary" }];
    } else if (progressPercentage >= 50) {
      return [{ label: "Halfway Point", variant: "warning" }];
    } else if (progressPercentage >= 25) {
      return [{ label: "Good Start", variant: "info" }];
    }
    return [];
  };

  const milestoneBadges = getMilestoneBadges();

  return (
    <motion.div
      key={goal.Id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden">
        {/* Milestone badges */}
        {milestoneBadges.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <div className="flex flex-wrap gap-1">
              {milestoneBadges.map((badge, badgeIndex) => (
                <motion.div
                  key={badge.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.5 + (badgeIndex * 0.1),
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Achievement celebration overlay */}
        {progressPercentage >= 100 && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.8,
                type: "spring",
                stiffness: 200
              }}
              className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <ApperIcon name="Trophy" className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 pr-4">
            <h4 className="text-lg font-display font-semibold text-gray-900">
              {goal.name}
            </h4>
            <p className="text-sm text-gray-600">{goal.category}</p>
            <p className="text-xs text-gray-500 mt-1">
              Due: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
            </p>
            
            {/* Next milestone indicator */}
            {nextMilestone && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-2"
              >
                <p className="text-xs text-accent-600 font-medium">
                  Next: {nextMilestone.label} at {nextMilestone.percentage}%
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                  <motion.div
                    className="bg-accent-500 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(((progressPercentage % 25) / 25) * 100, 100)}%` 
                    }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onContribute(goal.Id, 1000)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Add contribution"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(goal.Id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <ProgressRing
            percentage={progressPercentage}
            color={progressColor}
            size={140}
            strokeWidth={10}
            showMilestones={true}
            milestones={[25, 50, 75, 100]}
          >
            <div className="text-center">
              <motion.p 
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                {progressPercentage.toFixed(0)}%
              </motion.p>
              <p className="text-xs text-gray-600">Complete</p>
              
              {/* Milestone count */}
              <motion.p 
                className="text-xs text-accent-600 font-medium mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {achievedMilestones.length}/4 milestones
              </motion.p>
            </div>
          </ProgressRing>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current</span>
            <span className="font-semibold text-gray-900">
              ₹{goal.currentAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Target</span>
            <span className="font-semibold text-gray-900">
              ₹{goal.targetAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="font-semibold text-primary-600">
              ₹{Math.max(0, remainingAmount).toLocaleString()}
            </span>
          </div>

          {/* Milestone progress indicator */}
          <motion.div 
            className="pt-2 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Milestones</span>
              <div className="flex space-x-1">
                {milestones.map((milestone, mIndex) => (
                  <motion.div
                    key={milestone.percentage}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 1.2 + (mIndex * 0.05),
                      type: "spring",
                      stiffness: 400
                    }}
                    className={`w-2 h-2 rounded-full ${
                      progressPercentage >= milestone.percentage
                        ? 'bg-gradient-to-r from-accent-400 to-accent-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalProgressCard;