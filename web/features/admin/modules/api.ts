import { CreateModuleInput, Module, UpdateModuleInput } from './types';

const API_BASE = '/api/admin/modules';

export const moduleApi = {
    getModules: async (): Promise<Module[]> => {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Failed to fetch modules');
        return response.json();
    },

    createModule: async (data: CreateModuleInput): Promise<Module> => {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create module');
        return response.json();
    },

    updateModule: async (data: UpdateModuleInput): Promise<Module> => {
        const response = await fetch(`${API_BASE}/${data.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update module');
        return response.json();
    },

    deleteModule: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete module');
    },

    toggleModuleStatus: async (id: number, isActive: boolean): Promise<Module> => {
        return moduleApi.updateModule({ id, isActive });
    }
}; 