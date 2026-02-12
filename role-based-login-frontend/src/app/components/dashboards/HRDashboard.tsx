import React, { useState, useEffect } from 'react';
import { hrAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import type { Booking } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calendar, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  
  // New booking form state
  const [newBooking, setNewBooking] = useState({
    employeeName: '',
    pickup: '',
    dropLocation: '',
    pickupTime: '',
    cabType: '',
    durationMin: 30,
  });
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadMyBookings();
    }
  }, [user]);

  const loadMyBookings = async () => {
    if (!user?.email) return;
    
    setIsLoadingBookings(true);
    try {
      const data = await hrAPI.getMyBookings(user.email);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setIsCreatingBooking(true);

    try {
      await hrAPI.createBooking({
        ...newBooking,
        hrEmail: user.email,
      });
      toast.success('Booking created successfully!');
      setNewBooking({
        employeeName: '',
        pickup: '',
        dropLocation: '',
        pickupTime: '',
        cabType: '',
        durationMin: 30,
      });
      loadMyBookings(); // Reload bookings list
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('completed')) {
      return <Badge className="bg-green-500">Completed</Badge>;
    }
    if (statusLower.includes('pending')) {
      return <Badge className="bg-yellow-500">Pending</Badge>;
    }
    if (statusLower.includes('assigned')) {
      return <Badge className="bg-blue-500">Assigned</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Bookings</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-gray-500">Your bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <Clock className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.completed).length}
            </div>
            <p className="text-xs text-gray-500">Finished trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => !b.completed).length}
            </div>
            <p className="text-xs text-gray-500">Upcoming trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="create-booking">Create Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="my-bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View all your cab bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="text-center py-8 text-gray-500">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings found. Create your first booking!
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
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.employeeName}</TableCell>
                          <TableCell>{booking.pickup}</TableCell>
                          <TableCell>{booking.dropLocation}</TableCell>
                          <TableCell>{new Date(booking.pickupTime).toLocaleString()}</TableCell>
                          <TableCell>{booking.cabType}</TableCell>
                          <TableCell>{booking.durationMin} min</TableCell>
                          <TableCell>{booking.driverEmail || 'Unassigned'}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Booking</CardTitle>
              <CardDescription>Book a cab for an employee</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      placeholder="John Doe"
                      value={newBooking.employeeName}
                      onChange={(e) => setNewBooking({ ...newBooking, employeeName: e.target.value })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cabType">Cab Type</Label>
                    <Input
                      id="cabType"
                      placeholder="e.g., Sedan, SUV, Luxury"
                      value={newBooking.cabType}
                      onChange={(e) => setNewBooking({ ...newBooking, cabType: e.target.value })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Input
                      id="pickup"
                      placeholder="123 Main St, City"
                      value={newBooking.pickup}
                      onChange={(e) => setNewBooking({ ...newBooking, pickup: e.target.value })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dropLocation">Drop Location</Label>
                    <Input
                      id="dropLocation"
                      placeholder="456 Oak Ave, City"
                      value={newBooking.dropLocation}
                      onChange={(e) => setNewBooking({ ...newBooking, dropLocation: e.target.value })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Pickup Date & Time</Label>
                    <Input
                      id="pickupTime"
                      type="datetime-local"
                      value={newBooking.pickupTime}
                      onChange={(e) => setNewBooking({ ...newBooking, pickupTime: e.target.value })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMin">Duration (minutes)</Label>
                    <Input
                      id="durationMin"
                      type="number"
                      min="1"
                      value={newBooking.durationMin}
                      onChange={(e) => setNewBooking({ ...newBooking, durationMin: parseInt(e.target.value) })}
                      required
                      disabled={isCreatingBooking}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isCreatingBooking} className="w-full">
                  <Plus className="size-4 mr-2" />
                  {isCreatingBooking ? 'Creating Booking...' : 'Create Booking'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
