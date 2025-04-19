import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface ChartCardProps {
    title: string;
    description?: string;
    children?: ReactNode;
    placeholder?: string;
    headerActions?: ReactNode;
}

export function ChartCard({ title, description, children, placeholder, headerActions }: ChartCardProps) {
    return (
        <Card className="shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div>
                    <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">{title}</CardTitle>
                    {description && <CardDescription className="text-xs mt-1">{description}</CardDescription>}
                </div>
                {headerActions && <div>{headerActions}</div>}
            </CardHeader>
            <CardContent className="p-0">
                {children ? (
                    children
                ) : (
                    <div className="h-[250px] flex items-center justify-center border-t border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">{placeholder || 'Chart Placeholder'}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 