'use client';

import { FC } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Feature, Module } from '../types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ModuleCardProps {
    module: Module;
    onEdit: (module: Module) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number, active: boolean) => void;
}

export const ModuleCard: FC<ModuleCardProps> = ({
    module,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
    const { features = [], active, id } = module;
    const hasFeatures = features.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-medium">{module.name}</h3>
                    <p className="text-sm text-gray-500">{module.code}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={active}
                        onCheckedChange={(checked) => onToggleStatus(id, checked)}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(module)}
                        className="h-8 w-8 p-0"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{module.description}</p>

            {hasFeatures ? (
                <div className="space-y-1">
                    <p className="text-sm font-medium">Features:</p>
                    <div className="flex flex-wrap gap-1">
                        {features.map((feature: Feature, index: number) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700"
                            >
                                {feature.name}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">No features defined</p>
            )}
        </div>
    );
}; 