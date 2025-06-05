import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

interface AdminUserStepProps {
    userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    onUserDataChange: (field: string, value: string) => void;
}

export function AdminUserStep({ userData, onUserDataChange }: AdminUserStepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Admin User Setup</h3>
                <p className="text-sm text-muted-foreground">
                    Create the primary administrator account for this tenant.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            First Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                            placeholder="Enter first name"
                            value={userData.firstName}
                            onChange={(e) => onUserDataChange('firstName', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Last Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                            placeholder="Enter last name"
                            value={userData.lastName}
                            onChange={(e) => onUserDataChange('lastName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        value={userData.email}
                        onChange={(e) => onUserDataChange('email', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                        This email will be used for login and important notifications.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Password <span className="text-destructive">*</span>
                    </label>
                    <PasswordInput
                        placeholder="Create a strong password"
                        value={userData.password}
                        onChange={(e) => onUserDataChange('password', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <PasswordInput
                        placeholder="Confirm your password"
                        value={userData.confirmPassword}
                        onChange={(e) => onUserDataChange('confirmPassword', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
} 