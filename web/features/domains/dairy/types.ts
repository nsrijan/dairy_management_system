// Types for farmer dashboard data
export interface FarmerDashboardData {
    farmer: Farmer;
    milkRecords: MilkRecord[];
    financialSummary: FinancialSummary;
    transactions: Transaction[];
    supplyPurchases: SupplyPurchase[];
    performanceMetrics: PerformanceMetrics;
}

export interface Farmer {
    id: string;
    name: string;
    farmName: string;
    location: string;
    joinDate: string;
    cattleCount: number;
}

export interface MilkRecord {
    id: string;
    date: string;
    quantity: number; // in liters
    fatPercentage: number;
    snfPercentage: number;
    collectionCenter: string;
    rate: number; // rate per liter
    amount: number; // total amount
}

export interface FinancialSummary {
    currentBalance: number; // can be negative if farmer owes money
    totalMilkSales: number; // total earned from milk
    totalPurchases: number; // total spent on supplies
    pendingPayments: number;
}

export interface Transaction {
    id: string;
    date: string;
    type: 'MILK_PAYMENT' | 'SUPPLY_PURCHASE' | 'CASH_ADVANCE';
    amount: number;
    description: string;
    paymentMethod: string;
    status: 'COMPLETED' | 'PENDING';
}

export interface SupplyPurchase {
    id: string;
    date: string;
    itemName: string;
    category: 'FEED' | 'MEDICINE' | 'EQUIPMENT' | 'OTHER';
    quantity: number;
    unitPrice: number;
    totalCost: number;
    isPaid: boolean;
}

export interface PerformanceMetrics {
    averageDailyMilk: number;
    monthlyMilkTrend: { month: string; amount: number }[];
    qualityRating: 'A' | 'B' | 'C'; // based on fat content and other factors
    milkPriceHistory: { month: string; price: number }[];
} 