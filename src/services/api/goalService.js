import { goals } from '@/services/mockData/goals.json';

class GoalService {
  constructor() {
    this.data = [...goals];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const goal = this.data.find(g => g.Id === parseInt(id));
    if (!goal) {
      throw new Error('Goal not found');
    }
    return { ...goal };
  }

  async create(goalData) {
    await this.delay();
    const newId = Math.max(...this.data.map(g => g.Id), 0) + 1;
    const newGoal = {
      Id: newId,
      ...goalData
    };
    this.data.push(newGoal);
    return { ...newGoal };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.data.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    this.data[index] = { ...this.data[index], ...updateData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

// Calculate milestone achievements for a goal
  calculateMilestones(goal) {
    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const milestones = [
      { threshold: 25, label: "Started", achieved: percentage >= 25 },
      { threshold: 50, label: "Halfway", achieved: percentage >= 50 },
      { threshold: 75, label: "Almost There", achieved: percentage >= 75 },
      { threshold: 100, label: "Achieved", achieved: percentage >= 100 }
    ];
    
    return {
      percentage,
      milestones,
      achievedCount: milestones.filter(m => m.achieved).length,
      nextMilestone: milestones.find(m => !m.achieved)
    };
  }

  // Get milestone status for all goals
  getMilestoneStatus() {
    return this.data.map(goal => ({
      ...goal,
      milestoneData: this.calculateMilestones(goal)
    }));
  }

  // Add contribution to a goal
  async addContribution(id, amount) {
    await this.delay();
    const index = this.data.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    
    const goal = this.data[index];
    const newAmount = goal.currentAmount + amount;
    const wasCompleted = goal.currentAmount >= goal.targetAmount;
    const isNowCompleted = newAmount >= goal.targetAmount;
    
    this.data[index] = { 
      ...goal, 
      currentAmount: Math.min(newAmount, goal.targetAmount)
    };
    
    return {
      goal: { ...this.data[index] },
      milestoneAchieved: !wasCompleted && isNowCompleted,
      newMilestones: this.calculateMilestones(this.data[index])
    };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const goalService = new GoalService();