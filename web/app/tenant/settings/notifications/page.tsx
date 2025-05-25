'use client';

import NotificationSettingsForm from '@/features/tenant/components/settings/NotificationSettingsForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationSettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                    Manage your organization's email, SMS, and push notification preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationSettingsForm />
            </CardContent>
        </Card>
    );
} 