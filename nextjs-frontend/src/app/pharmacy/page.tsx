'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterDeviceMutation, useGetDevicesQuery } from '@/lib/redux/slices/apiSlice';

export default function PharmacyPortal() {
  const [formData, setFormData] = useState({
    deviceId: '',
    pharmacyName: '',
    latitude: '',
    longitude: '',
    address: ''
  });

  const [registerDevice, { isLoading: isRegistering }] = useRegisterDeviceMutation();
  const { data: devices, isLoading: isLoadingDevices } = useGetDevicesQuery({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerDevice({
        deviceId: formData.deviceId,
        pharmacyName: formData.pharmacyName,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          address: formData.address
        }
      }).unwrap();
      
      setFormData({
        deviceId: '',
        pharmacyName: '',
        latitude: '',
        longitude: '',
        address: ''
      });
      alert('Device registered successfully!');
    } catch (error) {
      alert('Failed to register device');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pharmacy Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Register and manage your pharmacy devices for telemedicine services
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Register New Device</CardTitle>
              <CardDescription>
                Add a new pharmacy device to enable telemedicine consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="deviceId">Device ID</Label>
                  <Input
                    id="deviceId"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleChange}
                    placeholder="DEVICE_001"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                  <Input
                    id="pharmacyName"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    placeholder="City Pharmacy"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="40.7128"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="-74.0060"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, New York, NY"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? 'Registering...' : 'Register Device'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Devices</CardTitle>
              <CardDescription>
                View and manage your pharmacy devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDevices ? (
                <div className="text-center py-4">Loading devices...</div>
              ) : devices && devices.length > 0 ? (
                <div className="space-y-4">
                  {devices.map((device: any) => (
                    <div key={device._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{device.pharmacyName}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          device.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {device.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Device ID: {device.deviceId}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Location: {device.location.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last Ping: {new Date(device.lastPing).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No devices registered yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">1️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Register Device</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your pharmacy device with location details
                  </p>
                </div>
                <div>
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">2️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Enable Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Patients can now request consultations at your location
                  </p>
                </div>
                <div>
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">3️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Monitor Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Track device activity and session requests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}