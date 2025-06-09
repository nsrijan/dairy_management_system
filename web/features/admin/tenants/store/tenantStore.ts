import { create } from 'zustand';
import { TenantResponse } from '../types';

interface TenantStore {
    currentTenant: TenantResponse | null;
    setCurrentTenant: (tenant: TenantResponse | null) => void;
    isEditDialogOpen: boolean;
    setEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setDeleteDialogOpen: (isOpen: boolean) => void;
}

export const useTenantStore = create<TenantStore>((set) => ({
    currentTenant: null,
    setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
    isEditDialogOpen: false,
    setEditDialogOpen: (isOpen) => set({ isEditDialogOpen: isOpen }),
    isDeleteDialogOpen: false,
    setDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
})); 