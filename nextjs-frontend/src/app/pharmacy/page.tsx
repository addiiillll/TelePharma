'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';

export default function PharmacyPortal() {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null
  });
  const [devices, setDevices] = useState([]);
  const [currentPharmacy, setCurrentPharmacy] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async (pharmacyName?: string) => {
    try {
      const url = pharmacyName 
        ? `http://localhost:5000/api/devices/pharmacy?pharmacyName=${encodeURIComponent(pharmacyName)}`
        : 'http://localhost:5000/api/devices';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const getCurrentLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setLocationStatus('success');
        setError('');
      },
      (error) => {
        setLocationStatus('error');
        setError('Unable to retrieve location. Please enable location services.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      setError('Please get your current location first');
      return;
    }

    setIsRegistering(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/devices/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacyName: formData.pharmacyName,
          location: {
            latitude: formData.latitude,
            longitude: formData.longitude,
            address: formData.address
          }
        }),
      });

      if (response.ok) {
        const newPharmacy = formData.pharmacyName;
        setCurrentPharmacy(newPharmacy);
        setFormData({
          pharmacyName: '',
          address: '',
          latitude: null,
          longitude: null
        });
        setLocationStatus('idle');
        fetchDevices(newPharmacy);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to register device');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">
              Pharmacy Portal
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Register and manage your pharmacy devices for telemedicine services
          </p>
          {currentPharmacy && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg inline-block">
              <p className="text-sm font-medium text-primary">
                Managing devices for: {currentPharmacy}
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Register New Device
              </CardTitle>
              <CardDescription>
                Device ID and API key will be auto-generated. Location will be detected automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                  <Input
                    id="pharmacyName"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    placeholder="Enter your pharmacy name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Complete Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, city, state, zip code"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Location Coordinates</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={locationStatus === 'loading'}
                      className="flex items-center"
                    >
                      {locationStatus === 'loading' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      {locationStatus === 'loading' ? 'Getting Location...' : 'Get Current Location'}
                    </Button>
                    {locationStatus === 'success' && (
                      <div className="flex items-center text-chart-4">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Location detected</span>
                      </div>
                    )}
                  </div>
                  {formData.latitude && formData.longitude && (
                    <div className="text-sm text-muted-foreground">
                      Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isRegistering || !formData.latitude || !formData.longitude}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Device...
                    </>
                  ) : (
                    'Register Pharmacy Device'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {currentPharmacy ? `${currentPharmacy} Devices` : 'Registered Devices'}
                </div>
                {devices.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCurrentPharmacy('');
                      fetchDevices();
                    }}
                  >
                    View All
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {currentPharmacy 
                  ? `Devices registered under ${currentPharmacy}`
                  : 'Monitor your active pharmacy devices and access device interfaces'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDevices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading devices...</span>
                </div>
              ) : devices && devices.length > 0 ? (
                <div className="space-y-4">
                  {devices.map((device: any) => (
                    <div key={device._id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-primary" />
                          <h3 className="font-semibold text-foreground">{device.pharmacyName}</h3>
                        </div>
                        <Badge variant={device.isActive ? "default" : "secondary"}>
                          {device.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="font-medium w-20">Device ID:</span>
                          <span className="font-mono flex-1">{device.deviceId}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(device.deviceId)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="font-medium w-20">API Key:</span>
                          <span className="font-mono text-xs flex-1">{device.apiKey}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(device.apiKey)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-start text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{device.location.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="font-medium w-20">Last Ping:</span>
                          <span>{new Date(device.lastPing).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/device?apiKey=${device.apiKey}&pharmacy=${encodeURIComponent(device.pharmacyName)}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Device Interface
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No devices registered yet</p>
                  <p className="text-sm text-muted-foreground">Register your first pharmacy device to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Simple steps to get your pharmacy connected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Register Device</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your pharmacy details and get automatic location detection
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Get API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive unique API key for device authentication
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <ExternalLink className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Access Device</h3>
                    <p className="text-sm text-muted-foreground">
                      Open device interface for patient consultations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}