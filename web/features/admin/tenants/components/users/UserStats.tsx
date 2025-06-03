interface UserStatsProps {
    totalUsers: number;
    adminCount: number;
    regularUserCount: number;
}

export function UserStats({ totalUsers, adminCount, regularUserCount }: UserStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold">{totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Administrators</p>
                <p className="text-2xl font-semibold text-indigo-600">{adminCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Regular Users</p>
                <p className="text-2xl font-semibold text-gray-600">{regularUserCount}</p>
            </div>
        </div>
    );
} 