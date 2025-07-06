'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
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
const mcbFormSchema = z.object({
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

    // MCB Manager
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

type MCBFormData = z.infer<typeof mcbFormSchema>;

interface AddMCBFormProps {
    companyId?: string;
}

export function AddMCBForm({ companyId }: AddMCBFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<MCBFormData>({
        resolver: zodResolver(mcbFormSchema),
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

    const handleSubmit = async (data: MCBFormData) => {
        setIsLoading(true);

        try {
            // Simulate API call - in real implementation, pass companyId to API
            console.log('Creating MCB for company:', companyId, 'with data:', data);
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Show success toast
            toast({
                title: "Success!",
                description: "Milk Collection Branch has been created successfully.",
                variant: "default",
            });

            // Redirect based on context
            if (companyId) {
                router.push(`/companies/${companyId}?tab=mcbs`);
            } else {
                router.push('/features/mcb/list');
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create branch. Please check your inputs and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addChillVat = () => {
        append({
            name: `Vat ${fields.length + 1}`,
            capacity: 2000,
        });
    };

    const removeChillVat = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const calculateTotalCapacity = () => {
        return fields.reduce((total, _, index) => {
            const capacity = form.watch(`chillVats.${index}.capacity`);
            return total + (capacity || 0);
        }, 0);
    };

    const calculateProfitMargin = (buyRate: number, saleRate: number) => {
        if (buyRate > 0) {
            return (((saleRate - buyRate) / buyRate) * 100).toFixed(1);
        }
        return '0.0';
    };

    // Determine back URL based on context
    const backUrl = companyId ? `/companies/${companyId}` : '/features/mcb/list';

    // Form progress calculation
    const getFormProgress = () => {
        const fields = form.watch();
        let filledFields = 0;
        let totalFields = 11; // Total required fields

        if (fields.branchName) filledFields++;
        if (fields.location) filledFields++;
        if (fields.phoneNumber && fields.phoneNumber !== '+977') filledFields++;
        if (fields.managerName) filledFields++;
        if (fields.managerUsername) filledFields++;
        if (fields.managerPassword) filledFields++;
        if (fields.rawMilkBuyRate > 0) filledFields++;
        if (fields.rawMilkSaleRate > 0) filledFields++;
        if (fields.wholeMilkBuyRate > 0) filledFields++;
        if (fields.wholeMilkSaleRate > 0) filledFields++;
        if (fields.chillVats.length > 0 && fields.chillVats[0].name) filledFields++;

        return Math.round((filledFields / totalFields) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href={backUrl}>
                            <Button variant="outline" size="icon" className="h-10 w-10 shadow-sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create New MCB
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                Set up a new Milk Collection Branch with comprehensive details
                            </p>
                        </div>
                        {/* Progress Indicator */}
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Form Progress
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                        style={{ width: `${getFormProgress()}%` }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {getFormProgress()}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            All fields marked with * are required. This branch will be linked to the selected company and can be managed from the company dashboard.
                        </AlertDescription>
                    </Alert>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        {/* Branch Information Section */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Branch Information
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                            Basic details about the milk collection branch
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="branchName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Branch Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. Kathmandu Central MCB"
                                                        disabled={isLoading}
                                                        className="h-11 text-base"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Choose a unique, descriptive name for the branch
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Location *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. New Baneshwor, Kathmandu"
                                                        disabled={isLoading}
                                                        className="h-11 text-base"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Provide the complete address of the branch
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
                                                <FormLabel className="text-base font-medium">Phone Number *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="+9779841234567"
                                                        disabled={isLoading}
                                                        className="h-11 text-base font-mono"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nepal phone number with +977 country code
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                                                <div className="space-y-1">
                                                    <FormLabel className="text-base font-medium">Branch Status</FormLabel>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {field.value ? (
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <span>Branch will be active and operational</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                                                <span>Branch will be inactive initially</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="data-[state=checked]:bg-green-600"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* MCB Manager Section */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Branch Manager
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                            Manager account details and credentials
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="managerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Manager Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. Ram Bahadur Sharma"
                                                        disabled={isLoading}
                                                        className="h-11 text-base"
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
                                                <FormLabel className="text-base font-medium">Username *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. ram_sharma"
                                                        disabled={isLoading}
                                                        className="h-11 text-base font-mono"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Unique login username (letters, numbers, underscores)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="managerPassword"
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel className="text-base font-medium">Password *</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Create a secure password"
                                                            disabled={isLoading}
                                                            className="h-11 text-base pr-12"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
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
                                                    Must include uppercase, lowercase, and number (minimum 8 characters)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Milk Pricing Section */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Milk Pricing Configuration
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                            Set buy and sell rates for different milk types
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                                <TableHead className="w-40 font-semibold">Milk Type</TableHead>
                                                <TableHead className="text-center font-semibold">Buy Rate (NPR/Liter)</TableHead>
                                                <TableHead className="text-center font-semibold">Sale Rate (NPR/Liter)</TableHead>
                                                <TableHead className="text-center font-semibold">Profit Margin</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        Raw Milk
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="rawMilkBuyRate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        placeholder="45.00"
                                                                        disabled={isLoading}
                                                                        className="text-center font-mono"
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="rawMilkSaleRate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        placeholder="50.00"
                                                                        disabled={isLoading}
                                                                        className="text-center font-mono"
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                                        {calculateProfitMargin(form.watch('rawMilkBuyRate'), form.watch('rawMilkSaleRate'))}%
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        Whole Milk
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="wholeMilkBuyRate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        placeholder="55.00"
                                                                        disabled={isLoading}
                                                                        className="text-center font-mono"
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="wholeMilkSaleRate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        step="0.01"
                                                                        min="0"
                                                                        placeholder="60.00"
                                                                        disabled={isLoading}
                                                                        className="text-center font-mono"
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                                                        {calculateProfitMargin(form.watch('wholeMilkBuyRate'), form.watch('wholeMilkSaleRate'))}%
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        💡 <strong>Tip:</strong> Ensure sale rates are higher than buy rates to maintain profitability. Standard margins in Nepal range from 10-20%.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chill Vats Section */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                                        <Droplets className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Chill Vats Configuration
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                            Define storage vats for milk collection
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Capacity</div>
                                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                                            {calculateTotalCapacity().toLocaleString()}L
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                                                        <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                    <FormField
                                                        control={form.control}
                                                        name={`chillVats.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-sm font-medium">Vat Name *</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="e.g. Main Storage Vat A"
                                                                        disabled={isLoading}
                                                                        className="bg-white dark:bg-gray-700"
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
                                                                        {...field}
                                                                        type="number"
                                                                        min="100"
                                                                        max="50000"
                                                                        placeholder="2000"
                                                                        disabled={isLoading}
                                                                        className="bg-white dark:bg-gray-700 font-mono"
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeChillVat(index)}
                                                    disabled={fields.length === 1 || isLoading}
                                                    className="h-10 w-10 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addChillVat}
                                        disabled={isLoading || fields.length >= 20}
                                        className="w-full h-12 border-dashed border-2 border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-800 dark:hover:border-cyan-700 dark:hover:bg-cyan-950"
                                    >
                                        <Plus className="h-5 w-5 mr-2 text-cyan-600" />
                                        <span className="text-cyan-700 dark:text-cyan-400 font-medium">
                                            Add Another Chill Vat ({fields.length}/20)
                                        </span>
                                    </Button>
                                </div>

                                {fields.length > 0 && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-cyan-900 dark:text-cyan-100">Storage Summary</h4>
                                                <p className="text-sm text-cyan-700 dark:text-cyan-300">
                                                    {fields.length} vat{fields.length !== 1 ? 's' : ''} configured
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                                                    {calculateTotalCapacity().toLocaleString()}L
                                                </div>
                                                <div className="text-sm text-cyan-700 dark:text-cyan-300">
                                                    Total Capacity
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Enhanced Submit Section */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                            <CardContent className="pt-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Ready to Create Branch?</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Review your information and submit to create the MCB
                                        </p>
                                    </div>
                                    <div className="flex space-x-4 w-full sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push(backUrl)}
                                            disabled={isLoading}
                                            className="flex-1 sm:flex-none"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg flex-1 sm:flex-none"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                    Creating Branch...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5 mr-2" />
                                                    Create Branch
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    );
} 