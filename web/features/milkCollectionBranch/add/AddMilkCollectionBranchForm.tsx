'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import { milkCollectionBranchService } from '@/features/milkCollectionBranch/services/milkCollectionBranchService';
import {
    ArrowLeft,
    MapPin,
    User,
    Building2,
    Phone,
    DollarSign,
    Droplets,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Save,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Enhanced form validation schema with better error messages
const milkCollectionBranchFormSchema = z.object({
    // Branch Info
    branchName: z.string()
        .min(1, 'Branch name is required')
        .min(3, 'Branch name must be at least 3 characters')
        .max(100, 'Branch name must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Branch name can only contain letters, numbers, spaces, hyphens, underscores, and periods'),
    location: z.string()
        .min(1, 'Location is required')
        .min(5, 'Please provide a detailed location')
        .max(200, 'Location must be less than 200 characters'),
    phoneNumber: z.string()
        .regex(/^\+977[0-9]{10}$/, 'Phone number must be in format +977XXXXXXXXXX (13 digits total)'),
    isActive: z.boolean(),

    // Milk Collection Branch Manager
    managerName: z.string()
        .min(1, 'Manager name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    managerUsername: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .refine(val => !val.includes(' '), 'Username cannot contain spaces'),
    managerPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    // Milk Pricing
    rawMilkBuyRate: z.number()
        .min(0.01, 'Buy rate must be greater than 0')
        .max(1000, 'Buy rate seems too high, please check'),
    rawMilkSaleRate: z.number()
        .min(0.01, 'Sale rate must be greater than 0')
        .max(1000, 'Sale rate seems too high, please check'),
    wholeMilkBuyRate: z.number()
        .min(0.01, 'Buy rate must be greater than 0')
        .max(1000, 'Buy rate seems too high, please check'),
    wholeMilkSaleRate: z.number()
        .min(0.01, 'Sale rate must be greater than 0')
        .max(1000, 'Sale rate seems too high, please check'),

    // Chill Vats
    chillVats: z.array(z.object({
        name: z.string()
            .min(1, 'Vat name is required')
            .max(50, 'Vat name must be less than 50 characters'),
        capacity: z.number()
            .min(100, 'Capacity must be at least 100 liters')
            .max(50000, 'Capacity cannot exceed 50,000 liters'),
    }))
        .min(1, 'At least one chill vat is required')
        .max(20, 'Maximum 20 chill vats allowed')
        .refine(
            (vats) => {
                const names = vats.map(v => v.name.toLowerCase());
                return new Set(names).size === names.length;
            },
            'Vat names must be unique'
        ),
})
    .refine(
        (data) => data.rawMilkSaleRate >= data.rawMilkBuyRate,
        {
            message: 'Sale rate must be greater than or equal to buy rate',
            path: ['rawMilkSaleRate'],
        }
    )
    .refine(
        (data) => data.wholeMilkSaleRate >= data.wholeMilkBuyRate,
        {
            message: 'Sale rate must be greater than or equal to buy rate',
            path: ['wholeMilkSaleRate'],
        }
    );

type MilkCollectionBranchFormData = z.infer<typeof milkCollectionBranchFormSchema>;

interface AddMilkCollectionBranchFormProps {
    companyId?: string;
}

export function AddMilkCollectionBranchForm({ companyId }: AddMilkCollectionBranchFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { token } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<MilkCollectionBranchFormData>({
        resolver: zodResolver(milkCollectionBranchFormSchema),
        defaultValues: {
            branchName: '',
            location: '',
            phoneNumber: '+977',
            isActive: true,
            managerName: '',
            managerUsername: '',
            managerPassword: '',
            rawMilkBuyRate: 45.00,
            rawMilkSaleRate: 50.00,
            wholeMilkBuyRate: 55.00,
            wholeMilkSaleRate: 60.00,
            chillVats: [{ name: 'Main Vat 1', capacity: 2000 }],
        },
        mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'chillVats',
    });

    const handleSubmit = async (data: MilkCollectionBranchFormData) => {
        setIsLoading(true);

        try {

            const createRequest = {
                branchName: data.branchName,
                location: data.location,
                phoneNumber: data.phoneNumber,
                isActive: data.isActive,
                managerName: data.managerName,
                managerUsername: data.managerUsername,
                managerPassword: data.managerPassword,
                chillVats: data.chillVats.map(vat => ({
                    name: vat.name,
                    capacity: vat.capacity
                })),
                rawMilkBuyRate: data.rawMilkBuyRate,
                rawMilkSaleRate: data.rawMilkSaleRate,
                wholeMilkBuyRate: data.wholeMilkBuyRate,
                wholeMilkSaleRate: data.wholeMilkSaleRate
            };

            const newMCB = await milkCollectionBranchService.createMilkCollectionBranch(token, companyId!, createRequest);

            toast({
                title: "Success!",
                description: `MCB "${data.branchName}" has been created successfully.`,
                variant: "default",
            });

            // Redirect based on context
            if (companyId) {
                router.push(`/companies/${companyId}/milkCollectionBranch/${newMCB.id}`);
            } else {
                router.push('/milkCollectionBranch');
            }

        } catch (error: any) {
            console.error('Error creating MCB:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create MCB. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addChillVat = () => {
        const newVatNumber = fields.length + 1;
        append({ name: `Vat ${newVatNumber}`, capacity: 2000 });
    };

    const removeChillVat = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const calculateTotalCapacity = () => {
        return form.watch('chillVats').reduce((total, vat) => total + (vat.capacity || 0), 0);
    };

    const calculateProfitMargin = (buyRate: number, saleRate: number) => {
        return ((saleRate - buyRate) / buyRate * 100).toFixed(2);
    };

    const getFormProgress = () => {
        const watchedFields = form.watch();
        const totalFields = [
            'branchName', 'location', 'phoneNumber', 'managerName',
            'managerUsername', 'managerPassword', 'rawMilkBuyRate',
            'rawMilkSaleRate', 'wholeMilkBuyRate', 'wholeMilkSaleRate'
        ];

        const filledFields = totalFields.filter(field => {
            const value = watchedFields[field as keyof MilkCollectionBranchFormData];
            return value !== '' && value !== null && value !== undefined;
        });

        const chillVatsFilled = watchedFields.chillVats?.every(vat => vat.name && vat.capacity > 0) ? 1 : 0;

        return Math.round(((filledFields.length + chillVatsFilled) / (totalFields.length + 1)) * 100);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const stepTitles = [
        'Branch Information',
        'Manager Details',
        'Pricing Configuration',
        'Chill Vats Setup'
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href={companyId ? `/companies/${companyId}` : '/milkCollectionBranch'}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {getFormProgress()}% Complete
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            Step {currentStep} of 4
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New MCB</h1>
                        <p className="text-gray-600 mt-1">
                            {stepTitles[currentStep - 1]}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {stepTitles.map((title, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                ${currentStep > index + 1 ? 'bg-green-500 text-white' :
                                    currentStep === index + 1 ? 'bg-blue-500 text-white' :
                                        'bg-gray-200 text-gray-600'}
                            `}>
                                {currentStep > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${currentStep === index + 1 ? 'text-blue-600' : 'text-gray-600'
                                    }`}>
                                    {title}
                                </p>
                            </div>
                            {index < stepTitles.length - 1 && (
                                <div className={`w-20 h-0.5 mx-6 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Step 1: Branch Information */}
                    {currentStep === 1 && (
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <Building2 className="h-5 w-5" />
                                    Branch Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="branchName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Branch Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Main Collection Center"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Choose a unique name for your milk collection branch
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+977XXXXXXXXXX"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Contact number for the branch
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Location *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter detailed address including city, district, and landmarks"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Provide a detailed location for easy identification
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Active Status</FormLabel>
                                                <FormDescription>
                                                    Enable this branch for milk collection operations
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Manager Details */}
                    {currentStep === 2 && (
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                                <CardTitle className="flex items-center gap-2 text-green-900">
                                    <User className="h-5 w-5" />
                                    Branch Manager Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        A new user account will be created for the branch manager with the provided credentials.
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="managerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Manager Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Full name of the branch manager
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="managerUsername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">Username *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., john.doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Username for manager login
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="managerPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Password *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter a secure password"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Must contain at least 8 characters with uppercase, lowercase, and number
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Pricing Configuration */}
                    {currentStep === 3 && (
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                                <CardTitle className="flex items-center gap-2 text-purple-900">
                                    <DollarSign className="h-5 w-5" />
                                    Milk Pricing Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Raw Milk Pricing */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Raw Milk Pricing
                                        </h3>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="rawMilkBuyRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Buy Rate (Rs/Liter) *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="45.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Rate at which you buy raw milk from farmers
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="rawMilkSaleRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Sale Rate (Rs/Liter) *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="50.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Rate at which you sell raw milk
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-900">
                                                    Profit Margin: {calculateProfitMargin(
                                                        form.watch('rawMilkBuyRate'),
                                                        form.watch('rawMilkSaleRate')
                                                    )}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Whole Milk Pricing */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            Whole Milk Pricing
                                        </h3>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="wholeMilkBuyRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Buy Rate (Rs/Liter) *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="55.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Rate at which you buy whole milk
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="wholeMilkSaleRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Sale Rate (Rs/Liter) *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="60.00"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Rate at which you sell whole milk
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-sm font-medium text-green-900">
                                                    Profit Margin: {calculateProfitMargin(
                                                        form.watch('wholeMilkBuyRate'),
                                                        form.watch('wholeMilkSaleRate')
                                                    )}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Chill Vats Setup */}
                    {currentStep === 4 && (
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                                <CardTitle className="flex items-center gap-2 text-cyan-900">
                                    <Droplets className="h-5 w-5" />
                                    Chill Vats Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Storage Vats</h3>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            Total Capacity: {calculateTotalCapacity().toLocaleString()}L
                                        </Badge>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addChillVat}
                                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Vat
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`chillVats.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">Vat Name *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="e.g., Main Vat 1"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`chillVats.${index}.capacity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium">Capacity (Liters) *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="2000"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeChillVat(index)}
                                                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Table */}
                                <div className="mt-8">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">Configuration Summary</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Vat Name</TableHead>
                                                <TableHead>Capacity (L)</TableHead>
                                                <TableHead>Percentage</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {form.watch('chillVats').map((vat, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{vat.name}</TableCell>
                                                    <TableCell>{vat.capacity?.toLocaleString() || 0}</TableCell>
                                                    <TableCell>
                                                        {((vat.capacity || 0) / calculateTotalCapacity() * 100).toFixed(1)}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-4">
                            {currentStep < 4 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Continue
                                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Creating MCB...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create MCB
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
} 