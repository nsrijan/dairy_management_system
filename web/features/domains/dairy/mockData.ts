import { FarmerDashboardData } from './types';

// Generate mock data for the farmer dashboard
export const getMockFarmerData = (farmerId: string): FarmerDashboardData => {
    return {
        farmer: {
            id: farmerId,
            name: "Rajesh Kumar",
            farmName: "Green Valley Dairy Farm",
            location: "Anand, Gujarat",
            joinDate: "2022-03-15",
            cattleCount: 12
        },
        milkRecords: [
            { id: "mr1", date: "2023-05-21", quantity: 42, fatPercentage: 4.2, snfPercentage: 8.6, collectionCenter: "Anand Central", rate: 45, amount: 1890 },
            { id: "mr2", date: "2023-05-20", quantity: 38, fatPercentage: 4.1, snfPercentage: 8.5, collectionCenter: "Anand Central", rate: 45, amount: 1710 },
            { id: "mr3", date: "2023-05-19", quantity: 41, fatPercentage: 4.3, snfPercentage: 8.7, collectionCenter: "Anand Central", rate: 46, amount: 1886 },
            { id: "mr4", date: "2023-05-18", quantity: 40, fatPercentage: 4.0, snfPercentage: 8.4, collectionCenter: "Anand Central", rate: 44, amount: 1760 },
            { id: "mr5", date: "2023-05-17", quantity: 39, fatPercentage: 4.2, snfPercentage: 8.6, collectionCenter: "Anand Central", rate: 45, amount: 1755 },
            { id: "mr6", date: "2023-05-16", quantity: 43, fatPercentage: 4.4, snfPercentage: 8.8, collectionCenter: "Anand Central", rate: 47, amount: 2021 },
            { id: "mr7", date: "2023-05-15", quantity: 40, fatPercentage: 4.1, snfPercentage: 8.5, collectionCenter: "Anand Central", rate: 45, amount: 1800 },
        ],
        financialSummary: {
            currentBalance: 12450,
            totalMilkSales: 36750,
            totalPurchases: 24300,
            pendingPayments: 0
        },
        transactions: [
            { id: "t1", date: "2023-05-21", type: "MILK_PAYMENT", amount: 12000, description: "Milk payment for May 1-15", paymentMethod: "Bank Transfer", status: "COMPLETED" },
            { id: "t2", date: "2023-05-10", type: "SUPPLY_PURCHASE", amount: -3500, description: "Cattle feed purchase", paymentMethod: "Credit", status: "COMPLETED" },
            { id: "t3", date: "2023-05-05", type: "MILK_PAYMENT", amount: 13500, description: "Milk payment for April 16-30", paymentMethod: "Bank Transfer", status: "COMPLETED" },
            { id: "t4", date: "2023-04-28", type: "SUPPLY_PURCHASE", amount: -2800, description: "Medicine and supplements", paymentMethod: "Cash", status: "COMPLETED" },
            { id: "t5", date: "2023-04-20", type: "MILK_PAYMENT", amount: 11250, description: "Milk payment for April 1-15", paymentMethod: "Bank Transfer", status: "COMPLETED" },
            { id: "t6", date: "2023-04-12", type: "SUPPLY_PURCHASE", amount: -4500, description: "Cattle feed and equipment", paymentMethod: "Credit", status: "COMPLETED" },
        ],
        supplyPurchases: [
            { id: "sp1", date: "2023-05-10", itemName: "Premium Cattle Feed", category: "FEED", quantity: 5, unitPrice: 700, totalCost: 3500, isPaid: true },
            { id: "sp2", date: "2023-04-28", itemName: "Vitamin Supplements", category: "MEDICINE", quantity: 2, unitPrice: 800, totalCost: 1600, isPaid: true },
            { id: "sp3", date: "2023-04-28", itemName: "Deworming Medicine", category: "MEDICINE", quantity: 3, unitPrice: 400, totalCost: 1200, isPaid: true },
            { id: "sp4", date: "2023-04-12", itemName: "Standard Cattle Feed", category: "FEED", quantity: 6, unitPrice: 650, totalCost: 3900, isPaid: true },
            { id: "sp5", date: "2023-04-12", itemName: "Milking Bucket", category: "EQUIPMENT", quantity: 2, unitPrice: 300, totalCost: 600, isPaid: true },
        ],
        performanceMetrics: {
            averageDailyMilk: 40.4,
            monthlyMilkTrend: [
                { month: "Jan", amount: 1100 },
                { month: "Feb", amount: 1050 },
                { month: "Mar", amount: 1200 },
                { month: "Apr", amount: 1150 },
                { month: "May", amount: 1250 },
            ],
            qualityRating: "A",
            milkPriceHistory: [
                { month: "Jan", price: 42 },
                { month: "Feb", price: 42 },
                { month: "Mar", price: 44 },
                { month: "Apr", price: 45 },
                { month: "May", price: 45 },
            ]
        }
    };
}; 