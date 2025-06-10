import { apiRequest } from "./queryClient";
import type { 
  LoginRequest, 
  InsertProduct, 
  InsertTransaction, 
  Product 
} from "@shared/schema";

export const api = {
  // Auth
  login: async (credentials: LoginRequest) => {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await apiRequest("GET", "/api/products");
    return response.json();
  },

  getProduct: async (id: number) => {
    const response = await apiRequest("GET", `/api/products/${id}`);
    return response.json();
  },

  createProduct: async (product: InsertProduct) => {
    const response = await apiRequest("POST", "/api/products", product);
    return response.json();
  },

  updateProduct: async (id: number, updates: Partial<Product>) => {
    const response = await apiRequest("PATCH", `/api/products/${id}`, updates);
    return response.json();
  },

  deleteProduct: async (id: number) => {
    const response = await apiRequest("DELETE", `/api/products/${id}`);
    return response.json();
  },

  // Transactions
  getTransactions: async () => {
    const response = await apiRequest("GET", "/api/transactions");
    return response.json();
  },

  getProductTransactions: async (productId: number) => {
    const response = await apiRequest("GET", `/api/transactions/product/${productId}`);
    return response.json();
  },

  createTransaction: async (transaction: InsertTransaction) => {
    const response = await apiRequest("POST", "/api/transactions", transaction);
    return response.json();
  },

  // Stats
  getStats: async () => {
    const response = await apiRequest("GET", "/api/stats");
    return response.json();
  },
};
