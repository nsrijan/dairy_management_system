import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ModuleCard } from './ModuleCard';

// Dummy data for modules
const DUMMY_MODULES = [
    {
        id: 1,
        icon: '📦',
        name: 'Dairy Management',
        description: 'Complete dairy farm and milk processing management system',
        features: [
            { name: 'Milk Collection' },
            { name: 'Farmer Management' },
            { name: 'Production Planning' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    },
    {
        id: 2,
        icon: '🏺',
        name: 'Pottery & Ceramics',
        description: 'Pottery production and craft management system',
        features: [
            { name: 'Product Design' },
            { name: 'Kiln Management' },
            { name: 'Inventory Control' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    },
    {
        id: 3,
        icon: '👕',
        name: 'Garment Manufacturing',
        description: 'Textile and garment production management',
        features: [
            { name: 'Design Management' },
            { name: 'Production Planning' },
            { name: 'Quality Assurance' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    }
];

export const ModuleManagement: FC = () => {
    const handleCreateModule = () => {
        // Handle create module logic
        console.log('Create module clicked');
    };

    const handleEditModule = (id: number) => {
        console.log('Edit module', id);
    };

    const handleDeleteModule = (id: number) => {
        console.log('Delete module', id);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Module Management</h1>
                    <p className="text-gray-600">Manage business modules available for tenant onboarding.</p>
                </div>
                <Button onClick={handleCreateModule} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <span className="mr-2">+</span>
                    Create Module
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b bg-gray-50">
                    <div>Module</div>
                    <div>Description</div>
                    <div>Features</div>
                    <div>Status</div>
                    <div>Created</div>
                </div>

                {DUMMY_MODULES.map((module) => (
                    <ModuleCard
                        key={module.id}
                        icon={module.icon}
                        name={module.name}
                        description={module.description}
                        features={module.features}
                        isActive={module.isActive}
                        createdDate={module.createdDate}
                        onEdit={() => handleEditModule(module.id)}
                        onDelete={() => handleDeleteModule(module.id)}
                    />
                ))}
            </div>
        </div>
    );
}; 