'use client';

import LocalizationSettingsForm from '@/features/tenant/components/settings/LocalizationSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LocalizationSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Localization Settings</CardTitle>
                <CardDescription>
                    Configure your organization's language, timezone, and regional preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LocalizationSettingsForm />
            </CardContent>
        </Card>
    );
} 