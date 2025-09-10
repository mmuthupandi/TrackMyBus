import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Navigation, Search, Bus, Wifi, WifiOff } from 'lucide-react';

interface Bus {
  id: string;
  routeNumber: string;
  destination: string;
  currentStop: string;
  nextStop: string;
  arrivalTime: string;
  delay: number;
  status: 'online' | 'delayed' | 'offline';
  coordinates: [number, number];
  occupancy: 'low' | 'medium' | 'high';
}

interface BusStop {
  id: string;
  name: string;
  routes: string[];
  coordinates: [number, number];
  arrivals: Array<{
    routeNumber: string;
    destination: string;
    estimatedTime: string;
    delay: number;
  }>;
}

// Mock data for demonstration
const mockBuses: Bus[] = [
  {
    id: 'bus-001',
    routeNumber: '15A',
    destination: 'City Center',
    currentStop: 'Pine Street',
    nextStop: 'Central Station',
    arrivalTime: '2 min',
    delay: 0,
    status: 'online',
    coordinates: [-73.935242, 40.730610],
    occupancy: 'medium'
  },
  {
    id: 'bus-002',
    routeNumber: '22B',
    destination: 'University',
    currentStop: 'Main Avenue',
    nextStop: 'Library Square',
    arrivalTime: '5 min',
    delay: 3,
    status: 'delayed',
    coordinates: [-73.925242, 40.725610],
    occupancy: 'high'
  },
  {
    id: 'bus-003',
    routeNumber: '8C',
    destination: 'Airport',
    currentStop: 'Hospital',
    nextStop: 'Terminal 1',
    arrivalTime: '12 min',
    delay: 0,
    status: 'online',
    coordinates: [-73.915242, 40.720610],
    occupancy: 'low'
  }
];

const mockStops: BusStop[] = [
  {
    id: 'stop-001',
    name: 'Central Station',
    routes: ['15A', '22B', '8C'],
    coordinates: [-73.935242, 40.730610],
    arrivals: [
      { routeNumber: '15A', destination: 'City Center', estimatedTime: '2 min', delay: 0 },
      { routeNumber: '22B', destination: 'University', estimatedTime: '8 min', delay: 3 },
      { routeNumber: '8C', destination: 'Airport', estimatedTime: '15 min', delay: 0 }
    ]
  }
];

const BusTracker = () => {
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        arrivalTime: Math.max(0, parseInt(bus.arrivalTime) - 1) + ' min',
        // Randomly update delay status
        delay: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : bus.delay,
        status: Math.random() > 0.9 ? 'delayed' : bus.status
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Bus['status']) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'delayed': return 'status-delayed';
      case 'offline': return 'status-offline';
      default: return 'muted';
    }
  };

  const getOccupancyColor = (occupancy: Bus['occupancy']) => {
    switch (occupancy) {
      case 'low': return 'transit-success';
      case 'medium': return 'transit-warning';
      case 'high': return 'transit-danger';
      default: return 'muted';
    }
  };

  const filteredBuses = buses.filter(bus => 
    bus.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-transit-primary to-transit-success">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CityTransit</h1>
                <p className="text-sm text-muted-foreground">Live Bus Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant={activeView === 'map' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveView('map')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Map
              </Button>
              <Button 
                variant={activeView === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveView('list')}
              >
                <Navigation className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search routes, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map/List View */}
          <div className="lg:col-span-2">
            {activeView === 'map' ? (
              <Card className="h-[500px] bg-card border-border">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Interactive Map</h3>
                      <p className="text-muted-foreground mb-4">
                        To enable live bus tracking on the map, you'll need to integrate with a mapping service.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recommended: Mapbox for real-time vehicle tracking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className="bg-card border-border hover:border-primary transition-colors animate-bounce-in">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full bg-${getStatusColor(bus.status)} flex items-center justify-center`}>
                              <Bus className="w-6 h-6 text-white" />
                            </div>
                            {bus.status === 'online' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-status-online rounded-full animate-pulse-ring"></div>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                                Route {bus.routeNumber}
                              </Badge>
                              {bus.status === 'online' ? (
                                <Wifi className="w-4 h-4 text-status-online" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-status-offline" />
                              )}
                            </div>
                            <p className="font-medium text-foreground">{bus.destination}</p>
                            <p className="text-sm text-muted-foreground">
                              Currently at: {bus.currentStop} → {bus.nextStop}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-bold text-lg text-foreground">{bus.arrivalTime}</span>
                          </div>
                          {bus.delay > 0 && (
                            <Badge variant="destructive" className="bg-status-delayed text-white">
                              +{bus.delay} min delay
                            </Badge>
                          )}
                          <div className="mt-2">
                            <Badge 
                              variant="outline" 
                              className={`border-${getOccupancyColor(bus.occupancy)} text-${getOccupancyColor(bus.occupancy)}`}
                            >
                              {bus.occupancy} occupancy
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bus Stop Info Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>Central Station</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockStops[0].arrivals.map((arrival, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="border-primary text-primary">
                          {arrival.routeNumber}
                        </Badge>
                        {arrival.delay > 0 && (
                          <Badge variant="destructive" className="bg-status-delayed text-white text-xs">
                            +{arrival.delay}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">{arrival.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{arrival.estimatedTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Buses</span>
                    <span className="font-bold text-status-online">{buses.filter(b => b.status === 'online').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delayed</span>
                    <span className="font-bold text-status-delayed">{buses.filter(b => b.status === 'delayed').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="text-sm text-muted-foreground">30s ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTracker;