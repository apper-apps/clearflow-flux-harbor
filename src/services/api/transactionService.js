import { transactions } from '@/services/mockData/transactions.json';

class TransactionService {
  constructor() {
    this.data = [...transactions];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const transaction = this.data.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await this.delay();
    const newId = Math.max(...this.data.map(t => t.Id), 0) + 1;
    const newTransaction = {
      Id: newId,
      ...transactionData,
      date: transactionData.date || new Date().toISOString().split('T')[0]
    };
    this.data.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.data.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    this.data[index] = { ...this.data[index], ...updateData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const transactionService = new TransactionService();