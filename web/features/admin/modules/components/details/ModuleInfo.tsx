import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Module } from '../../types';

interface ModuleInfoProps {
    module: Module;
}

export function ModuleInfo({ module }: ModuleInfoProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                    <CardTitle>Module Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{module.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Code</p>
                        <Badge variant="secondary">{module.code}</Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{module.description}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(module.createdAt).toLocaleDateString()}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Version</p>
                        <p className="font-medium">2.1.0</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Setup Time</p>
                        <p className="font-medium">2-3 hours</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Complexity</p>
                        <Badge variant="outline">Medium</Badge>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Support Level</p>
                        <p className="font-medium">Full Support</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 