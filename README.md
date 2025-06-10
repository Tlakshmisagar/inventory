# Inventory Management System

A modern full-stack inventory management application built with React, Express, and TypeScript. Designed for small warehouses to efficiently manage products and track inventory movements.

## Live Deployment

The application is currently deployed at:  
🔗 [https://inventory-sj6r.onrender.com](https://inventory-sj6r.onrender.com)

## 📋 Features

### Core Functionality
- **Product Management**: Add, edit, and delete products with SKU tracking
- **Stock Control**: Real-time stock level monitoring with low stock alerts
- **Transaction History**: Complete audit trail of all inventory movements
- **Dashboard Analytics**: Visual overview of inventory statistics
- **Category Filtering**: Organize products by categories
- **Search Functionality**: Quick product and transaction search

### Authentication
- Simple login system with demo credentials
- Session persistence across browser refreshes
- Protected routes for authenticated users

### User Interface
- Clean, responsive design optimized for desktop and mobile
- Real-time updates across all pages
- Intuitive navigation with sidebar menu
- Loading states and error handling
- Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing
- **Zustand** - State management
- **React Hook Form** - Form handling with validation

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe server development
- **Zod** - Runtime type validation
- **In-Memory Storage** - Fast development and testing

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - Lightning-fast bundling
- **TSX** - TypeScript execution environment

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Login with username: `admin` and password: `password`


## 📱 Usage Guide

### Getting Started
1. **Login**: Use the demo credentials (admin/password)
2. **Dashboard**: View your inventory overview and recent activity
3. **Products**: Manage your product catalog
4. **Transactions**: Track all inventory movements

### Managing Products
- **Add Product**: Click "Add Product" and fill in the details
- **Edit Product**: Use the actions menu on any product row
- **Adjust Stock**: Quick stock adjustments through the actions menu
- **Delete Product**: Remove products no longer needed

### Recording Transactions
- **Stock In**: Add inventory when receiving shipments
- **Stock Out**: Remove inventory for sales or consumption
- **Automatic Updates**: Product stock levels update automatically

### Using Filters
- **Search**: Find products or transactions by name, SKU, or description
- **Category Filter**: Filter products by category
- **Transaction Type**: Filter transactions by IN/OUT type

## 🏗️ Project Structure

```
inventory-management-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API client
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # In-memory data storage
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared TypeScript definitions
│   └── schema.ts           # Database schema and types
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

## 📊 Sample Data

The application comes pre-loaded with sample data:

### Products
- Wireless Headphones (Electronics) - 145 units
- Office Chair (Furniture) - 8 units  
- Gaming Keyboard (Electronics) - 0 units

### Transactions
- Recent stock movements for demonstration
- Both IN and OUT transaction examples

## 🔒 Security Notes

⚠️ **Important**: This is a demo application with hardcoded credentials
- Username: `admin`
- Password: `password`
- Data is stored in memory and resets on server restart
- Not suitable for production use without proper authentication

---

**Note**: This application uses in-memory storage for simplicity. All data will be lost when the server restarts. For persistent storage, integrate with a proper database system.