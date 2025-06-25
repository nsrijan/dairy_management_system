import React from 'react';

interface ChartCardProps {
    title: string;
    description?: string;
    type: 'line' | 'bar' | 'pie' | 'area';
    data?: any[];
}

export function ChartCard({ title, description, type }: ChartCardProps) {
    const getChartPlaceholder = () => {
        switch (type) {
            case 'line':
                return (
                    <div className="flex items-end space-x-1 h-32">
                        {[40, 65, 45, 80, 60, 75, 90, 55, 70, 85].map((height, index) => (
                            <div
                                key={index}
                                className="bg-blue-500 rounded-t flex-1"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                );
            case 'pie':
                return (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold">Chart</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                        <span className="text-gray-500">Chart Placeholder</span>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                )}
            </div>

            {getChartPlaceholder()}

            <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                    View Details →
                </button>
            </div>
        </div>
    );
} 