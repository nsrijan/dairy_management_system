import { Badge } from '@/components/ui/badge';
import { MilkCollection } from '../../types';

interface CollectionItemProps {
    collection: MilkCollection;
    showDetails?: boolean;
}

export function CollectionItem({ collection, showDetails = false }: CollectionItemProps) {
    const getQualityVariant = (quality: 'A' | 'B' | 'C') => {
        switch (quality) {
            case 'A':
                return 'default';
            case 'B':
                return 'secondary';
            case 'C':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
            <div className="flex-1">
                <p className="font-medium text-foreground">{collection.farmerName}</p>
                <p className="text-sm text-muted-foreground">{collection.time}</p>
                {showDetails && (
                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        <div className="flex gap-4">
                            <span>Fat: {collection.fatPercentage}%</span>
                            <span>SNF: {collection.snfPercentage}%</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-right">
                <p className="font-semibold text-foreground">{collection.quantity}L</p>
                <Badge variant={getQualityVariant(collection.quality)}>
                    Grade {collection.quality}
                </Badge>
            </div>
        </div>
    );
} 