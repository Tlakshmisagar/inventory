import { 
  users, 
  products, 
  transactions,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Transaction,
  type InsertTransaction,
  type TransactionWithProduct
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Transaction methods
  getTransactions(): Promise<TransactionWithProduct[]>;
  getTransactionsByProduct(productId: number): Promise<TransactionWithProduct[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Stats methods
  getStats(): Promise<{
    totalProducts: number;
    totalStockIn: number;
    totalStockOut: number;
    lowStockCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentProductId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentTransactionId = 1;

    // Initialize with default admin user
    this.createUser({ username: "admin", password: "password" });
    
    // Initialize with some sample products
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Add sample products
    await this.createProduct({
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      currentStock: 145
    });

    await this.createProduct({
      name: "Office Chair",
      sku: "OC-002", 
      category: "Furniture",
      currentStock: 8
    });

    await this.createProduct({
      name: "Gaming Keyboard",
      sku: "GK-003",
      category: "Electronics", 
      currentStock: 0
    });

    // Add sample transactions
    const now = new Date();
    const product1 = Array.from(this.products.values()).find(p => p.sku === "WH-001");
    const product2 = Array.from(this.products.values()).find(p => p.sku === "OC-002");
    const product3 = Array.from(this.products.values()).find(p => p.sku === "GK-003");

    if (product1) {
      await this.createTransaction({
        productId: product1.id,
        type: "IN",
        quantity: 50
      });
    }

    if (product2) {
      await this.createTransaction({
        productId: product2.id,
        type: "OUT",
        quantity: 5
      });
    }

    if (product3) {
      await this.createTransaction({
        productId: product3.id,
        type: "IN",  
        quantity: 25
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.sku === sku);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Transaction methods
  async getTransactions(): Promise<TransactionWithProduct[]> {
    const transactionList = Array.from(this.transactions.values());
    const result: TransactionWithProduct[] = [];

    for (const transaction of transactionList) {
      const product = this.products.get(transaction.productId);
      if (product) {
        result.push({ ...transaction, product });
      }
    }

    return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTransactionsByProduct(productId: number): Promise<TransactionWithProduct[]> {
    const allTransactions = await this.getTransactions();
    return allTransactions.filter(t => t.productId === productId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      timestamp: new Date()
    };

    this.transactions.set(id, transaction);

    // Update product stock
    const product = this.products.get(insertTransaction.productId);
    if (product) {
      const stockChange = insertTransaction.type === 'IN' 
        ? insertTransaction.quantity 
        : -insertTransaction.quantity;
      
      await this.updateProduct(product.id, {
        currentStock: Math.max(0, product.currentStock + stockChange)
      });
    }

    return transaction;
  }

  // Stats methods
  async getStats(): Promise<{
    totalProducts: number;
    totalStockIn: number;
    totalStockOut: number;
    lowStockCount: number;
  }> {
    const products = await this.getProducts();
    const transactions = Array.from(this.transactions.values());

    const totalStockIn = transactions
      .filter(t => t.type === 'IN')
      .reduce((sum, t) => sum + t.quantity, 0);

    const totalStockOut = transactions
      .filter(t => t.type === 'OUT')
      .reduce((sum, t) => sum + t.quantity, 0);

    const lowStockCount = products.filter(p => p.currentStock <= 10).length;

    return {
      totalProducts: products.length,
      totalStockIn,
      totalStockOut,
      lowStockCount
    };
  }
}

export const storage = new MemStorage();
