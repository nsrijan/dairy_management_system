import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Building,
    Plus,
    MapPin,
    Users,
    Droplet,
    Activity,
    ArrowRight,
    Eye,
    Settings,
    Phone,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Clock,
    BarChart3,
    Star,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMcbs } from '../../hooks/useMcbs';

interface MCB {
    id: string;
    name: string;
    location: string;
    phoneNumber?: string;
    isActive: boolean;
    managerName?: string;
    totalCapacity?: number;
    chillVatCount?: number;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

interface McbOverviewProps {
    companyId: string;
    onCreateMCB?: () => void;
    onViewAllMCBs?: () => void;
    onEditMCB?: (mcb: MCB) => void;
    onDeleteMCB?: (mcb: MCB) => void;
}

export function McbOverview({
    companyId,
    onCreateMCB,
    onViewAllMCBs,
    onEditMCB,
    onDeleteMCB
}: McbOverviewProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { mcbs, isLoading, error } = useMcbs(companyId);

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
            </Badge>
        ) : (
            <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                Inactive
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                        <Building className="h-5 w-5" />
                        Milk Collection Branches
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-50 dark:from-red-900/10 dark:to-red-900/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                        <AlertCircle className="h-5 w-5" />
                        Error Loading MCBs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Building className="h-5 w-5" />
                        Milk Collection Branches ({mcbs.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onCreateMCB}
                            size="sm"
                            variant="secondary"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add MCB
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {mcbs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No MCBs Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            This company doesn't have any milk collection branches yet. Create your first MCB to get started.
                        </p>
                        <Button
                            onClick={onCreateMCB}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First MCB
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mcbs.map((mcb) => (
                            <Card
                                key={mcb.id}
                                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                    <Building className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {mcb.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {getStatusBadge(mcb.isActive)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 text-blue-500" />
                                                    {mcb.location}
                                                </div>
                                                {mcb.phoneNumber && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4 text-green-500" />
                                                        {mcb.phoneNumber}
                                                    </div>
                                                )}
                                                {mcb.managerName && (
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4 text-purple-500" />
                                                        Manager: {mcb.managerName}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Activity className="h-4 w-4 text-blue-600" />
                                                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Status</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                                                        {mcb.isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Droplet className="h-4 w-4 text-purple-600" />
                                                        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Vats</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                                                        {mcb.chillVatCount || 0}
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm font-medium text-green-900 dark:text-green-100">Created</span>
                                                    </div>
                                                    <div className="text-sm font-semibold text-green-800 dark:text-green-200">
                                                        {new Date(mcb.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/companies/${companyId}/milkCollectionBranch/${mcb.id}`}>
                                                <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </Link>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {onEditMCB && (
                                                        <DropdownMenuItem onClick={() => onEditMCB(mcb)}>
                                                            <Settings className="h-4 w-4 mr-2" />
                                                            Edit MCB
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem>
                                                        <BarChart3 className="h-4 w-4 mr-2" />
                                                        View Reports
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Zap className="h-4 w-4 mr-2" />
                                                        MCB Settings
                                                    </DropdownMenuItem>
                                                    {onDeleteMCB && (
                                                        <DropdownMenuItem
                                                            onClick={() => onDeleteMCB(mcb)}
                                                            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                                        >
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Delete MCB
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {mcbs.length > 0 && onViewAllMCBs && (
                            <div className="text-center pt-6">
                                <Button
                                    onClick={onViewAllMCBs}
                                    variant="outline"
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border-blue-200 hover:border-blue-300"
                                >
                                    View All MCBs
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 