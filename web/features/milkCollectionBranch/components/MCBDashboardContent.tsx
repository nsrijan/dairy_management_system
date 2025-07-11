import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WelcomePanel } from './panels/WelcomePanel';
import { StatsPanel } from './panels/StatsPanel';
import { RecentCollectionsPanel } from './panels/RecentCollectionsPanel';
import { ChillVatsPanel } from './panels/ChillVatsPanel';
import { MCBData } from '../types';

// Mock data for MCB manager dashboard
const mockMCBData: MCBData = {
    id: 1,
    name: "Central Collection Point",
    location: "Kathmandu, Nepal",
    phoneNumber: "+9771234567890",
    isActive: true,
    manager: {
        id: 1,
        name: "Ram Bahadur Sharma",
        username: "ram.sharma",
        email: "ram.sharma@dairy.com",
        phone: "+9779876543210"
    },
    todaysStats: {
        totalCollection: 1250,
        farmersCount: 45,
        avgQuality: "A",
        fatPercentage: 4.2,
        snfPercentage: 8.8
    },
    chillVats: [
        {
            id: 1,
            name: "Main Vat 1",
            capacity: 2000,
            currentStock: 1400,
            isOperational: true,
            utilization: 70
        },
        {
            id: 2,
            name: "Main Vat 2",
            capacity: 1500,
            currentStock: 1350,
            isOperational: true,
            utilization: 90
        },
        {
            id: 3,
            name: "Storage Vat",
            capacity: 1000,
            currentStock: 200,
            isOperational: false,
            utilization: 20
        }
    ],
    currentRates: {
        rawBuy: 45.00,
        rawSell: 50.00,
        wholeBuy: 55.00,
        wholeSell: 60.00
    },
    recentCollections: [
        {
            id: 1,
            farmerName: "Hari Prasad Ghimire",
            quantity: 25,
            quality: "A",
            time: "06:30 AM",
            fatPercentage: 4.5,
            snfPercentage: 9.0
        },
        {
            id: 2,
            farmerName: "Sita Devi Thapa",
            quantity: 18,
            quality: "B",
            time: "07:15 AM",
            fatPercentage: 3.8,
            snfPercentage: 8.2
        },
        {
            id: 3,
            farmerName: "Krishna Bahadur Rai",
            quantity: 32,
            quality: "A",
            time: "08:00 AM",
            fatPercentage: 4.8,
            snfPercentage: 9.2
        }
    ]
};

interface MCBDashboardContentProps {
    mcbId?: string;
}

export function MCBDashboardContent({ mcbId }: MCBDashboardContentProps) {
    const [mcbData, setMcbData] = useState<MCBData>(mockMCBData);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // TODO: Fetch real data based on mcbId
    useEffect(() => {
        if (mcbId) {
            // Fetch MCB data from API
            // setMcbData(fetchedData);
        }
    }, [mcbId]);

    return (
        <div className="space-y-8">
            {/* Welcome Panel */}
            <WelcomePanel data={mcbData} currentTime={currentTime} />

            {/* Stats Panel */}
            <StatsPanel data={mcbData} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Collections */}
                <RecentCollectionsPanel
                    collections={mcbData.recentCollections}
                    showDetails={false}
                />

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <Button className="justify-start h-auto p-4" variant="outline">
                            <div className="text-left">
                                <p className="font-medium">Record New Collection</p>
                                <p className="text-sm text-muted-foreground">Add milk collection from farmer</p>
                            </div>
                        </Button>
                        <Button className="justify-start h-auto p-4" variant="outline">
                            <div className="text-left">
                                <p className="font-medium">View All Farmers</p>
                                <p className="text-sm text-muted-foreground">Manage farmer information</p>
                            </div>
                        </Button>
                        <Button className="justify-start h-auto p-4" variant="outline">
                            <div className="text-left">
                                <p className="font-medium">Generate Report</p>
                                <p className="text-sm text-muted-foreground">Daily collection report</p>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chill Vats Panel */}
            <ChillVatsPanel chillVats={mcbData.chillVats} />
        </div>
    );
} 