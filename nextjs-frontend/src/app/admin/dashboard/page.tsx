'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { adminApi } from '@/lib/api';
import { DashboardChart } from '@/components/admin/dashboard-chart';
import {
  Users,
  Activity,
  Building2,
  Stethoscope,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [onlineDoctors, setOnlineDoctors] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, doctorsRes, sessionsRes, devicesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOnlineDoctors(),
        adminApi.getActiveSessions(),
        adminApi.getDeviceLocations()
      ]);

      console.log('API Response Status:', {
        stats: statsRes.status,
        doctors: doctorsRes.status,
        sessions: sessionsRes.status,
        devices: devicesRes.status
      });

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } else {
        console.error('Stats API failed:', statsRes.status, await statsRes.text());
      }

      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        setOnlineDoctors(doctorsData);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setActiveSessions(sessionsData);
      }

      if (devicesRes.ok) {
        const devicesData = await devicesRes.json();
        setDevices(devicesData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get engaged doctors and devices
  const engagedDoctors = onlineDoctors.filter(doctor =>
    activeSessions.some(session => session.doctorId?._id === doctor._id)
  );

  const engagedDevices = devices.filter(device =>
    activeSessions.some(session => session.deviceId === device.deviceId)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor your telemedicine platform in real-time</p>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-chart-1 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Doctors</p>
                <p className="text-3xl font-bold">{stats?.doctors?.total || 0}</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  {stats?.doctors?.online || 0} online
                </p>
              </div>
              <Stethoscope className="h-8 w-8 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chart-5 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Active Sessions</p>
                <p className="text-3xl font-bold">{stats?.sessions?.active || 0}</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  {stats?.sessions?.waiting || 0} waiting
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chart-4 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Pharmacy Devices</p>
                <p className="text-3xl font-bold">{stats?.devices?.total || 0}</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  {stats?.devices?.active || 0} active
                </p>
              </div>
              <Building2 className="h-8 w-8 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chart-3 text-primary-foreground border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Today's Sessions</p>
                <p className="text-3xl font-bold">{stats?.sessions?.today || 0}</p>
                <p className="text-xs text-primary-foreground/60 mt-1">
                  {stats?.sessions?.completed || 0} completed
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary-foreground/60" />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Dashboard Chart */}
      <DashboardChart />


      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Doctors Engaged in Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Doctors in Active Sessions ({engagedDoctors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {engagedDoctors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No doctors currently in sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {engagedDoctors.map((doctor) => {
                  const doctorSession = activeSessions.find(s => s.doctorId?._id === doctor._id);
                  return (
                    <div key={doctor._id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10">
                          <AvatarFallback className="text-primary font-semibold">
                            {doctor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          {doctorSession && (
                            <p className="text-xs text-muted-foreground">
                              Session: {doctorSession.sessionId?.slice(-8)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                        <Badge className="bg-chart-4 text-primary-foreground">
                          In Session
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pharmacies Engaged with Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Pharmacies in Active Sessions ({engagedDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {engagedDevices.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pharmacies currently in sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {engagedDevices.map((device) => {
                  const deviceSession = activeSessions.find(s => s.deviceId === device.deviceId);
                  const sessionDoctor = deviceSession?.doctorId;
                  return (
                    <div key={device.deviceId} className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/20">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-chart-2" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{device.pharmacyName}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{device.location?.address?.split(',')[0]}</span>
                          </div>
                          {sessionDoctor && (
                            <p className="text-xs text-muted-foreground">
                              With Dr. {sessionDoctor.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
                        <Badge className="bg-chart-2 text-primary-foreground">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Online Doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            All Online Doctors ({onlineDoctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {onlineDoctors.length === 0 ? (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No doctors online</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineDoctors.map((doctor) => (
                <div key={doctor._id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary/10">
                      <AvatarFallback className="text-primary text-sm font-semibold">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <Badge variant={doctor.isAvailable ? "default" : "secondary"} className="text-xs">
                    {doctor.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}