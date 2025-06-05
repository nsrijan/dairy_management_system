import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import { Module } from '../../types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ModuleCardProps {
    module: Module;
    onEdit?: (module: Module) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (id: number, active: boolean) => void;
}

export const ModuleCard: FC<ModuleCardProps> = ({
    module,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    const router = useRouter();
    const { features = [], active, id } = module;

    // Get icon based on module code
    const getModuleIcon = (code: string) => {
        switch (code.toLowerCase()) {
            case 'dairy':
                return '🥛';
            case 'pottery':
                return '🏺';
            case 'garments':
                return '👕';
            case 'transport':
                return '🚛';
            default:
                return '📱';
        }
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/admin/modules/${id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(module);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(id);
    };

    const handleToggleStatus = (e: React.MouseEvent, checked: boolean) => {
        e.stopPropagation();
        onToggleStatus?.(id, checked);
    };

    return (
        <Card
            className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={handleViewDetails}
        >
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-500/10 rounded-lg">
                            {getModuleIcon(module.code)}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                {module.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">@{module.code}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-900"
                            onClick={handleViewDetails}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-900"
                            onClick={handleEdit}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {module.description}
                </p>

                {/* Features Section */}
                {features.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</p>
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <span
                                    key={index}
                                    className="text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full"
                                >
                                    {feature.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={active}
                            onCheckedChange={(checked) => onToggleStatus?.(id, checked)}
                            className="data-[state=checked]:bg-purple-600"
                        />
                        <span className={`text-sm font-medium ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {new Date(module.createdAt).toLocaleDateString()}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 