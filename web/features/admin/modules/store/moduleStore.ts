import { create } from 'zustand';
import { Module } from '../types';

interface ModuleStore {
    selectedModules: string[];
    setSelectedModules: (modules: string[]) => void;
    toggleModule: (moduleId: string) => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
    selectedModules: [],
    setSelectedModules: (modules) => set({ selectedModules: modules }),
    toggleModule: (moduleId) =>
        set((state) => ({
            selectedModules: state.selectedModules.includes(moduleId)
                ? state.selectedModules.filter((id) => id !== moduleId)
                : [...state.selectedModules, moduleId],
        })),
})); 