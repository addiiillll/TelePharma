'use client';
import { useSearchParams } from 'next/navigation';
import { DeviceInterface } from '@/components/device/device-interface';

export default function DevicePage() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey') || '';
  const pharmacyName = searchParams.get('pharmacy') || 'Pharmacy Device';

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Device</h1>
          <p className="text-muted-foreground">API key is required</p>
        </div>
      </div>
    );
  }

  return <DeviceInterface apiKey={apiKey} pharmacyName={pharmacyName} />;
}