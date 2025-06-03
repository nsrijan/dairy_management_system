'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CompanySearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function CompanySearch({ value, onChange }: CompanySearchProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                placeholder="Search companies..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10"
            />
        </div>
    );
} 