'use client';

import GeneralSettingsForm from '@/features/tenant/components/settings/GeneralSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GeneralSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Manage your organization's general information and contact details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GeneralSettingsForm />
            </CardContent>
        </Card>
    );
} 