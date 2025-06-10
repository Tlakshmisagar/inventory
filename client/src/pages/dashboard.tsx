import { useQuery } from "@tanstack/react-query";
import { Package, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import type { TransactionWithProduct } from "@shared/schema";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: api.getStats,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
    queryFn: api.getTransactions,
  });

  const recentTransactions = transactions?.slice(0, 5) || [];

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffMs = now.getTime() - transactionDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Less than an hour ago";
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  return (
    <div className="ml-64 flex-1">
      <Header 
        title="Dashboard" 
        subtitle="Overview of your inventory" 
      />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-primary text-xl" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Products</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats?.totalProducts || 0}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowUp className="text-green-600 text-xl" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Stock In</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats?.totalStockIn || 0}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowDown className="text-red-600 text-xl" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Stock Out</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats?.totalStockOut || 0}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-yellow-600 text-xl" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Low Stock</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-800">
                      {stats?.lowStockCount || 0}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <CardContent className="p-6">
            {transactionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <Skeleton className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent transactions</p>
            ) : (
              <div className="space-y-0">
                {recentTransactions.map((transaction: TransactionWithProduct, index) => (
                  <div 
                    key={transaction.id} 
                    className={`flex items-center justify-between py-3 ${
                      index < recentTransactions.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'IN' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'IN' ? (
                          <ArrowUp className={`text-green-600 text-sm`} size={16} />
                        ) : (
                          <ArrowDown className={`text-red-600 text-sm`} size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {transaction.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.type === 'IN' ? 'Added' : 'Removed'} {transaction.quantity} units • {transaction.product.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {formatTimeAgo(transaction.timestamp.toString())}
                      </p>
                      <p className="text-xs text-gray-500">by Admin</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
