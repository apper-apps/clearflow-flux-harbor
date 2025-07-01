import { investments } from '@/services/mockData/investments.json';

class InvestmentService {
  constructor() {
    this.data = [...investments];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const investment = this.data.find(i => i.Id === parseInt(id));
    if (!investment) {
      throw new Error('Investment not found');
    }
    return { ...investment };
  }

  async create(investmentData) {
    await this.delay();
    const newId = Math.max(...this.data.map(i => i.Id), 0) + 1;
    const newInvestment = {
      Id: newId,
      ...investmentData
    };
    this.data.push(newInvestment);
    return { ...newInvestment };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.data.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Investment not found');
    }
    this.data[index] = { ...this.data[index], ...updateData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Investment not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const investmentService = new InvestmentService();