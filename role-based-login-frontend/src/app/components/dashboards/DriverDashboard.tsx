import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import type { Booking } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, CheckCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [completingTripId, setCompletingTripId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.email) {
      loadMyTrips();
    }
  }, [user]);

  const loadMyTrips = async () => {
    if (!user?.email) return;
    
    setIsLoadingTrips(true);
    try {
      const data = await driverAPI.getMyTrips(user.email);
      setTrips(data);
    } catch (error) {
      toast.error('Failed to load trips');
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const handleCompleteTrip = async (bookingId: number) => {
    setCompletingTripId(bookingId);
    try {
      await driverAPI.completeTrip(bookingId);
      toast.success('Trip marked as completed!');
      loadMyTrips(); // Reload trips list
    } catch (error) {
      toast.error('Failed to complete trip');
    } finally {
      setCompletingTripId(null);
    }
  };

  const getStatusBadge = (booking: Booking) => {
    if (booking.completed) {
      return <Badge className="bg-green-500">Completed</Badge>;
    }
    const pickupTime = new Date(booking.pickupTime);
    const now = new Date();
    if (pickupTime > now) {
      return <Badge className="bg-blue-500">Upcoming</Badge>;
    }
    return <Badge className="bg-yellow-500">In Progress</Badge>;
  };

  const activeTrips = trips.filter(t => !t.completed);
  const completedTrips = trips.filter(t => t.completed);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Trips</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-gray-500">All assigned trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Trips</CardTitle>
            <Clock className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips.length}</div>
            <p className="text-xs text-gray-500">Pending completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTrips.length}</div>
            <p className="text-xs text-gray-500">Finished trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trips</CardTitle>
          <CardDescription>Your pending and upcoming trips</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTrips ? (
            <div className="text-center py-8 text-gray-500">Loading trips...</div>
          ) : activeTrips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active trips at the moment
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <Card key={trip.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Pickup</p>
                            <p className="font-medium">{trip.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Drop</p>
                            <p className="font-medium">{trip.dropLocation}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Employee</p>
                          <p className="font-medium">{trip.employeeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pickup Time</p>
                          <p className="font-medium">{new Date(trip.pickupTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{trip.durationMin} minutes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge>{trip.cabType}</Badge>
                        {getStatusBadge(trip)}
                      </div>
                      <Button
                        onClick={() => handleCompleteTrip(trip.id!)}
                        disabled={completingTripId === trip.id}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        {completingTripId === trip.id ? 'Completing...' : 'Complete Trip'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Trips</CardTitle>
          <CardDescription>Your trip history</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTrips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No completed trips yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Drop</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Cab Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>{trip.id}</TableCell>
                      <TableCell>{trip.employeeName}</TableCell>
                      <TableCell>{trip.pickup}</TableCell>
                      <TableCell>{trip.dropLocation}</TableCell>
                      <TableCell>{new Date(trip.pickupTime).toLocaleString()}</TableCell>
                      <TableCell>{trip.cabType}</TableCell>
                      <TableCell>{trip.durationMin} min</TableCell>
                      <TableCell>{getStatusBadge(trip)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
