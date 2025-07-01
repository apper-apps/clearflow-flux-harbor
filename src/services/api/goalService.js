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

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const goalService = new GoalService();