import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

export interface ChartCardProps {
    title: string;
    description?: string;
    children?: ReactNode;
    placeholder?: string;
}

export function ChartCard({ title, description, children, placeholder }: ChartCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                {children ? (
                    children
                ) : (
                    <div className="h-[250px] flex items-center justify-center border rounded-md border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">{placeholder || 'Chart Placeholder'}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 