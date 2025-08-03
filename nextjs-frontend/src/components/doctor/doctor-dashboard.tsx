'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  XCircle,
  LogOut,
  Stethoscope
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';

interface Session {
  _id: string;
  sessionId: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  deviceId: {
    pharmacyName: string;
    location: { address: string };
  };
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export function DoctorDashboard() {
  const { doctor, token } = useSelector((state: RootState) => state.auth);
  const [isAvailable, setIsAvailable] = useState(doctor?.isAvailable || false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionNotes, setSessionNotes] = useState<{[key: string]: string}>({});
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.filter((s: Session) => 
          s.status === 'waiting' || s.status === 'active'
        ));
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/toggle-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAvailable(data.isAvailable);
        toast.success(`You are now ${data.isAvailable ? 'available' : 'unavailable'}`);
      }
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const notes = sessionNotes[sessionId] || '';
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, notes })
      });

      if (response.ok) {
        toast.success(`Session ${status}`);
        fetchSessions();
        setSessionNotes(prev => ({ ...prev, [sessionId]: '' }));
      }
    } catch (error) {
      toast.error('Failed to update session');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dr. {doctor?.name}</h1>
              <p className="text-muted-foreground">{doctor?.specialization}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Availability Toggle */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Availability Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Switch
                checked={isAvailable}
                onCheckedChange={toggleAvailability}
                id="availability"
              />
              <Label htmlFor="availability" className="text-lg">
                {isAvailable ? 'Available for consultations' : 'Currently unavailable'}
              </Label>
              <Badge className={isAvailable ? 'bg-green-500' : 'bg-red-500'}>
                {isAvailable ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Active Sessions ({sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active sessions</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isAvailable ? 'Waiting for new consultations...' : 'Set yourself as available to receive sessions'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sessions.map((session) => (
                  <div key={session._id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold text-lg">{session.patientName}</h3>
                          <p className="text-sm text-muted-foreground">Age: {session.patientAge}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{session.deviceId.pharmacyName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.deviceId.location.address}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Session Time</Label>
                        <p className="text-sm mt-1">
                          {new Date(session.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label className="text-sm font-medium">Symptoms</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                        {session.symptoms}
                      </p>
                    </div>

                    {session.status === 'active' && (
                      <div className="mb-4">
                        <Label htmlFor={`notes-${session._id}`} className="text-sm font-medium">
                          Session Notes
                        </Label>
                        <Textarea
                          id={`notes-${session._id}`}
                          placeholder="Add consultation notes..."
                          value={sessionNotes[session._id] || ''}
                          onChange={(e) => setSessionNotes(prev => ({
                            ...prev,
                            [session._id]: e.target.value
                          }))}
                          className="mt-1"
                        />
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex gap-3">
                      {session.status === 'waiting' && (
                        <>
                          <Button
                            onClick={() => updateSessionStatus(session._id, 'active')}
                            className="flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Session
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => updateSessionStatus(session._id, 'cancelled')}
                            className="flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      {session.status === 'active' && (
                        <Button
                          onClick={() => updateSessionStatus(session._id, 'completed')}
                          className="flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Session
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}