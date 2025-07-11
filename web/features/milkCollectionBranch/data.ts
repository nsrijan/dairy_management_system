// Types for the Milk Collection Branch data
export type Collection = {
    id: string;
    time: string;
    farmer: string;
    quantity: number;
    quality: string;
    fat: number;
    snf: number;
}

export type MilkCollectionBranch = {
    id: string;
    name: string;
    location: string;
    activeFarmers: number;
    todaysCollection: number;
    avgQuality: string;
    status: string;
    collectionTrend: string;
    lastUpdated: string;
    coordinates: string;
    manager: string;
    contact: string;
    establishment: string;
    stats?: {
        weeklyAvg: number;
        monthlyTotal: number;
        topSupplier: string;
        qualityDistribution: {
            A: number;
            B: number;
            C: number;
        };
        collectionByDay: Array<{ day: string; liters: number }>;
        recentCollections: Collection[];
    }
}

// Sample Milk Collection Branch data 
export const milkCollectionBranchData: MilkCollectionBranch[] = [
    {
        id: '1',
        name: 'North Region MCB',
        location: 'Jaipur, Rajasthan',
        activeFarmers: 152,
        todaysCollection: 1250,
        avgQuality: 'A',
        status: 'active',
        collectionTrend: 'up',
        lastUpdated: '10 minutes ago',
        coordinates: '26.9124° N, 75.7873° E',
        manager: 'Amit Sharma',
        contact: '+91 98765 43210',
        establishment: '15 Jan 2020',
        stats: {
            weeklyAvg: 1180,
            monthlyTotal: 35400,
            topSupplier: 'Green Valley Farms',
            qualityDistribution: {
                A: 76,
                B: 18,
                C: 6
            },
            collectionByDay: [
                { day: 'Mon', liters: 1180 },
                { day: 'Tue', liters: 1250 },
                { day: 'Wed', liters: 1130 },
                { day: 'Thu', liters: 1310 },
                { day: 'Fri', liters: 1190 },
                { day: 'Sat', liters: 1080 },
                { day: 'Sun', liters: 950 },
            ],
            recentCollections: [
                { id: 'C1001', time: '07:30 AM', farmer: 'Rajesh Kumar', quantity: 45, quality: 'A', fat: 4.2, snf: 8.6 },
                { id: 'C1002', time: '08:15 AM', farmer: 'Meena Devi', quantity: 32, quality: 'A', fat: 4.5, snf: 8.8 },
                { id: 'C1003', time: '08:45 AM', farmer: 'Harish Singh', quantity: 28, quality: 'B', fat: 3.8, snf: 8.2 },
                { id: 'C1004', time: '09:20 AM', farmer: 'Priya Sharma', quantity: 52, quality: 'A', fat: 4.3, snf: 8.7 },
                { id: 'C1005', time: '10:05 AM', farmer: 'Sunil Verma', quantity: 38, quality: 'A', fat: 4.1, snf: 8.5 },
            ]
        }
    },
    {
        id: '2',
        name: 'South District MCB',
        location: 'Bangalore, Karnataka',
        activeFarmers: 128,
        todaysCollection: 980,
        avgQuality: 'A',
        status: 'active',
        collectionTrend: 'up',
        lastUpdated: '25 minutes ago',
        coordinates: '12.9716° N, 77.5946° E',
        manager: 'Kiran Reddy',
        contact: '+91 87654 32109',
        establishment: '03 Mar 2021'
    },
    {
        id: '3',
        name: 'East Zone Collection',
        location: 'Kolkata, West Bengal',
        activeFarmers: 87,
        todaysCollection: 750,
        avgQuality: 'B',
        status: 'active',
        collectionTrend: 'down',
        lastUpdated: '45 minutes ago',
        coordinates: '22.5726° N, 88.3639° E',
        manager: 'Anjali Das',
        contact: '+91 76543 21098',
        establishment: '12 Jun 2019'
    },
    {
        id: '4',
        name: 'Western MCB',
        location: 'Mumbai, Maharashtra',
        activeFarmers: 143,
        todaysCollection: 1180,
        avgQuality: 'A',
        status: 'active',
        collectionTrend: 'up',
        lastUpdated: '30 minutes ago',
        coordinates: '19.0760° N, 72.8777° E',
        manager: 'Vikram Patil',
        contact: '+91 65432 10987',
        establishment: '22 Aug 2020'
    },
    {
        id: '5',
        name: 'Central Collection Center',
        location: 'Bhopal, Madhya Pradesh',
        activeFarmers: 76,
        todaysCollection: 630,
        avgQuality: 'B',
        status: 'maintenance',
        collectionTrend: 'down',
        lastUpdated: '2 hours ago',
        coordinates: '23.2599° N, 77.4126° E',
        manager: 'Sanjay Verma',
        contact: '+91 54321 09876',
        establishment: '05 Dec 2021'
    },
    {
        id: '6',
        name: 'Northern Hills MCB',
        location: 'Shimla, Himachal Pradesh',
        activeFarmers: 45,
        todaysCollection: 420,
        avgQuality: 'A',
        status: 'active',
        collectionTrend: 'up',
        lastUpdated: '1 hour ago',
        coordinates: '31.1048° N, 77.1734° E',
        manager: 'Rajinder Singh',
        contact: '+91 43210 98765',
        establishment: '18 Apr 2022'
    }
];

// Function to get Milk Collection Branch by ID
export function getMilkCollectionBranchById(id: string): MilkCollectionBranch | undefined {
    return milkCollectionBranchData.find(mcb => mcb.id === id);
} 