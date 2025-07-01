import mockInvoices from '@/services/mockData/invoices.json';

// Create a mutable copy of the mock data
let invoicesData = [...mockInvoices];
let nextId = Math.max(...invoicesData.map(invoice => invoice.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const invoiceService = {
  async getAll() {
    await delay(300);
    return [...invoicesData];
  },

  async getById(id) {
    await delay(200);
    const invoice = invoicesData.find(invoice => invoice.Id === parseInt(id));
    return invoice ? { ...invoice } : null;
  },

  async create(invoiceData) {
    await delay(400);
    const newInvoice = {
      Id: nextId++,
      ...invoiceData,
      uploadDate: invoiceData.uploadDate || new Date().toISOString(),
      status: invoiceData.status || 'processing'
    };
    
    invoicesData.push(newInvoice);
    return { ...newInvoice };
  },

  async update(id, updates) {
    await delay(300);
    const index = invoicesData.findIndex(invoice => invoice.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    invoicesData[index] = { ...invoicesData[index], ...updates };
    return { ...invoicesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = invoicesData.findIndex(invoice => invoice.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    const deletedInvoice = invoicesData[index];
    invoicesData.splice(index, 1);
    return { ...deletedInvoice };
  },

  async bulkUpload(files) {
    await delay(500);
    const uploadedInvoices = [];
    
    for (const file of files) {
      const newInvoice = await this.create({
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      });
      uploadedInvoices.push(newInvoice);
    }
    
    return uploadedInvoices;
  }
};

export default invoiceService;