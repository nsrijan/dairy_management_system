import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { milkCollectionBranchService, MilkCollectionBranch } from '@/features/milkCollectionBranch/services/milkCollectionBranchService';

export function useMcbs(companyId: string) {
    const [mcbs, setMcbs] = useState<MilkCollectionBranch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMcbs = async () => {
            if (!user?.token || !companyId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await milkCollectionBranchService.getMilkCollectionBranches(user.token, companyId);
                setMcbs(data);
            } catch (err) {
                console.error('Error fetching MCBs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch MCBs');
                setMcbs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMcbs();
    }, [user?.token, companyId]);

    const refreshMcbs = async () => {
        if (!user?.token || !companyId) return;

        try {
            setError(null);
            const data = await milkCollectionBranchService.getMilkCollectionBranches(user.token, companyId);
            setMcbs(data);
        } catch (err) {
            console.error('Error refreshing MCBs:', err);
            setError(err instanceof Error ? err.message : 'Failed to refresh MCBs');
        }
    };

    return {
        mcbs,
        isLoading,
        error,
        refreshMcbs
    };
} 