export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  isOnline: boolean;
}

export interface Device {
  _id: string;
  pharmacyName: string;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  registeredBy: string;
  createdAt: string;
}

export interface Session {
  _id: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  deviceId: Device;
  doctorId?: Doctor;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  totalDevices: number;
  onlineDoctors: number;
}