'use client';

import { ModuleFormData, Module, ModulesListResponse, ModuleUpdateRequest } from '../types';
import { moduleApi } from '../api/moduleApi';

/**
 * Service for managing module-related API calls
 */
export const moduleService = {
    async getAllModules(token: string): Promise<ModulesListResponse> {
        try {
            const response = await moduleApi.getModules(token);
            return response;
        } catch (error) {
            console.error('Error in getAllModules:', error);
            throw error;
        }
    },

    async getModuleById(token: string, id: number): Promise<Module> {
        try {
            return await moduleApi.getModuleById(token, id);
        } catch (error) {
            console.error(`Error in getModuleById (${id}):`, error);
            throw error;
        }
    },

    async createModule(token: string, data: ModuleFormData): Promise<Module> {
        try {
            const response = await moduleApi.createModule(token, data);
            return response;
        } catch (error) {
            console.error('Error in createModule:', error);
            throw error;
        }
    },

    async updateModule(token: string, id: number, data: Partial<ModuleFormData>): Promise<Module> {
        try {
            // Include all fields including features in the update request
            const updateData: ModuleUpdateRequest = {
                name: data.name,
                code: data.code,
                description: data.description,
                active: data.active,
                features: data.features // Include features in the update
            };

            const response = await moduleApi.updateModule(token, id, updateData);
            return response;
        } catch (error) {
            console.error('Error in updateModule:', error);
            throw error;
        }
    },

    async deleteModule(token: string, id: number): Promise<void> {
        try {
            await moduleApi.deleteModule(token, id);
        } catch (error) {
            console.error('Error in deleteModule:', error);
            throw error;
        }
    },

    async toggleModuleStatus(token: string, id: number, active: boolean): Promise<Module> {
        try {
            const response = await moduleApi.toggleModuleStatus(token, id, active);
            return response;
        } catch (error) {
            console.error(`Error in toggleModuleStatus (${id}):`, error);
            throw error;
        }
    },

    cleanModuleData(data: ModuleFormData): ModuleFormData {
        return {
            ...data,
            features: data.features.filter(f => f.name.trim())
        };
    }
}; 