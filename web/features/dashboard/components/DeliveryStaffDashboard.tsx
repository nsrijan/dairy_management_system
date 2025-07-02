import React from 'react';
import { StatCard } from './StatCard';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface DeliveryStaffDashboardProps {
    user: User;
    tenant?: string | null;
}

export function DeliveryStaffDashboard({ user, tenant }: DeliveryStaffDashboardProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {user.name}
                </h2>
                <p className="text-gray-600">
                    {tenant ? `Managing ${tenant} delivery operations` : 'Managing delivery operations'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Deliveries"
                    value="24"
                    change="+3"
                    changeType="positive"
                    icon="🚚"
                />
                <StatCard
                    title="Completed Routes"
                    value="18"
                    change="+2"
                    changeType="positive"
                    icon="✅"
                />
                <StatCard
                    title="Pending Deliveries"
                    value="6"
                    change="-1"
                    changeType="positive"
                    icon="⏳"
                />
                <StatCard
                    title="On-Time Rate"
                    value="96%"
                    change="+1.5%"
                    changeType="positive"
                    icon="🎯"
                />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Route</h3>
                <div className="space-y-3">
                    {[
                        { customer: 'Hotel Sunrise', address: 'MG Road', status: 'Completed', time: '08:30 AM' },
                        { customer: 'ABC Restaurant', address: 'Park Street', status: 'Completed', time: '09:15 AM' },
                        { customer: 'Cafe Delight', address: 'Mall Road', status: 'In Progress', time: '10:00 AM' },
                        { customer: 'Royal Hotel', address: 'Station Road', status: 'Pending', time: '11:30 AM' },
                    ].map((delivery, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                                <h4 className="font-medium">{delivery.customer}</h4>
                                <p className="text-sm text-gray-600">{delivery.address}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${delivery.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    delivery.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {delivery.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{delivery.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
