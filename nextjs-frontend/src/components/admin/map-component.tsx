'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface MapComponentProps {
  pharmacies: Pharmacy[];
}

export default function MapComponent({ pharmacies }: MapComponentProps) {
  const validPharmacies = pharmacies.filter(p => {
    if (p.location?.coordinates && Array.isArray(p.location.coordinates) && 
        p.location.coordinates.length === 2 &&
        !isNaN(p.location.coordinates[0]) && !isNaN(p.location.coordinates[1])) {
      return true;
    }
    if (p.location?.latitude && p.location?.longitude &&
        !isNaN(p.location.latitude) && !isNaN(p.location.longitude)) {
      return true;
    }
    return false;
  });

  const center: [number, number] = validPharmacies.length > 0 
    ? [
        validPharmacies.reduce((sum, p) => {
          const lat = p.location.coordinates ? p.location.coordinates[1] : p.location.latitude!;
          return sum + lat;
        }, 0) / validPharmacies.length,
        validPharmacies.reduce((sum, p) => {
          const lng = p.location.coordinates ? p.location.coordinates[0] : p.location.longitude!;
          return sum + lng;
        }, 0) / validPharmacies.length
      ]
    : [40.7128, -74.0060];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validPharmacies.map((pharmacy) => {
        const lat = pharmacy.location.coordinates ? pharmacy.location.coordinates[1] : pharmacy.location.latitude!;
        const lng = pharmacy.location.coordinates ? pharmacy.location.coordinates[0] : pharmacy.location.longitude!;
        
        return (
          <Marker key={pharmacy._id} position={[lat, lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{pharmacy.pharmacyName}</h3>
                <p className="text-sm text-gray-600">{pharmacy.location.address}</p>
                <p className="text-xs text-gray-500">Device: {pharmacy.deviceId}</p>
                <p className="text-xs">
                  Status: <span className={pharmacy.isActive ? 'text-green-600' : 'text-red-600'}>
                    {pharmacy.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}