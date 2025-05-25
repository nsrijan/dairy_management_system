'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save } from 'lucide-react';
import { useState } from 'react';

const generalSettingsSchema = z.object({
    contactEmail: z.string().email('Invalid email format'),
    contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    contactAddress: z.string().min(1, 'Address is required'),
    businessHours: z.string().min(1, 'Business hours are required'),
    fiscalYearStart: z.string().regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Must be in MM-DD format'),
    fiscalYearEnd: z.string().regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'Must be in MM-DD format'),
});

type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;

export default function GeneralSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm<GeneralSettingsData>({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues: {
            contactEmail: '',
            contactPhone: '',
            contactAddress: '',
            businessHours: '',
            fiscalYearStart: '04-01', // Default fiscal year start (April 1st)
            fiscalYearEnd: '03-31', // Default fiscal year end (March 31st)
        }
    });

    const onSubmit = async (data: GeneralSettingsData) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@example.com"
                        {...register('contactEmail')}
                        className="h-10"
                    />
                    {errors.contactEmail && (
                        <p className="text-xs text-red-500 mt-1">{errors.contactEmail.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                        id="contactPhone"
                        placeholder="+1234567890"
                        {...register('contactPhone')}
                        className="h-10"
                    />
                    {errors.contactPhone && (
                        <p className="text-xs text-red-500 mt-1">{errors.contactPhone.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="contactAddress">Business Address</Label>
                <Textarea
                    id="contactAddress"
                    placeholder="Enter your business address"
                    {...register('contactAddress')}
                    className="min-h-[100px] resize-y"
                />
                {errors.contactAddress && (
                    <p className="text-xs text-red-500 mt-1">{errors.contactAddress.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Textarea
                    id="businessHours"
                    placeholder="e.g., Mon-Fri: 9:00 AM - 6:00 PM&#13;&#10;Sat: 10:00 AM - 4:00 PM&#13;&#10;Sun: Closed"
                    {...register('businessHours')}
                    className="min-h-[100px] resize-y"
                />
                {errors.businessHours && (
                    <p className="text-xs text-red-500 mt-1">{errors.businessHours.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                    <Input
                        id="fiscalYearStart"
                        placeholder="MM-DD"
                        {...register('fiscalYearStart')}
                        className="h-10"
                    />
                    {errors.fiscalYearStart && (
                        <p className="text-xs text-red-500 mt-1">{errors.fiscalYearStart.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                    <Input
                        id="fiscalYearEnd"
                        placeholder="MM-DD"
                        {...register('fiscalYearEnd')}
                        className="h-10"
                    />
                    {errors.fiscalYearEnd && (
                        <p className="text-xs text-red-500 mt-1">{errors.fiscalYearEnd.message}</p>
                    )}
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