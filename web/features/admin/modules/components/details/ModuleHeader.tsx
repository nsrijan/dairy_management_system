import { Building, Edit, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Module } from '../../types';

interface ModuleHeaderProps {
    module: Module;
}

export function ModuleHeader({ module }: ModuleHeaderProps) {
    const router = useRouter();

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/admin/modules')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Modules
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Module Info */}
            <div className="flex items-start gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Building className="h-6 w-6" />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{module.name}</h1>
                        <Badge variant={module.active ? "outline" : "secondary"} className={module.active ? "border-green-500 text-green-700" : ""}>
                            {module.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">@{module.code}</p>
                </div>
            </div>
        </>
    );
} 