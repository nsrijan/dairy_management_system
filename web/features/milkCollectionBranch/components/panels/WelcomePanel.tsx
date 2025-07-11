import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MCBData } from '../../types';
import { MapPin, Phone, Clock, Settings } from 'lucide-react';

interface WelcomePanelProps {
    data: MCBData;
    currentTime: Date;
}

export function WelcomePanel({ data, currentTime }: WelcomePanelProps) {
    return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            Welcome back, {data.manager.name}!
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Managing <span className="font-semibold">{data.name}</span> •
                            Today's collection: <span className="font-semibold">{data.todaysStats.totalCollection}L</span> from
                            <span className="font-semibold"> {data.todaysStats.farmersCount} farmers</span>
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{data.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{data.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{currentTime.toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant={data.isActive ? "default" : "secondary"}>
                            {data.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Current Time</p>
                            <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                                {currentTime.toLocaleTimeString()}
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 