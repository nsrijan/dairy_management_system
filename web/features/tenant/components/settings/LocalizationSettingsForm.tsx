'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save } from 'lucide-react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const localizationSettingsSchema = z.object({
    defaultLanguage: z.string().min(1, 'Language is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required'),
    dateFormat: z.string().min(1, 'Date format is required'),
    timeFormat: z.string().min(1, 'Time format is required'),
    numberFormat: z.string().min(1, 'Number format is required'),
});

type LocalizationSettingsData = z.infer<typeof localizationSettingsSchema>;

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ne', name: 'Nepali' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
];

const timezones = [
    { value: 'Asia/Kolkata', label: 'India (UTC+5:30)' },
    { value: 'Asia/Kathmandu', label: 'Nepal (UTC+5:45)' },
    { value: 'America/New_York', label: 'Eastern US (UTC-5/4)' },
    { value: 'Europe/London', label: 'UK (UTC+0/1)' },
    { value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
];

const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' },
];

const dateFormats = [
    { value: 'MM/dd/yyyy', label: '12/31/2023' },
    { value: 'dd/MM/yyyy', label: '31/12/2023' },
    { value: 'yyyy-MM-dd', label: '2023-12-31' },
    { value: 'dd-MMM-yyyy', label: '31-Dec-2023' },
];

const timeFormats = [
    { value: 'HH:mm:ss', label: '23:59:59 (24-hour)' },
    { value: 'hh:mm:ss a', label: '11:59:59 PM (12-hour)' },
    { value: 'HH:mm', label: '23:59 (24-hour)' },
    { value: 'hh:mm a', label: '11:59 PM (12-hour)' },
];

const numberFormats = [
    { value: '#,##0.00', label: '1,234.56' },
    { value: '#,##,##0.00', label: '1,23,456.78' },
    { value: '#.##0,00', label: '1.234,56' },
    { value: '0.00', label: '1234.56' },
];

export default function LocalizationSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty }
    } = useForm<LocalizationSettingsData>({
        resolver: zodResolver(localizationSettingsSchema),
        defaultValues: {
            defaultLanguage: 'en',
            timezone: 'Asia/Kolkata',
            currency: 'INR',
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'HH:mm:ss',
            numberFormat: '#,##0.00',
        }
    });

    const selectedLanguage = watch('defaultLanguage');
    const selectedTimezone = watch('timezone');
    const selectedCurrency = watch('currency');
    const selectedDateFormat = watch('dateFormat');
    const selectedTimeFormat = watch('timeFormat');
    const selectedNumberFormat = watch('numberFormat');

    const onSubmit = async (data: LocalizationSettingsData) => {
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
                    <Label>Default Language</Label>
                    <Select
                        value={selectedLanguage}
                        onValueChange={(value) => setValue('defaultLanguage', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.defaultLanguage && (
                        <p className="text-xs text-red-500 mt-1">{errors.defaultLanguage.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                        value={selectedTimezone}
                        onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {timezones.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.timezone && (
                        <p className="text-xs text-red-500 mt-1">{errors.timezone.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                        value={selectedCurrency}
                        onValueChange={(value) => setValue('currency', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.symbol} - {currency.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.currency && (
                        <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                        value={selectedDateFormat}
                        onValueChange={(value) => setValue('dateFormat', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                            {dateFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                    {format.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.dateFormat && (
                        <p className="text-xs text-red-500 mt-1">{errors.dateFormat.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select
                        value={selectedTimeFormat}
                        onValueChange={(value) => setValue('timeFormat', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                    {format.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.timeFormat && (
                        <p className="text-xs text-red-500 mt-1">{errors.timeFormat.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Number Format</Label>
                    <Select
                        value={selectedNumberFormat}
                        onValueChange={(value) => setValue('numberFormat', value, { shouldDirty: true })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select number format" />
                        </SelectTrigger>
                        <SelectContent>
                            {numberFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                    {format.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.numberFormat && (
                        <p className="text-xs text-red-500 mt-1">{errors.numberFormat.message}</p>
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