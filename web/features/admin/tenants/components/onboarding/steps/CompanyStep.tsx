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
            <div>
                <h3 className="text-base font-medium mb-2">Company Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Enter your company details for business operations.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-900">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="e.g., Acme Corporation"
                        value={companyData.name}
                        onChange={(e) => onCompanyDataChange('name', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-900">
                        Description
                    </label>
                    <textarea
                        placeholder="Brief description of your company"
                        value={companyData.description}
                        onChange={(e) => onCompanyDataChange('description', e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-900">
                        Address
                    </label>
                    <textarea
                        placeholder="Company address"
                        value={companyData.address}
                        onChange={(e) => onCompanyDataChange('address', e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={companyData.phone}
                            onChange={(e) => onCompanyDataChange('phone', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="company@example.com"
                            value={companyData.email}
                            onChange={(e) => onCompanyDataChange('email', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 