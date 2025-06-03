import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TenantAdminResponse, TenantUserResponse } from '@/features/tenant/types';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserList } from './UserList';

interface UserManagementProps {
    users: TenantUserResponse[];
    admins: TenantAdminResponse[];
    onAddUser: () => void;
    onEditUser: (userId: string) => void;
}

export function UserManagement({ users, admins, onAddUser, onEditUser }: UserManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

    const filteredUsers = [...users, ...admins].filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const isAdmin = admins.some(admin => admin.id === user.id);
        const matchesRole =
            roleFilter === 'all' ||
            (roleFilter === 'admin' && isAdmin) ||
            (roleFilter === 'user' && !isAdmin);

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Users & Administrators</h2>
                <Button onClick={onAddUser} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            <UserFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
            />

            <UserStats
                totalUsers={users.length + admins.length}
                adminCount={admins.length}
                regularUserCount={users.length}
            />

            <UserList
                users={filteredUsers}
                admins={admins}
                onEdit={onEditUser}
            />
        </div>
    );
} 