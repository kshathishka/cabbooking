import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import type { Booking } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, CheckCircle, Clock, MapPin, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import '../../../styles/trip-card.css';
import { WeatherWidget } from '../ui/WeatherWidget';

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
      {/* Live Weather Widget */}
      <WeatherWidget />
      
      {/* Stats Cards */}
      <div className="glass-stats">
        <div className="glass-card">
          <div className="glass-card-header">
            <p className="glass-card-title">Total Trips</p>
            <Calendar className="size-4" />
          </div>
          <p className="glass-card-value">{trips.length}</p>
          <p className="glass-card-desc">All assigned trips</p>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <p className="glass-card-title">Active Trips</p>
            <Clock className="size-4" />
          </div>
          <p className="glass-card-value">{activeTrips.length}</p>
          <p className="glass-card-desc">Pending completion</p>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <p className="glass-card-title">Completed</p>
            <CheckCircle className="size-4" />
          </div>
          <p className="glass-card-value">{completedTrips.length}</p>
          <p className="glass-card-desc">Finished trips</p>
        </div>
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
            <div className="empty-state">
              <Inbox />
              <p>No active trips at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="trip-card">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="trip-route">
                      <div className="trip-route-item">
                        <MapPin />
                        <div>
                          <p className="trip-label">Pickup</p>
                          <p className="trip-value">{trip.pickup}</p>
                        </div>
                      </div>
                      <div className="trip-route-item">
                        <MapPin />
                        <div>
                          <p className="trip-label">Drop</p>
                          <p className="trip-value">{trip.dropLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="trip-details">
                      <div className="trip-detail-item">
                        <p className="trip-label">Employee</p>
                        <p className="trip-value">{trip.employeeName}</p>
                      </div>
                      <div className="trip-detail-item">
                        <p className="trip-label">Pickup Time</p>
                        <p className="trip-value">{new Date(trip.pickupTime).toLocaleString()}</p>
                      </div>
                      <div className="trip-detail-item">
                        <p className="trip-label">Duration</p>
                        <p className="trip-value">{trip.durationMin} minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="trip-footer">
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
                </div>
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
            <div className="empty-state">
              <CheckCircle />
              <p>No completed trips yet</p>
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
