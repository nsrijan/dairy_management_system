import { FC } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Feature {
    name: string;
    isMore?: boolean;
}

interface ModuleCardProps {
    icon: React.ReactNode;
    name: string;
    description: string;
    features: Feature[];
    isActive: boolean;
    createdDate: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ModuleCard: FC<ModuleCardProps> = ({
    icon,
    name,
    description,
    features,
    isActive,
    createdDate,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <div className="text-2xl text-purple-500">{icon}</div>

            <div className="flex-1">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-600">{description}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {features.map((feature, index) => (
                        feature.isMore ? (
                            <Badge key={index} variant="secondary">+{feature.name} more</Badge>
                        ) : (
                            <Badge key={index} variant="outline">{feature.name}</Badge>
                        )
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Switch checked={isActive} />
                <div className="text-sm text-gray-600">{createdDate}</div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                    </button>
                    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}; 