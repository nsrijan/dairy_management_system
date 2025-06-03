import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    roleFilter: 'all' | 'admin' | 'user';
    onRoleFilterChange: (value: 'all' | 'admin' | 'user') => void;
}

export function UserFilters({ searchTerm, onSearchChange, roleFilter, onRoleFilterChange }: UserFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="sm:w-48">
                <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="user">Regular Users</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 