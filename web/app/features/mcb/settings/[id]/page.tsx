'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Map, 
  User, 
  Phone, 
  Calendar, 
  AlarmClock,
  Droplet,
  Users,
  ClipboardCheck,
  Bell,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getMCBById } from '../../data';

export default function MCBSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const mcb = getMCBById(id);

  const [formData, setFormData] = useState({
    name: mcb?.name || '',
    location: mcb?.location || '',
    manager: mcb?.manager || '',
    contact: mcb?.contact || '',
    coordinates: mcb?.coordinates || '',
    status: mcb?.status || 'active',
    // Additional settings
    openingTime: '06:00',
    closingTime: '18:00',
    acceptMilkOnHolidays: true,
    qualityControlEnabled: true,
    automaticSMSReminders: true,
    paymentProcessingTime: 'same-day',
    priceUpdateNotifications: true,
    maintenanceSchedule: 'monthly',
    securityLevel: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    // In a real app, this would send the data to the backend
    console.log('Saving MCB settings:', formData);
    // Show success notification and redirect back
    router.push(`/features/mcb/details/${id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this MCB? This action cannot be undone.')) {
      // In a real app, this would send a delete request to the backend
      console.log('Deleting MCB:', id);
      router.push('/features/mcb/list');
    }
  };

  if (!mcb) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">MCB Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The milk collection branch you're looking for doesn't exist or has been removed.</p>
        <Link href="/features/mcb/list">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to MCB List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/features/mcb/details/${id}`}>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">MCB Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Configure {mcb.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="destructive" 
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete MCB
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto gap-4 bg-transparent">
          <TabsTrigger value="general" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            General
          </TabsTrigger>
          <TabsTrigger value="operations" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            Operations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 data-[state=active]:border-teal-500 dark:data-[state=active]:border-teal-400 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400">
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="pt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic details about the milk collection branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">MCB Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter MCB name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Address</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    placeholder="Enter full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordinates">GPS Coordinates</Label>
                  <Input 
                    id="coordinates" 
                    name="coordinates" 
                    value={formData.coordinates} 
                    onChange={handleInputChange} 
                    placeholder="Latitude, Longitude"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager Name</Label>
                  <Input 
                    id="manager" 
                    name="manager" 
                    value={formData.manager} 
                    onChange={handleInputChange} 
                    placeholder="Enter manager's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input 
                    id="contact" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleInputChange} 
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityLevel">Security Level</Label>
                    <Select 
                      value={formData.securityLevel} 
                      onValueChange={(value) => handleSelectChange('securityLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enhanced">Enhanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Determines the security protocols for this branch
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Settings */}
        <TabsContent value="operations" className="pt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Operation Settings</CardTitle>
              <CardDescription>
                Configure how this branch operates on a daily basis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input 
                    id="openingTime" 
                    name="openingTime" 
                    type="time" 
                    value={formData.openingTime} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input 
                    id="closingTime" 
                    name="closingTime" 
                    type="time" 
                    value={formData.closingTime} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Accept Milk on Holidays</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow milk collection on public holidays</p>
                  </div>
                  <Switch 
                    checked={formData.acceptMilkOnHolidays} 
                    onCheckedChange={(checked) => handleSwitchChange('acceptMilkOnHolidays', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Quality Control</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable strict quality testing for all milk</p>
                  </div>
                  <Switch 
                    checked={formData.qualityControlEnabled} 
                    onCheckedChange={(checked) => handleSwitchChange('qualityControlEnabled', checked)} 
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Payment Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="paymentProcessingTime">Payment Processing Time</Label>
                  <Select 
                    value={formData.paymentProcessingTime} 
                    onValueChange={(value) => handleSelectChange('paymentProcessingTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same-day">Same Day</SelectItem>
                      <SelectItem value="next-day">Next Day</SelectItem>
                      <SelectItem value="weekly">Weekly (Every Friday)</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    When farmers will receive payments for their milk
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Maintenance Schedule</h3>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceSchedule">Equipment Maintenance</Label>
                  <Select 
                    value={formData.maintenanceSchedule} 
                    onValueChange={(value) => handleSelectChange('maintenanceSchedule', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintenance schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    How often equipment should be serviced
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="pt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure alerts and notifications for this branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic SMS Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send SMS reminders to farmers for milk collection</p>
                  </div>
                  <Switch 
                    checked={formData.automaticSMSReminders} 
                    onCheckedChange={(checked) => handleSwitchChange('automaticSMSReminders', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Price Update Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notify farmers when milk prices change</p>
                  </div>
                  <Switch 
                    checked={formData.priceUpdateNotifications} 
                    onCheckedChange={(checked) => handleSwitchChange('priceUpdateNotifications', checked)} 
                  />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Thresholds</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure when the system should alert branch managers
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="lowQualityThreshold">Low Quality Alert Threshold (%)</Label>
                      <Input 
                        id="lowQualityThreshold" 
                        type="number" 
                        placeholder="e.g., 10" 
                        defaultValue="10" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Alert when more than this percentage of milk is below Grade A
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectionDropThreshold">Collection Drop Alert (%)</Label>
                      <Input 
                        id="collectionDropThreshold" 
                        type="number" 
                        placeholder="e.g., 15" 
                        defaultValue="15" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Alert when collection drops by more than this percentage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons (Bottom) */}
      <div className="flex justify-end gap-3 pt-6">
        <Link href={`/features/mcb/details/${id}`}>
          <Button variant="outline">
            Cancel
          </Button>
        </Link>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
} 