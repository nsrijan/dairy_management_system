'use client';

import BrandingSettingsForm from '@/features/tenant/components/settings/BrandingSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrandingSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                    Customize your organization's visual identity with logos, colors, and branding elements.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BrandingSettingsForm />
            </CardContent>
        </Card>
    );
} 