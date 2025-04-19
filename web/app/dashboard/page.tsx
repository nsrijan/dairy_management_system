'use client';

import { useAuth } from '../providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ActivitySquare,
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  DropletIcon,
  TrendingUp,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collection Today</CardTitle>
            <DropletIcon className="h-4 w-4 text-teal-600 dark:text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">5,240 L</div>
            <div className="flex items-center pt-1 text-xs text-green-600 dark:text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>12% compared to yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Farmers</CardTitle>
            <Users className="h-4 w-4 text-teal-600 dark:text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">412</div>
            <div className="flex items-center pt-1 text-xs text-red-600 dark:text-red-400">
              <ArrowDown className="h-3 w-3 mr-1" />
              <span>3% compared to last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Production Output</CardTitle>
            <ActivitySquare className="h-4 w-4 text-teal-600 dark:text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">15,280 kg</div>
            <div className="flex items-center pt-1 text-xs text-green-600 dark:text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>8% compared to last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue (Monthly)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-teal-600 dark:text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₹24,95,000</div>
            <div className="flex items-center pt-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>15% compared to last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional dashboard content... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
            <CardDescription>Latest milk collections across branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for recent collections table/list */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading recent collections...
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Collection Trends</CardTitle>
            <CardDescription>Weekly milk collection trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center border rounded-md border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 