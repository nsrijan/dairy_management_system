import { ModuleFormData, Module, ModulesListResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PATH = '/api/modules';

export const moduleApi = {
    getModules: async (token: string): Promise<ModulesListResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch modules');
            }

            return responseData;
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }
    },

    getModuleById: async (token: string, id: number): Promise<Module> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch module');
            }

            return responseData;
        } catch (error) {
            console.error('Error fetching module:', error);
            throw error;
        }
    },

    createModule: async (token: string, data: ModuleFormData): Promise<Module> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create module');
            }

            return responseData;
        } catch (error) {
            console.error('Error creating module:', error);
            throw error;
        }
    },

    updateModule: async (token: string, id: number, data: Partial<ModuleFormData>): Promise<Module> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update module');
            }

            return responseData;
        } catch (error) {
            console.error('Error updating module:', error);
            throw error;
        }
    },

    deleteModule: async (token: string, id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Failed to delete module');
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            throw error;
        }
    },

    toggleModuleStatus: async (token: string, id: number, active: boolean): Promise<Module> => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_PATH}/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ active })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update module status');
            }

            return responseData.data;
        } catch (error) {
            console.error('Error updating module status:', error);
            throw error;
        }
    }
}; 