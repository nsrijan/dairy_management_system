import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import {
    farmerService,
    Farmer,
    CreateFarmerRequest,
    UpdateFarmerRequest
} from '../services/farmerService';

export interface UpdateFarmerData {
    id: string;
    data: UpdateFarmerRequest;
}

// React Query Hooks
export function useFarmers() {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['farmers'],
        queryFn: () => farmerService.getFarmers(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useFarmer(id: string) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['farmer', id],
        queryFn: () => farmerService.getFarmerById(token!, id),
        enabled: !!token && !!id,
    });
}

export function useFarmersByMCB(mcbId: string) {
    const { token } = useAuth();

    return useQuery({
        queryKey: ['farmers', 'mcb', mcbId],
        queryFn: () => farmerService.getFarmersByMCB(token!, mcbId),
        enabled: !!token && !!mcbId,
    });
}

export function useCreateFarmer() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateFarmerRequest) => farmerService.createFarmer(token!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            toast({
                title: 'Success',
                description: 'Farmer created successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
}

export function useUpdateFarmer() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: UpdateFarmerData) => farmerService.updateFarmer(token!, id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            queryClient.invalidateQueries({ queryKey: ['farmer', id] });
            toast({
                title: 'Success',
                description: 'Farmer updated successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
}

export function useDeleteFarmer() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => farmerService.deleteFarmer(token!, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farmers'] });
            toast({
                title: 'Success',
                description: 'Farmer deleted successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
} 