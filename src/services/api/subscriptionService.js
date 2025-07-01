import { subscriptions } from '@/services/mockData/subscriptions.json';

class SubscriptionService {
  constructor() {
    this.data = [...subscriptions];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const subscription = this.data.find(s => s.Id === parseInt(id));
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return { ...subscription };
  }

  async create(subscriptionData) {
    await this.delay();
    const newId = Math.max(...this.data.map(s => s.Id), 0) + 1;
    const newSubscription = {
      Id: newId,
      ...subscriptionData
    };
    this.data.push(newSubscription);
    return { ...newSubscription };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.data.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Subscription not found');
    }
    this.data[index] = { ...this.data[index], ...updateData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Subscription not found');
    }
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const subscriptionService = new SubscriptionService();