'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Upload } from 'lucide-react';
import { useState } from 'react';

const brandingSettingsSchema = z.object({
    logoUrl: z.string().url('Invalid logo URL').or(z.string().length(0)),
    faviconUrl: z.string().url('Invalid favicon URL').or(z.string().length(0)),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    companyWebsite: z.string().url('Invalid website URL').or(z.string().length(0)),
});

type BrandingSettingsData = z.infer<typeof brandingSettingsSchema>;

export default function BrandingSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [previewFavicon, setPreviewFavicon] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty }
    } = useForm<BrandingSettingsData>({
        resolver: zodResolver(brandingSettingsSchema),
        defaultValues: {
            logoUrl: '',
            faviconUrl: '',
            primaryColor: '#4F46E5', // Indigo-600
            secondaryColor: '#4B5563', // Gray-600
            companyWebsite: '',
        }
    });

    const primaryColor = watch('primaryColor');
    const secondaryColor = watch('secondaryColor');

    const onSubmit = async (data: BrandingSettingsData) => {
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
        const file = event.target.files?.[0];
        if (!file) return;

        // TODO: Implement file upload logic
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'logo') {
                setPreviewLogo(reader.result as string);
            } else {
                setPreviewFavicon(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
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
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block">Logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-gray-800">
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-gray-400 dark:text-gray-600">No logo</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <Label
                                    htmlFor="logo-upload"
                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Logo
                                </Label>
                                <Input
                                    placeholder="Or enter logo URL"
                                    {...register('logoUrl')}
                                    className="h-10"
                                />
                                {errors.logoUrl && (
                                    <p className="text-xs text-red-500">{errors.logoUrl.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block">Favicon</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-gray-800">
                                {previewFavicon ? (
                                    <img src={previewFavicon} alt="Favicon preview" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-gray-400 dark:text-gray-600">No icon</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'favicon')}
                                    className="hidden"
                                    id="favicon-upload"
                                />
                                <Label
                                    htmlFor="favicon-upload"
                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Favicon
                                </Label>
                                <Input
                                    placeholder="Or enter favicon URL"
                                    {...register('faviconUrl')}
                                    className="h-10"
                                />
                                {errors.faviconUrl && (
                                    <p className="text-xs text-red-500">{errors.faviconUrl.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                id="primaryColor"
                                {...register('primaryColor')}
                                className="w-12 h-10 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                            />
                            <Input
                                type="text"
                                value={primaryColor}
                                {...register('primaryColor')}
                                className="h-10 flex-1"
                                placeholder="#000000"
                            />
                        </div>
                        {errors.primaryColor && (
                            <p className="text-xs text-red-500 mt-1">{errors.primaryColor.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                id="secondaryColor"
                                {...register('secondaryColor')}
                                className="w-12 h-10 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                            />
                            <Input
                                type="text"
                                value={secondaryColor}
                                {...register('secondaryColor')}
                                className="h-10 flex-1"
                                placeholder="#000000"
                            />
                        </div>
                        {errors.secondaryColor && (
                            <p className="text-xs text-red-500 mt-1">{errors.secondaryColor.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="companyWebsite">Company Website</Label>
                        <Input
                            id="companyWebsite"
                            placeholder="https://example.com"
                            {...register('companyWebsite')}
                            className="h-10"
                        />
                        {errors.companyWebsite && (
                            <p className="text-xs text-red-500 mt-1">{errors.companyWebsite.message}</p>
                        )}
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