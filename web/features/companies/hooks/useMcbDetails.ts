import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { milkCollectionBranchService, MilkCollectionBranch } from '@/features/milkCollectionBranch/services/milkCollectionBranchService';

export function useMcbDetails(companyId: string, mcbId: string) {
    const [mcb, setMcb] = useState<MilkCollectionBranch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMcbDetails = async () => {
            if (!user?.token || !companyId || !mcbId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await milkCollectionBranchService.getMilkCollectionBranchById(user.token, companyId, mcbId);
                setMcb(data);
            } catch (err) {
                console.error('Error fetching MCB details:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch MCB details');
                setMcb(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMcbDetails();
    }, [user?.token, companyId, mcbId]);

    const refreshMcb = async () => {
        if (!user?.token || !companyId || !mcbId) return;

        try {
            setError(null);
            const data = await milkCollectionBranchService.getMilkCollectionBranchById(user.token, companyId, mcbId);
            setMcb(data);
        } catch (err) {
            console.error('Error refreshing MCB details:', err);
            setError(err instanceof Error ? err.message : 'Failed to refresh MCB details');
        }
    };

    return {
        mcb,
        isLoading,
        error,
        refreshMcb
    };
} 