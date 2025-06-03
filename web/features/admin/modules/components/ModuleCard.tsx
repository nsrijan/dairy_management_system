'use client';

import { FC } from 'react';
import { Feature, Module } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

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

    return (
        <Card className="group rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center text-2xl">
                            {getModuleIcon(module.code)}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {module.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {module.code}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-900"
                            onClick={() => onEdit?.(module)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-900"
                            onClick={() => onEdit?.(module)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => onDelete?.(id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {module.description}
                </p>

                {/* Features Section */}
                {features.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature: Feature, index: number) => (
                                <span
                                    key={index}
                                    className="text-sm bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full"
                                >
                                    {feature.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={active}
                            onCheckedChange={(checked) => onToggleStatus?.(id, checked)}
                            className="data-[state=checked]:bg-purple-600"
                        />
                        <span className={`text-sm font-medium ${active ? 'text-purple-600' : 'text-gray-500'}`}>
                            {active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {new Date(module.createdAt || '').toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}; 