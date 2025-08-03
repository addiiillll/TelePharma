'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Stethoscope, 
  Clock, 
  Users, 
  LogOut, 
  Bell, 
  CheckCircle, 
  Activity,
  MapPin,
  Phone,
  Calendar,
  Settings,
  BarChart3
} from 'lucide-react';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { NotificationPermissionBanner } from '@/components/ui/notification-permission';

export default function Dashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    waiting: 0,
    completed: 0,
    total: 0
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchSessions();
    // Poll for sessions every 5 seconds
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateStats();
  }, [sessions]);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDoctor(data.doctor);
        setIsAvailable(data.doctor.isAvailable);
        // Doctor is automatically online when authenticated
      } else {
        console.log('Auth verification failed:', response.status);
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions/doctor', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions');
    }
  };



  const updateStats = () => {
    const active = sessions.filter(s => s.status === 'active').length;
    const waiting = sessions.filter(s => s.status === 'waiting').length;
    const completed = sessions.filter(s => s.status === 'completed').length;
    setStats({ active, waiting, completed, total: sessions.length });
  };

  const toggleAvailability = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/toggle-availability', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAvailable(data.isAvailable);
      }
    } catch (error) {
      console.error('Failed to toggle availability');
    }
  };

  const handleLogout = async () => {
    try {
      // This will set isOnline: false and isAvailable: false in backend
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      router.push('/login');
    }
  };

  const acceptSession = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:5000/api/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'active' })
      });
      fetchSessions(); // Refresh sessions
    } catch (error) {
      console.error('Failed to accept session');
    }
  };

  const completeSession = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:5000/api/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'completed' })
      });
      fetchSessions(); // Refresh sessions
    } catch (error) {
      console.error('Failed to complete session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg font-medium text-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const waitingSessions = sessions.filter(s => s.status === 'waiting');
  const activeSessions = sessions.filter(s => s.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-primary/10">
                <AvatarFallback className="text-primary font-semibold text-lg">
                  {doctor?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Dr. {doctor?.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Stethoscope className="h-4 w-4" />
                  {doctor?.specialization}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-sm font-medium text-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={isAvailable ? "default" : "secondary"} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    {isAvailable ? "Available" : "Offline"}
                  </Badge>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={toggleAvailability}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <NotificationDropdown userType="doctor" />
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <NotificationPermissionBanner />
        
        {/* Quick Actions */}
        {!isAvailable && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-orange-900 dark:text-orange-100">You're currently offline</p>
                  <p className="text-sm text-orange-700 dark:text-orange-200">Turn on availability to receive consultation requests</p>
                </div>
                <Button onClick={toggleAvailability} size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Go Online
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-chart-1 text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Active Sessions</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <Activity className="h-8 w-8 text-primary-foreground/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-chart-5 text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Waiting</p>
                  <p className="text-3xl font-bold">{stats.waiting}</p>
                </div>
                <Clock className="h-8 w-8 text-primary-foreground/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-chart-4 text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary-foreground/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-chart-3 text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Today</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary-foreground/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Waiting Sessions */}
          <Card className="order-1">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-b border-border">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-foreground">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Waiting Sessions</span>
                </div>
                {stats.waiting > 0 && (
                  <Badge className="bg-orange-600 text-white animate-pulse w-fit">
                    {stats.waiting} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {waitingSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">No waiting sessions</p>
                  <p className="text-sm text-muted-foreground mt-1">New requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {waitingSessions.map((session) => (
                    <div key={session._id} className="border border-border rounded-lg p-4 bg-accent/50 hover:bg-accent transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-chart-5" />
                            <p className="font-semibold text-foreground">Session from Device</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Session: {session.sessionId}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested: {new Date(session.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          Waiting
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => acceptSession(session.sessionId)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Session
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="order-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-b border-border">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-foreground">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Active Sessions</span>
                </div>
                {stats.active > 0 && (
                  <Badge className="bg-green-600 text-white w-fit">
                    {stats.active} active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activeSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">No active sessions</p>
                  <p className="text-sm text-muted-foreground mt-1">Accept waiting sessions to start consultations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session._id} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-950/30">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-chart-4 rounded-full animate-pulse"></div>
                            <p className="font-semibold text-foreground">Active Session</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Session: {session.sessionId}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started: {new Date(session.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-chart-4 text-primary-foreground">
                          Live
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => completeSession(session.sessionId)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Session
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}