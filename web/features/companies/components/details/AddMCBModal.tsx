'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, MapPin, User, Droplets } from 'lucide-react';
import { MilkCollectionBranch, ChillVat, CompanyUser } from '../../types';

interface ChillVatInput {
    id: string;
    name: string;
    capacity: number;
}

interface AddMCBModalProps {
    companyId: string;
    onSuccess?: (mcb: MilkCollectionBranch) => void;
}

// Mock MCB managers - replace with actual API call
const mockMCBManagers: CompanyUser[] = [
    {
        id: 'user-1',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@company.com',
        role: 'MCB_MANAGER',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'user-2',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@company.com',
        role: 'MCB_MANAGER',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'user-3',
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@company.com',
        role: 'MCB_MANAGER',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
    }
];

export function AddMCBModal({ companyId, onSuccess }: AddMCBModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        managerId: '',
        contactNumber: '',
        vatCount: 1
    });
    const [chillVats, setChillVats] = useState<ChillVatInput[]>([
        { id: 'vat-1', name: 'Vat 1', capacity: 1000 }
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleVatCountChange = (count: number) => {
        const newCount = Math.max(1, Math.min(20, count)); // Limit between 1-20 vats
        setFormData(prev => ({ ...prev, vatCount: newCount }));

        // Adjust chill vats array
        const currentVats = [...chillVats];
        if (newCount > currentVats.length) {
            // Add new vats
            for (let i = currentVats.length; i < newCount; i++) {
                currentVats.push({
                    id: `vat-${i + 1}`,
                    name: `Vat ${i + 1}`,
                    capacity: 1000
                });
            }
        } else if (newCount < currentVats.length) {
            // Remove excess vats
            currentVats.splice(newCount);
        }
        setChillVats(currentVats);
    };

    const updateChillVat = (index: number, field: 'name' | 'capacity', value: string | number) => {
        const updated = [...chillVats];
        updated[index] = { ...updated[index], [field]: value };
        setChillVats(updated);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'MCB name is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        if (!formData.managerId) {
            newErrors.managerId = 'Manager selection is required';
        }
        if (formData.contactNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Please enter a valid contact number';
        }

        // Validate chill vats
        chillVats.forEach((vat, index) => {
            if (!vat.name.trim()) {
                newErrors[`vat-${index}-name`] = `Vat ${index + 1} name is required`;
            }
            if (!vat.capacity || vat.capacity <= 0) {
                newErrors[`vat-${index}-capacity`] = `Vat ${index + 1} capacity must be greater than 0`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Mock API call - replace with actual API
            const newMCB: MilkCollectionBranch = {
                id: `mcb-${Date.now()}`,
                name: formData.name,
                location: formData.location,
                companyId,
                managerId: formData.managerId,
                chillVatCount: chillVats.length,
                isActive: true,
                contactNumber: formData.contactNumber,
                capacity: chillVats.reduce((total, vat) => total + vat.capacity, 0),
                currentStock: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                chillVats: chillVats.map(vat => ({
                    id: `${Date.now()}-${vat.id}`,
                    name: vat.name,
                    mcbId: `mcb-${Date.now()}`,
                    capacity: vat.capacity,
                    currentStock: 0,
                    isOperational: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }))
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSuccess?.(newMCB);

            // Reset form
            setFormData({
                name: '',
                location: '',
                managerId: '',
                contactNumber: '',
                vatCount: 1
            });
            setChillVats([{ id: 'vat-1', name: 'Vat 1', capacity: 1000 }]);
            setErrors({});
            setOpen(false);
        } catch (error) {
            console.error('Error creating MCB:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedManager = mockMCBManagers.find(manager => manager.id === formData.managerId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add MCB
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Add New Milk Collection Branch
                    </DialogTitle>
                    <DialogDescription>
                        Create a new milk collection branch with chill vat configurations. All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">MCB Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Central Collection Hub"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Mumbai, Maharashtra"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className={errors.location ? 'border-red-500' : ''}
                                />
                                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager">MCB Manager *</Label>
                                <Select value={formData.managerId} onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}>
                                    <SelectTrigger className={errors.managerId ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockMCBManagers.map((manager) => (
                                            <SelectItem key={manager.id} value={manager.id}>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {manager.firstName} {manager.lastName}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.managerId && <p className="text-sm text-red-500">{errors.managerId}</p>}
                                {selectedManager && (
                                    <p className="text-xs text-gray-500">{selectedManager.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Number</Label>
                                <Input
                                    id="contact"
                                    placeholder="e.g., +91-9876543210"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                                    className={errors.contactNumber ? 'border-red-500' : ''}
                                />
                                {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Chill Vats Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-600" />
                                Chill Vats Configuration
                            </h3>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="vatCount" className="text-sm">Number of Vats:</Label>
                                <Input
                                    id="vatCount"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.vatCount}
                                    onChange={(e) => handleVatCountChange(parseInt(e.target.value) || 1)}
                                    className="w-20"
                                />
                            </div>
                        </div>

                        <Card className="bg-gray-50 dark:bg-gray-800/50">
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {chillVats.map((vat, index) => (
                                        <div key={vat.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                                            <div className="space-y-2">
                                                <Label htmlFor={`vat-${index}-name`} className="text-xs">
                                                    Vat {index + 1} Name *
                                                </Label>
                                                <Input
                                                    id={`vat-${index}-name`}
                                                    placeholder={`Vat ${index + 1}`}
                                                    value={vat.name}
                                                    onChange={(e) => updateChillVat(index, 'name', e.target.value)}
                                                    className={errors[`vat-${index}-name`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`vat-${index}-name`] && (
                                                    <p className="text-xs text-red-500">{errors[`vat-${index}-name`]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`vat-${index}-capacity`} className="text-xs">
                                                    Capacity (Liters) *
                                                </Label>
                                                <Input
                                                    id={`vat-${index}-capacity`}
                                                    type="number"
                                                    min="1"
                                                    placeholder="1000"
                                                    value={vat.capacity}
                                                    onChange={(e) => updateChillVat(index, 'capacity', parseInt(e.target.value) || 0)}
                                                    className={errors[`vat-${index}-capacity`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`vat-${index}-capacity`] && (
                                                    <p className="text-xs text-red-500">{errors[`vat-${index}-capacity`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                            Total Capacity:
                                        </span>
                                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                            {chillVats.reduce((total, vat) => total + (vat.capacity || 0), 0).toLocaleString()} L
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create MCB
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 