import { ModuleType } from '../../../types';

interface ModulesStepProps {
    selectedModules: ModuleType[];
    onModuleChange: (moduleId: ModuleType) => void;
}

export function ModulesStep({ selectedModules, onModuleChange }: ModulesStepProps) {
    const modules = [
        {
            id: ModuleType.DAIRY,
            name: 'Dairy Management',
            description: 'Complete dairy farm management system with milk production tracking, cattle management, and more.',
            icon: '🥛'
        },
        {
            id: ModuleType.POTTERY,
            name: 'Pottery Workshop',
            description: 'Manage pottery production, inventory, and sales with our specialized pottery management system.',
            icon: '🏺'
        },
        {
            id: ModuleType.GARMENTS,
            name: 'Garments Factory',
            description: 'Full-featured garment factory management with production tracking, inventory, and order management.',
            icon: '👕'
        }
    ];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-base font-medium mb-2">Select Modules</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Choose the modules you want to enable for your tenant.
                </p>
            </div>

            <div className="grid gap-4">
                {modules.map((module) => (
                    <div
                        key={module.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${selectedModules.includes(module.id)
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-200 hover:border-indigo-200 dark:border-gray-700 dark:hover:border-indigo-700'
                            }`}
                        onClick={() => onModuleChange(module.id)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">{module.icon}</div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {module.name}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {module.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 