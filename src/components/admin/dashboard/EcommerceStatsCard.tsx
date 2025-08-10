import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EcommerceStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
}

interface EcommerceStatsCardProps {
  stats: EcommerceStats;
}

const EcommerceStatsCard: React.FC<EcommerceStatsCardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* E-commerce Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Badge variant="secondary">{stats.recentOrders.length} orders</Badge>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">Order #{order.id.substring(0, 8)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">₹{order.total}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EcommerceStatsCard;