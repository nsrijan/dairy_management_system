import { create } from 'zustand';
import { Company } from '../hooks/useCompanies';

interface TenantCompanyStore {
    // Dialog states
    isCreateDialogOpen: boolean;
    setCreateDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setDeleteDialogOpen: (isOpen: boolean) => void;

    // Selected company for edit/delete operations
    selectedCompany: Company | null;
    setSelectedCompany: (company: Company | null) => void;

    // Search and filter states
    searchTerm: string;
    setSearchTerm: (term: string) => void;

    // Reset all states
    reset: () => void;
}

export const useTenantCompanyStore = create<TenantCompanyStore>((set) => ({
    // Dialog states
    isCreateDialogOpen: false,
    setCreateDialogOpen: (isOpen) => set({ isCreateDialogOpen: isOpen }),
    isEditDialogOpen: false,
    setEditDialogOpen: (isOpen) => set({ isEditDialogOpen: isOpen }),
    isDeleteDialogOpen: false,
    setDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),

    // Selected company
    selectedCompany: null,
    setSelectedCompany: (company) => set({ selectedCompany: company }),

    // Search and filter
    searchTerm: '',
    setSearchTerm: (term) => set({ searchTerm: term }),

    // Reset
    reset: () => set({
        isCreateDialogOpen: false,
        isEditDialogOpen: false,
        isDeleteDialogOpen: false,
        selectedCompany: null,
        searchTerm: '',
    }),
})); 