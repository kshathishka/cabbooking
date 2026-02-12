import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import type { Booking, Driver } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Users, Car, Calendar, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  
  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    cabType: '',
  });
  const [isAddingDriver, setIsAddingDriver] = useState(false);

  useEffect(() => {
    loadBookings();
    loadDrivers();
  }, []);

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await adminAPI.getBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const loadDrivers = async () => {
    setIsLoadingDrivers(true);
    try {
      const data = await adminAPI.getDrivers();
      setDrivers(data);
    } catch (error) {
      toast.error('Failed to load drivers');
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingDriver(true);

    try {
      await adminAPI.addDriver(newDriver);
      toast.success('Driver added successfully');
      setNewDriver({ name: '', email: '', cabType: '' });
      loadDrivers(); // Reload drivers list
    } catch (error) {
      toast.error('Failed to add driver');
    } finally {
      setIsAddingDriver(false);
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
            <p className="text-xs text-gray-500">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Drivers</CardTitle>
            <Car className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-xs text-gray-500">Active drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Available Drivers</CardTitle>
            <Users className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drivers.filter(d => d.available).length}
            </div>
            <p className="text-xs text-gray-500">Ready for assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="add-driver">Add Driver</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>View and manage all cab bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="text-center py-8 text-gray-500">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bookings found</div>
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
                        <TableHead>HR Email</TableHead>
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
                          <TableCell>{booking.hrEmail}</TableCell>
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

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Drivers</CardTitle>
              <CardDescription>View and manage driver information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDrivers ? (
                <div className="text-center py-8 text-gray-500">Loading drivers...</div>
              ) : drivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No drivers found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cab Type</TableHead>
                      <TableHead>Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.id}</TableCell>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.cabType}</TableCell>
                        <TableCell>
                          <Badge className={driver.available ? 'bg-green-500' : 'bg-red-500'}>
                            {driver.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-driver" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Driver</CardTitle>
              <CardDescription>Register a new driver to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDriver} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input
                    id="driverName"
                    placeholder="John Doe"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    required
                    disabled={isAddingDriver}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverEmail">Email</Label>
                  <Input
                    id="driverEmail"
                    type="email"
                    placeholder="driver@example.com"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    required
                    disabled={isAddingDriver}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cabType">Cab Type</Label>
                  <Input
                    id="cabType"
                    placeholder="e.g., Sedan, SUV, Luxury"
                    value={newDriver.cabType}
                    onChange={(e) => setNewDriver({ ...newDriver, cabType: e.target.value })}
                    required
                    disabled={isAddingDriver}
                  />
                </div>

                <Button type="submit" disabled={isAddingDriver} className="w-full">
                  <Plus className="size-4 mr-2" />
                  {isAddingDriver ? 'Adding Driver...' : 'Add Driver'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
