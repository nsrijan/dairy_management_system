import React from 'react';

interface Activity {
    id: string;
    type: 'user' | 'system' | 'milk' | 'payment';
    message: string;
    timestamp: string;
    user?: string;
}

export function ActivityFeed() {
    // Mock data - in real app, this would come from props or API
    const activities: Activity[] = [
        {
            id: '1',
            type: 'milk',
            message: 'New milk collection recorded - 245L',
            timestamp: '2 minutes ago',
            user: 'Branch Manager'
        },
        {
            id: '2',
            type: 'user',
            message: 'New farmer registered: Rajesh Kumar',
            timestamp: '15 minutes ago',
            user: 'System'
        },
        {
            id: '3',
            type: 'payment',
            message: 'Payment processed for 12 farmers',
            timestamp: '1 hour ago',
            user: 'Finance Manager'
        },
        {
            id: '4',
            type: 'system',
            message: 'Daily backup completed successfully',
            timestamp: '2 hours ago',
            user: 'System'
        }
    ];

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'milk':
                return '🥛';
            case 'user':
                return '👤';
            case 'payment':
                return '💰';
            case 'system':
                return '⚙️';
            default:
                return '📋';
        }
    };

    const getActivityColor = (type: Activity['type']) => {
        switch (type) {
            case 'milk':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-green-100 text-green-800';
            case 'payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'system':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                            <span className="mr-1">{getActivityIcon(activity.type)}</span>
                            {activity.type.toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span>{activity.timestamp}</span>
                                {activity.user && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span>{activity.user}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All Activities →
                </button>
            </div>
        </div>
    );
} 