'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModuleCard } from './ModuleCard';
import { ModuleFormDialog } from './ModuleFormDialog';
import { moduleService } from '@/features/admin/modules/services/moduleService';
import { Module, ModuleFormData } from '@/features/admin/modules/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { LayoutGrid, List, Plus, Package } from 'lucide-react';

export interface ModuleManagementProps {
    token: string;
}

export const ModuleManagement: FC<ModuleManagementProps> = ({ token }) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();

    const fetchModules = async () => {
        try {
            const response = await moduleService.getAllModules(token);
            setModules(response.content || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
            setModules([]);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch modules"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleCreateModule = () => {
        setFormMode('create');
        setSelectedModule(null);
        setFormOpen(true);
    };

    const handleEditModule = (module: Module) => {
        setSelectedModule(module);
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleDeleteModule = (id: number) => {
        const module = modules.find(m => m.id === id);
        if (module) {
            setSelectedModule(module);
            setDeleteDialogOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedModule) return;

        try {
            await moduleService.deleteModule(token, selectedModule.id);
            setModules(modules.filter(m => m.id !== selectedModule.id));
            toast({
                title: "Success",
                description: "Module deleted successfully"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete module"
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedModule(null);
        }
    };

    const handleToggleStatus = async (id: number, active: boolean) => {
        try {
            const updatedModule = await moduleService.updateModule(token, id, { active });
            setModules(modules.map(m => m.id === id ? updatedModule : m));
            toast({
                title: "Success",
                description: `Module ${active ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update module status"
            });
        }
    };

    const handleFormSuccess = async (data: ModuleFormData) => {
        try {
            // Ensure features array is initialized
            const moduleData = {
                ...data,
                features: data.features || []
            };

            if (formMode === 'create') {
                const newModule = await moduleService.createModule(token, moduleData);
                setModules([...modules, newModule]);
                toast({
                    title: "Success",
                    description: "Module created successfully"
                });
            } else if (selectedModule) {
                const updatedModule = await moduleService.updateModule(token, selectedModule.id, moduleData);
                setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
                toast({
                    title: "Success",
                    description: "Module updated successfully"
                });
            }
            setFormOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: formMode === 'create' ? 'Failed to create module' : 'Failed to update module'
            });
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Module Management</h1>
                    <p className="text-gray-500 mt-1">Manage business modules available for tenant onboarding.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        onClick={handleCreateModule}
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Module
                    </Button>
                </div>
            </div>

            <div className="bg-gray-50/50 rounded-xl p-6">
                <div className={`
                    grid gap-6
                    ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-1'
                    }
                `}>
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            onEdit={handleEditModule}
                            onDelete={handleDeleteModule}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                    {modules.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-purple-100 p-3 mb-4">
                                <Package className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No modules found</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first module</p>
                            <Button
                                onClick={handleCreateModule}
                                variant="outline"
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Module
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ModuleFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSuccess={handleFormSuccess}
                module={selectedModule ?? undefined}
                mode={formMode}
                token={token}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the module &quot;{selectedModule?.name}&quot;.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Toaster />
        </div>
    );
}; 