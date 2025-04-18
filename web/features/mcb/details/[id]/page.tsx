'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { 
  ArrowLeft, 
  CalendarDays, 
  Map, 
  Settings, 
  Users, 
  Droplet, 
  ArrowUp, 
  ArrowDown,
  Download,
  FilterIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMCBById } from '../../data';

export default function MCBDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const mcb = getMCBById(id);
  const [timeRange, setTimeRange] = useState('week');

  if (!mcb) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">MCB Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The milk collection branch you're looking for doesn't exist or has been removed.</p>
        <Link href="/features/mcb/list">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to MCB List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Link href="/features/mcb/list">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{mcb.name}</h1>
              <Badge 
                className={
                  mcb.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'
                }
              >
                {mcb.status === 'active' ? 'Active' : 'Under Maintenance'}
              </Badge>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
              <Map className="h-3.5 w-3.5 mr-1" /> {mcb.location}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Link href={`/features/mcb/settings/${mcb.id}`}>
            <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Milk Collection */}
        <Card className="border-none shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Collection</CardTitle>
            <Droplet className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </CardHeader>
          <CardContent className="p-4 pt-2 bg-white dark:bg-gray-800">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{mcb.todaysCollection} L</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">from {mcb.activeFarmers} farmers</p>
              </div>
              <div className={`flex items-center text-xs font-medium ${
                mcb.collectionTrend === 'up' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {mcb.collectionTrend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Quality */}
        <Card className="border-none shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Quality</CardTitle>
            <Droplet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent className="p-4 pt-2 bg-white dark:bg-gray-800">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">Grade {mcb.avgQuality}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">4.2% fat, 8.7% SNF</p>
              </div>
              <Badge className={`
                ${mcb.avgQuality === 'A' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'
                }
              `}>
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Farmers */}
        <Card className="border-none shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Farmers</CardTitle>
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent className="p-4 pt-2 bg-white dark:bg-gray-800">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{mcb.activeFarmers}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+12 this month</p>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                <ArrowUp size={14} />
                <span>8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Average */}
        <Card className="border-none shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/30">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Average</CardTitle>
            <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent className="p-4 pt-2 bg-white dark:bg-gray-800">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{mcb.stats?.weeklyAvg || "--"} L</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">per day</p>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                <ArrowUp size={14} />
                <span>3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto gap-4 bg-transparent">
          <TabsTrigger value="overview" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="collections" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            Collections
          </TabsTrigger>
          <TabsTrigger value="farmers" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            Farmers
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MCB Info Card */}
            <Card className="col-span-1 border-none shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">MCB Information</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Details about this branch</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Manager</p>
                    <p className="text-base text-gray-800 dark:text-white">{mcb.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="text-base text-gray-800 dark:text-white">{mcb.contact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exact Location</p>
                    <p className="text-base text-gray-800 dark:text-white">{mcb.coordinates}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Established</p>
                    <p className="text-base text-gray-800 dark:text-white">{mcb.establishment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collection Trend Chart */}
            <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Collection Trend</CardTitle>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] h-8 text-xs">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="quarter">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Daily milk collection in liters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[300px] w-full bg-teal-50 dark:bg-teal-900/20 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {/* Chart component will be placed here */}
                  Collection Trend Chart
                </div>
              </CardContent>
            </Card>

            {/* Latest Collections Table */}
            {mcb.stats?.recentCollections && (
              <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Recent Collections</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Most recent milk collections at this branch
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <FilterIcon className="h-3.5 w-3.5" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400">ID</th>
                          <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400">Time</th>
                          <th className="text-left pb-3 font-medium text-gray-500 dark:text-gray-400">Farmer</th>
                          <th className="text-right pb-3 font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                          <th className="text-center pb-3 font-medium text-gray-500 dark:text-gray-400">Quality</th>
                          <th className="text-right pb-3 font-medium text-gray-500 dark:text-gray-400">Fat %</th>
                          <th className="text-right pb-3 font-medium text-gray-500 dark:text-gray-400">SNF %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mcb.stats.recentCollections.map((collection) => (
                          <tr key={collection.id} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-3 text-gray-800 dark:text-gray-200">{collection.id}</td>
                            <td className="py-3 text-gray-800 dark:text-gray-200">{collection.time}</td>
                            <td className="py-3 text-gray-800 dark:text-gray-200">{collection.farmer}</td>
                            <td className="py-3 text-right text-gray-800 dark:text-gray-200">{collection.quantity} L</td>
                            <td className="py-3 text-center">
                              <Badge className={`
                                ${collection.quality === 'A' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-400'
                                }
                              `}>
                                {collection.quality}
                              </Badge>
                            </td>
                            <td className="py-3 text-right text-gray-800 dark:text-gray-200">{collection.fat}</td>
                            <td className="py-3 text-right text-gray-800 dark:text-gray-200">{collection.snf}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-teal-600 dark:text-teal-400">
                      View All Collections
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quality Distribution Chart */}
            {mcb.stats?.qualityDistribution && (
              <Card className="col-span-1 border-none shadow-sm">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Quality Distribution</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Milk quality by grade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[220px] w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {/* Chart component will be placed here */}
                    Quality Distribution Chart
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Grade A</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{mcb.stats.qualityDistribution.A}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Grade B</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{mcb.stats.qualityDistribution.B}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Grade C</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{mcb.stats.qualityDistribution.C}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Collections Tab (Placeholder) */}
        <TabsContent value="collections" className="pt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Collections History</CardTitle>
              <CardDescription>
                Detailed history of all milk collections at this branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Collections tab content will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farmers Tab (Placeholder) */}
        <TabsContent value="farmers" className="pt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Registered Farmers</CardTitle>
              <CardDescription>
                Manage farmers registered with this branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Farmers tab content will be implemented in the next phase
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 