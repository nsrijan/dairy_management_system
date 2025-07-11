import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectionItem } from '@/features/milkCollectionBranch/components/widgets/CollectionItem';
import { MilkCollection } from '../../types';
import { Clock } from 'lucide-react';

interface RecentCollectionsPanelProps {
    collections: MilkCollection[];
    showDetails?: boolean;
}

export function RecentCollectionsPanel({ collections, showDetails = false }: RecentCollectionsPanelProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Collections
                </CardTitle>
                <CardDescription>Latest milk collections from farmers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {collections.map((collection) => (
                        <CollectionItem
                            key={collection.id}
                            collection={collection}
                            showDetails={showDetails}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 