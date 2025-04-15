'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, Droplet, Package, 
  ShoppingCart, ArrowDown, ArrowUp, Activity, 
  MoreHorizontal, Download, FileText, Truck, Users
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Chart Components
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie, CartesianGrid } from 'recharts';

// Simple Select Component (placeholder for a real select component)
function Select({ 
  options, 
  defaultValue, 
  className 
}: { 
  options: Array<{value: string, label: string}>, 
  defaultValue: string, 
  className?: string 
}) {
    return (
    <select className={`border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-gray-900">
              {/* Page Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {session.user.name}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Today's Milk Collection */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Collection</CardTitle>
                    <Droplet className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">1,250 L</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">from 45 farmers</p>
                      </div>
                      <div className="flex items-center text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Production Summary */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Production</CardTitle>
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">28 Batches</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 products</p>
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Summary */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Sales</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">₹32,450</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">18 transactions</p>
                      </div>
              <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

        {/* Inventory Value */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Inventory Value</CardTitle>
            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">₹185,320</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">32 products</p>
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-medium">
                <ArrowDown size={14} />
                <span>3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Milk Collection Chart */}
                <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-800 dark:text-white">Daily Milk Collection</CardTitle>
                      <Select
                        className="text-xs"
                        defaultValue="week"
                        options={[
                          { value: 'week', label: 'Last 7 Days' },
                          { value: 'month', label: 'Last 30 Days' },
                        ]}
                      />
                    </div>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Milk collected in liters over the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[300px] w-full bg-teal-50 dark:bg-teal-900/20 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for actual chart */}
                      Daily Collection Chart
                    </div>
                  </CardContent>
                </Card>

                {/* Top Selling Products */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <div>
                    <CardTitle className="text-gray-800 dark:text-white">Top Selling Products</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                  Based on weekly sales volume
                    </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
            <div className="space-y-1">
              {[
                { name: 'Full Cream Milk 1L', sales: '450 units', revenue: '₹18,000', trend: 'up' },
                { name: 'Butter 500g', sales: '320 units', revenue: '₹19,200', trend: 'up' },
                { name: 'Yogurt 400g', sales: '280 units', revenue: '₹11,200', trend: 'down' },
                { name: 'Cheese 200g', sales: '240 units', revenue: '₹14,400', trend: 'up' },
                { name: 'Flavored Milk 200ml', sales: '210 units', revenue: '₹6,300', trend: 'down' },
                      ].map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{product.sales}</span>
                              <span>•</span>
                              <span>{product.revenue}</span>
                            </div>
                          </div>
                          <div>
                            {product.trend === 'up' ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-400">
                                <ArrowUp size={12} className="mr-1" />
                                Up
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-400">
                                <ArrowDown size={12} className="mr-1" />
                                Down
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Transfers */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Today's Transfers</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Movement between branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {[
                        { from: 'Central Warehouse', to: 'Branch #5', items: '250L Milk, 100kg Cheese', status: 'In Transit' },
                        { from: 'Branch #3', to: 'Branch #2', items: '50kg Yogurt, 25kg Butter', status: 'Delivered' },
                      ].map((transfer, i) => (
                        <div key={i} className="rounded-md border border-gray-100 dark:border-gray-700 p-3">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{transfer.from} → {transfer.to}</p>
                            <Badge 
                              className={
                                transfer.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-400'
                              }
                            >
                              {transfer.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{transfer.items}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

        {/* Active Farmers */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
            <CardTitle className="text-gray-800 dark:text-white">Active Farmers</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
              Farmers with recent collections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {[
                { name: 'Farmer #123', collection: '105L', quality: 'Grade A', lastCollection: '2 hours ago' },
                { name: 'Farmer #087', collection: '78L', quality: 'Grade A', lastCollection: '3 hours ago' },
                { name: 'Farmer #156', collection: '92L', quality: 'Grade B', lastCollection: '4 hours ago' },
                { name: 'Farmer #045', collection: '64L', quality: 'Grade A', lastCollection: '5 hours ago' },
              ].map((farmer, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{farmer.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{farmer.collection}</span>
                      <span>•</span>
                      <span>{farmer.quality}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{farmer.lastCollection}</p>
                </div>
              ))}
                    </div>
                  </CardContent>
          <CardFooter className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" size="sm" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              View All Farmers
            </Button>
          </CardFooter>
                </Card>

        {/* Quick Actions */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Add Collection', icon: <Droplet size={16} />, color: 'bg-blue-100 text-blue-700' },
                        { label: 'New Production', icon: <Activity size={16} />, color: 'bg-green-100 text-green-700' },
                        { label: 'Record Sale', icon: <ShoppingCart size={16} />, color: 'bg-purple-100 text-purple-700' },
                        { label: 'Add Transfer', icon: <Truck size={16} />, color: 'bg-amber-100 text-amber-700' },
                      ].map((action, i) => (
                        <Button 
                          key={i}
                          variant="outline"
                          className={`justify-start gap-2 ${action.color} border-none`}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
      </div>
    </div>
  );
} 