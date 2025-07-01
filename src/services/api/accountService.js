import mockAccounts from '@/services/mockData/accounts.json';

let accounts = [...mockAccounts];
let nextId = Math.max(...accounts.map(a => a.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const accountService = {
  async getAll() {
    await delay(300);
    return [...accounts];
  },

  async getById(id) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid account ID');
    }
    const account = accounts.find(a => a.Id === parsedId);
    if (!account) {
      throw new Error('Account not found');
    }
    return { ...account };
  },

  async create(accountData) {
    await delay(300);
    const newAccount = {
      ...accountData,
      Id: nextId++,
      isActive: true
    };
    accounts.push(newAccount);
    return { ...newAccount };
  },

  async update(id, updates) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid account ID');
    }
    
    const index = accounts.findIndex(a => a.Id === parsedId);
    if (index === -1) {
      throw new Error('Account not found');
    }

    const updatedAccount = {
      ...accounts[index],
      ...updates,
      Id: parsedId // Prevent ID from being changed
    };
    accounts[index] = updatedAccount;
    return { ...updatedAccount };
  },

  async delete(id) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error('Invalid account ID');
    }
    
    const index = accounts.findIndex(a => a.Id === parsedId);
    if (index === -1) {
      throw new Error('Account not found');
    }

    const deletedAccount = accounts[index];
    accounts.splice(index, 1);
    return { ...deletedAccount };
  },

  async transfer({ fromAccountId, toAccountId, amount, description = '' }) {
    await delay(500); // Longer delay for transfer operations
    
    const parsedFromId = parseInt(fromAccountId);
    const parsedToId = parseInt(toAccountId);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedFromId) || isNaN(parsedToId) || isNaN(parsedAmount)) {
      throw new Error('Invalid transfer parameters');
    }

    if (parsedAmount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    if (parsedFromId === parsedToId) {
      throw new Error('Cannot transfer to the same account');
    }

    const fromAccount = accounts.find(a => a.Id === parsedFromId);
    const toAccount = accounts.find(a => a.Id === parsedToId);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    if (fromAccount.accountType !== 'Credit' && fromAccount.balance < parsedAmount) {
      throw new Error('Insufficient funds');
    }

    // Update balances
    fromAccount.balance -= parsedAmount;
    toAccount.balance += parsedAmount;

    return {
      success: true,
      fromAccount: { ...fromAccount },
      toAccount: { ...toAccount },
      amount: parsedAmount,
      description,
      timestamp: new Date().toISOString()
    };
  },

  async getActiveAccounts() {
    await delay(300);
    return accounts.filter(a => a.isActive).map(a => ({ ...a }));
  }
};

export default accountService;