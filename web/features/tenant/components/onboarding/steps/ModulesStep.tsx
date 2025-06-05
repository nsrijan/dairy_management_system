import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Module {
    id: string;
    name: string;
    description: string;
    icon: string;
}

interface ModulesStepProps {
    selectedModules: string[];
    onModuleChange: (moduleId: string) => void;
}

const availableModules: Module[] = [
    {
        id: 'dairy',
        name: 'Dairy Management',
        description: 'Complete dairy operations management including milk collection, processing, and distribution.',
        icon: '🥛'
    },
    {
        id: 'inventory',
        name: 'Inventory Management',
        description: 'Track and manage inventory across multiple locations and warehouses.',
        icon: '📦'
    },
    {
        id: 'accounting',
        name: 'Financial Management',
        description: 'Handle accounting, payments, and financial reporting.',
        icon: '💰'
    }
];

export function ModulesStep({ selectedModules, onModuleChange }: ModulesStepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Select Modules</h3>
                <p className="text-sm text-muted-foreground">
                    Choose the modules you want to enable for this tenant.
                </p>
            </div>

            <div className="grid gap-4">
                {availableModules.map((module) => (
                    <Card key={module.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex h-6 items-center">
                                    <Checkbox
                                        id={module.id}
                                        checked={selectedModules.includes(module.id)}
                                        onCheckedChange={() => onModuleChange(module.id)}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label
                                        htmlFor={module.id}
                                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <span className="mr-2">{module.icon}</span>
                                        {module.name}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {module.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 