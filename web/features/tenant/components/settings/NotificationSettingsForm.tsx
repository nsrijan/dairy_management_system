'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save } from 'lucide-react';
import { useState } from 'react';

const notificationSettingsSchema = z.object({
    enableNotifications: z.boolean(),
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    emailFooterText: z.string().optional(),
    emailSignature: z.string().optional(),
});

type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;

export default function NotificationSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty }
    } = useForm<NotificationSettingsData>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            enableNotifications: true,
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            emailFooterText: '',
            emailSignature: '',
        }
    });

    const enableNotifications = watch('enableNotifications');
    const emailNotifications = watch('emailNotifications');
    const smsNotifications = watch('smsNotifications');
    const pushNotifications = watch('pushNotifications');

    const onSubmit = async (data: NotificationSettingsData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // TODO: Implement API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
            console.error('Error saving settings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    <AlertDescription>Settings saved successfully!</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Enable Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Turn on/off all notifications for this tenant
                        </p>
                    </div>
                    <Switch
                        checked={enableNotifications}
                        onCheckedChange={(checked) => setValue('enableNotifications', checked, { shouldDirty: true })}
                        className="data-[state=checked]:bg-indigo-600"
                    />
                </div>

                <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={(checked) => setValue('emailNotifications', checked, { shouldDirty: true })}
                            disabled={!enableNotifications}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive notifications via SMS
                            </p>
                        </div>
                        <Switch
                            checked={smsNotifications}
                            onCheckedChange={(checked) => setValue('smsNotifications', checked, { shouldDirty: true })}
                            disabled={!enableNotifications}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive push notifications in browser/app
                            </p>
                        </div>
                        <Switch
                            checked={pushNotifications}
                            onCheckedChange={(checked) => setValue('pushNotifications', checked, { shouldDirty: true })}
                            disabled={!enableNotifications}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                </div>

                <div className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Email Footer Text</Label>
                        <Textarea
                            {...register('emailFooterText')}
                            placeholder="Enter text to appear at the bottom of all emails"
                            className="min-h-[100px] resize-y"
                            disabled={!enableNotifications || !emailNotifications}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Email Signature</Label>
                        <Textarea
                            {...register('emailSignature')}
                            placeholder="Enter signature for all outgoing emails"
                            className="min-h-[100px] resize-y"
                            disabled={!enableNotifications || !emailNotifications}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={loading || !isDirty}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-10"
                >
                    {loading ? (
                        'Saving...'
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}