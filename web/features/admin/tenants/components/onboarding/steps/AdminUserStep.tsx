interface AdminUserStepProps {
    userData: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
    };
    onUserDataChange: (field: string, value: string) => void;
}

export function AdminUserStep({ userData, onUserDataChange }: AdminUserStepProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-base font-medium mb-4">Admin User Information</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-900">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                placeholder="John"
                                value={userData.firstName}
                                onChange={(e) => onUserDataChange('firstName', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-900">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                placeholder="Doe"
                                value={userData.lastName}
                                onChange={(e) => onUserDataChange('lastName', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="john.doe@example.com"
                            value={userData.email}
                            onChange={(e) => onUserDataChange('email', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            placeholder="johndoe"
                            value={userData.username}
                            onChange={(e) => onUserDataChange('username', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500">Choose a unique username for login</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={userData.password}
                            onChange={(e) => onUserDataChange('password', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-900">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={userData.confirmPassword}
                            onChange={(e) => onUserDataChange('confirmPassword', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 