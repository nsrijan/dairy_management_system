import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CompanyStepProps {
    companyData: {
        name: string;
        description: string;
        address: string;
        phone: string;
        email: string;
    };
    onCompanyDataChange: (field: string, value: string) => void;
}

export function CompanyStep({ companyData, onCompanyDataChange }: CompanyStepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Company Information</h3>
                <p className="text-sm text-muted-foreground">
                    Enter the details of your primary company.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Company Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                        placeholder="Enter company name"
                        value={companyData.name}
                        onChange={(e) => onCompanyDataChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                        placeholder="Brief description of your company"
                        value={companyData.description}
                        onChange={(e) => onCompanyDataChange('description', e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Business Address <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                        placeholder="Enter complete address"
                        value={companyData.address}
                        onChange={(e) => onCompanyDataChange('address', e.target.value)}
                        rows={2}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Phone Number <span className="text-destructive">*</span>
                        </label>
                        <Input
                            type="tel"
                            placeholder="Enter phone number"
                            value={companyData.phone}
                            onChange={(e) => onCompanyDataChange('phone', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Email Address <span className="text-destructive">*</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={companyData.email}
                            onChange={(e) => onCompanyDataChange('email', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 