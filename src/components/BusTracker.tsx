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
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-transit-primary to-transit-success">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">TrackMyBus</h1>
                <p className="text-xs text-muted-foreground">Live Bus Tracking</p>
              </div>
            </div>
          </div>
          
          {/* Mobile Tab Navigation */}
          <div className="flex bg-secondary rounded-lg p-1">
            <Button 
              variant={activeView === 'map' ? 'default' : 'ghost'} 
              size="sm"
              className="flex-1 h-8"
              onClick={() => setActiveView('map')}
            >
              <MapPin className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Map</span>
            </Button>
            <Button 
              variant={activeView === 'list' ? 'default' : 'ghost'} 
              size="sm"
              className="flex-1 h-8"
              onClick={() => setActiveView('list')}
            >
              <Navigation className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Mobile Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search routes, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border text-base"
            />
          </div>
        </div>

        {/* Mobile-Optimized Content */}
        {activeView === 'map' ? (
          <div className="space-y-4">
            {/* Map View */}
            <Card className="h-[40vh] bg-card border-border">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-base font-medium text-foreground mb-2">Interactive Map</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Live bus tracking map coming soon
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tap to integrate Mapbox
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stop Info - Mobile */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base text-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Nearest Stop: Central Station</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {mockStops[0].arrivals.slice(0, 2).map((arrival, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="border-primary text-primary text-xs">
                          {arrival.routeNumber}
                        </Badge>
                        {arrival.delay > 0 && (
                          <Badge variant="destructive" className="bg-status-delayed text-white text-xs">
                            +{arrival.delay}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{arrival.destination}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-bold text-foreground">{arrival.estimatedTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Mobile Bus List */
          <div className="space-y-3">
            {filteredBuses.map((bus) => (
              <Card key={bus.id} className="bg-card border-border hover:border-primary transition-colors animate-bounce-in">
                <CardContent className="p-4">
                  {/* Mobile Bus Card Layout */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full bg-${getStatusColor(bus.status)} flex items-center justify-center`}>
                          <Bus className="w-5 h-5 text-white" />
                        </div>
                        {bus.status === 'online' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-online rounded-full animate-pulse-ring"></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                            Route {bus.routeNumber}
                          </Badge>
                          {bus.status === 'online' ? (
                            <Wifi className="w-3 h-3 text-status-online flex-shrink-0" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-status-offline flex-shrink-0" />
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground truncate">{bus.destination}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="flex items-center justify-end space-x-1 mb-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="font-bold text-lg text-foreground">{bus.arrivalTime}</span>
                      </div>
                      {bus.delay > 0 && (
                        <Badge variant="destructive" className="bg-status-delayed text-white text-xs">
                          +{bus.delay}m
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile: Current Location */}
                  <div className="text-xs text-muted-foreground mb-2 flex items-center">
                    <span className="truncate">At: {bus.currentStop} → {bus.nextStop}</span>
                  </div>
                  
                  {/* Mobile: Occupancy */}
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant="outline" 
                      className={`border-${getOccupancyColor(bus.occupancy)} text-${getOccupancyColor(bus.occupancy)} text-xs`}
                    >
                      {bus.occupancy} occupancy
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Mobile System Status - Bottom */}
        <Card className="mt-6 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-status-online">{buses.filter(b => b.status === 'online').length}</div>
                <div className="text-xs text-muted-foreground">Online</div>
              </div>
              <div>
                <div className="text-lg font-bold text-status-delayed">{buses.filter(b => b.status === 'delayed').length}</div>
                <div className="text-xs text-muted-foreground">Delayed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-muted-foreground">30s</div>
                <div className="text-xs text-muted-foreground">Last Update</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusTracker;