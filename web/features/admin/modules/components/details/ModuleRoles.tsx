import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, Key } from 'lucide-react';

interface Role {
    name: string;
    code: string;
    description: string;
    permissions: string[];
    userCount: number;
}

const DEMO_ROLES: Role[] = [
    {
        name: 'Administrator',
        code: 'ADMIN',
        description: 'Full access to all module features and settings',
        permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_USERS', 'MANAGE_SETTINGS'],
        userCount: 3
    },
    {
        name: 'Manager',
        code: 'MANAGER',
        description: 'Access to manage operations and view reports',
        permissions: ['READ', 'UPDATE', 'MANAGE_USERS'],
        userCount: 8
    },
    {
        name: 'Operator',
        code: 'OPERATOR',
        description: 'Basic operations and data entry',
        permissions: ['READ', 'UPDATE'],
        userCount: 15
    }
];

export function ModuleRoles() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Role Management</h2>
                    <p className="text-sm text-gray-500">Manage access levels and permissions for module users</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                </Button>
            </div>

            <div className="grid gap-4">
                {DEMO_ROLES.map((role) => (
                    <Card key={role.code} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-900/50 border-gray-200/50 dark:border-gray-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {role.code}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">{role.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users className="h-4 w-4 mr-1" />
                                        {role.userCount} users
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Shield className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-500 mb-2">Permissions</p>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <div
                                            key={permission}
                                            className="flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
                                        >
                                            <Key className="h-3 w-3 mr-1" />
                                            {permission}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 