'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Home,
    Settings,
    Users,
    Droplet,
    Activity,
    TrendingUp,
    Clock,
    Phone,
    MapPin,
    Calendar,
    BarChart3,
    Download,
    Edit,
    Plus,
    AlertCircle,
    CheckCircle,
    Thermometer,
    Package,
    DollarSign,
    User,
    Building2,
    Zap,
    Eye,
    MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getTenantName } from '@/features/navigation/getNavItems';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MilkCollectionBranchDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;
    const milkCollectionBranchId = params.milkCollectionBranchId as string;
    const { user, tenant } = useAuth();
    const subdomain = typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

    // Mock data for now - in real implementation, this would come from the backend
    const milkCollectionBranch = {
        id: milkCollectionBranchId,
        name: 'North District MCB',
        location: 'Village Sector 15, Gurugram, Haryana',
        phoneNumber: '+91 98765 43210',
        isActive: true,
        company: {
            id: companyId,
            name: 'Dairy Fresh Ltd.'
        },
        manager: {
            id: '1',
            name: 'Rajesh Kumar',
            username: 'rajesh.kumar',
            phone: '+91 98765 43210'
        },
        totalCapacity: 2500,
        chillVatCount: 3,
        chillVats: [
            {
                id: '1',
                name: 'Chill Vat A',
                capacityInLiters: 1000,
                currentStockLiters: 750,
                isOperational: true,
                availableCapacity: 250,
                capacityUtilization: 75.0
            },
            {
                id: '2',
                name: 'Chill Vat B',
                capacityInLiters: 800,
                currentStockLiters: 450,
                isOperational: true,
                availableCapacity: 350,
                capacityUtilization: 56.25
            },
            {
                id: '3',
                name: 'Chill Vat C',
                capacityInLiters: 700,
                currentStockLiters: 0,
                isOperational: false,
                availableCapacity: 0,
                capacityUtilization: 0.0
            }
        ],
        currentRates: [
            {
                id: '1',
                milkType: 'RAW',
                rateType: 'BUY',
                rate: 35.50,
                effectiveFrom: '2024-01-01',
                displayName: 'Raw Milk - Buy Rate'
            },
            {
                id: '2',
                milkType: 'RAW',
                rateType: 'SELL',
                rate: 42.00,
                effectiveFrom: '2024-01-01',
                displayName: 'Raw Milk - Sell Rate'
            },
            {
                id: '3',
                milkType: 'WHOLE',
                rateType: 'BUY',
                rate: 40.00,
                effectiveFrom: '2024-01-01',
                displayName: 'Whole Milk - Buy Rate'
            },
            {
                id: '4',
                milkType: 'WHOLE',
                rateType: 'SELL',
                rate: 48.00,
                effectiveFrom: '2024-01-01',
                displayName: 'Whole Milk - Sell Rate'
            }
        ],
        stats: {
            todaysCollection: 1875,
            activeFarmers: 142,
            avgFatContent: 4.2,
            avgSnfContent: 8.7,
            collectionTrend: 'up',
            qualityGrade: 'A',
            weeklyAverage: 1650,
            monthlyTotal: 52000,
            lastCollectionTime: '2 hours ago'
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T15:45:00Z'
    };

    const [activeTab, setActiveTab] = useState('overview');

    const getCapacityColor = (utilization: number) => {
        if (utilization >= 90) return 'text-red-600 dark:text-red-400';
        if (utilization >= 70) return 'text-amber-600 dark:text-amber-400';
        return 'text-green-600 dark:text-green-400';
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400">
                Active
            </Badge>
        ) : (
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400">
                Inactive
            </Badge>
        );
    };

    const getOperationalBadge = (isOperational: boolean) => {
        return isOperational ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Operational
            </Badge>
        ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Maintenance
            </Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppLayout
            title="Milk Collection Branch Details"
            tenantName={getTenantName(tenant || undefined, subdomain)}
            showSearch={false}
        >
            <div className="flex-1 space-y-4 p-4 pt-6">
                {/* Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/companies">Companies</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/companies/${companyId}`}>
                                {milkCollectionBranch.company.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Milk Collection Branch</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-bold">{milkCollectionBranch.name}</h1>
                                {getStatusBadge(milkCollectionBranch.isActive)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {milkCollectionBranch.location}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Activity className="h-4 w-4 mr-2" />
                                    Activity Log
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Deactivate
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
                            <Droplet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{milkCollectionBranch.stats.todaysCollection} L</div>
                            <p className="text-xs text-muted-foreground">
                                {milkCollectionBranch.stats.collectionTrend === 'up' ? '+' : '-'}5.2% from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{milkCollectionBranch.stats.activeFarmers}</div>
                            <p className="text-xs text-muted-foreground">
                                Contributing farmers today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quality Grade</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{milkCollectionBranch.stats.qualityGrade}</div>
                            <p className="text-xs text-muted-foreground">
                                Average quality today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
                            <Thermometer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.round((milkCollectionBranch.chillVats.reduce((sum, vat) => sum + vat.currentStockLiters, 0) / milkCollectionBranch.totalCapacity) * 100)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Of total capacity
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="chillvats">Chill Vats</TabsTrigger>
                        <TabsTrigger value="rates">Milk Rates</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Building2 className="h-5 w-5" />
                                        <span>Basic Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Name:</span>
                                        <span className="text-sm">{milkCollectionBranch.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Location:</span>
                                        <span className="text-sm">{milkCollectionBranch.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Phone:</span>
                                        <span className="text-sm">{milkCollectionBranch.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Status:</span>
                                        {getStatusBadge(milkCollectionBranch.isActive)}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Established:</span>
                                        <span className="text-sm">{formatDate(milkCollectionBranch.createdAt)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Manager Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Manager Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Name:</span>
                                        <span className="text-sm">{milkCollectionBranch.manager.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Username:</span>
                                        <span className="text-sm">{milkCollectionBranch.manager.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Phone:</span>
                                        <span className="text-sm">{milkCollectionBranch.manager.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Role:</span>
                                        <Badge variant="outline">MCB Manager</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="chillvats" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Chill Vats</h3>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Chill Vat
                            </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {milkCollectionBranch.chillVats.map((vat) => (
                                <Card key={vat.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center justify-between">
                                            {vat.name}
                                            {getOperationalBadge(vat.isOperational)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Capacity:</span>
                                                <span>{vat.capacityInLiters.toLocaleString()} L</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Current Stock:</span>
                                                <span>{vat.currentStockLiters.toLocaleString()} L</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Utilization:</span>
                                                <span className={getCapacityColor(vat.capacityUtilization)}>
                                                    {vat.capacityUtilization.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${vat.capacityUtilization}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="rates" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Current Milk Rates</h3>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Update Rates
                            </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {milkCollectionBranch.currentRates.map((rate) => (
                                <Card key={rate.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base">{rate.displayName}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">Rate:</span>
                                                <span className="text-lg font-bold">{formatCurrency(rate.rate)}/L</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">Effective From:</span>
                                                <span className="text-sm">{formatDate(rate.effectiveFrom)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">Type:</span>
                                                <Badge variant="outline">{rate.rateType}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Collection completed</p>
                                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Milk rates updated</p>
                                            <p className="text-xs text-muted-foreground">1 day ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Chill Vat C maintenance scheduled</p>
                                            <p className="text-xs text-muted-foreground">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
} 