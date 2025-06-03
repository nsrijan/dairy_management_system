'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompanyForm } from './widgets/CompanyForm';
import { CompanyResponse } from '../../types';
import { CompanyCreateUpdateRequest } from '../../services/companyService';

interface CompanyFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    company?: CompanyResponse;
    onSubmit: (data: Omit<CompanyCreateUpdateRequest, 'tenantId'>) => Promise<void>;
}

export default function CompanyFormDialog({ open, onOpenChange, company, onSubmit }: CompanyFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{company ? 'Edit Company' : 'Create New Company'}</DialogTitle>
                </DialogHeader>
                <CompanyForm
                    company={company}
                    onSubmit={async (data) => {
                        await onSubmit(data);
                        onOpenChange(false);
                    }}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
} 