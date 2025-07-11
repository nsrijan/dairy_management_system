import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChillVat } from '../../types';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChillVatCardProps {
    vat: ChillVat;
}

export function ChillVatCard({ vat }: ChillVatCardProps) {
    const getUtilizationColor = (utilization: number) => {
        if (utilization >= 90) return 'bg-red-500';
        if (utilization >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getUtilizationVariant = (utilization: number) => {
        if (utilization >= 90) return 'destructive';
        if (utilization >= 70) return 'secondary';
        return 'default';
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vat.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        {vat.isOperational ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={vat.isOperational ? "default" : "destructive"}>
                            {vat.isOperational ? "Operational" : "Down"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Capacity</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{vat.capacity}L</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Current Stock</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{vat.currentStock}L</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Utilization</span>
                        <Badge variant={getUtilizationVariant(vat.utilization)}>
                            {vat.utilization}%
                        </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className={cn(
                                "h-3 rounded-full transition-all duration-300",
                                getUtilizationColor(vat.utilization)
                            )}
                            style={{ width: `${vat.utilization}%` }}
                        />
                    </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Available Capacity</p>
                    <p className="text-lg font-bold text-foreground">{vat.capacity - vat.currentStock}L</p>
                </div>
            </CardContent>
        </Card>
    );
} 