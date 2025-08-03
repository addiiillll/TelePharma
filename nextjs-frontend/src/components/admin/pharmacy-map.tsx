'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Map = dynamic(() => import('./map-component'), { ssr: false });

interface Pharmacy {
  _id: string;
  deviceId: string;
  pharmacyName: string;
  location: {
    address: string;
    coordinates?: [number, number];
    latitude?: number;
    longitude?: number;
  };
  isActive: boolean;
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
}

export function PharmacyMap({ pharmacies }: PharmacyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pharmacy Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const validCount = pharmacies.filter(p => 
    (p.location?.coordinates && Array.isArray(p.location.coordinates)) ||
    (p.location?.latitude && p.location?.longitude)
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pharmacy Locations ({validCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden">
          <Map pharmacies={pharmacies} />
        </div>
      </CardContent>
    </Card>
  );
}