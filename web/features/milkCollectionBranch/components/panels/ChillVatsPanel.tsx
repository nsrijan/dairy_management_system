import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChillVatCard } from '../widgets/ChillVatCard';
import { ChillVat } from '../../types';
import { Truck } from 'lucide-react';

interface ChillVatsPanelProps {
    chillVats: ChillVat[];
}

export function ChillVatsPanel({ chillVats }: ChillVatsPanelProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Chill Vats Status</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {chillVats.map((vat) => (
                    <ChillVatCard key={vat.id} vat={vat} />
                ))}
            </div>
        </div>
    );
} 