'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Video, Phone, X, CheckCircle, Clock } from 'lucide-react';

interface DeviceInterfaceProps {
  apiKey: string;
  pharmacyName: string;
}

export function DeviceInterface({ apiKey, pharmacyName }: DeviceInterfaceProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState('');

  // Poll for session status updates
  useEffect(() => {
    if (sessionData?.sessionId) {
      const interval = setInterval(checkSessionStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [sessionData]);

  const checkSessionStatus = async () => {
    if (!sessionData?.sessionId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/all`);
      if (response.ok) {
        const data = await response.json();
        const currentSession = data.sessions.find((s: any) => s.sessionId === sessionData.sessionId);
        
        if (currentSession) {
          if (currentSession.status === 'completed' || currentSession.status === 'cancelled') {
            // Session ended by doctor
            setSessionData(null);
          } else {
            // Update session status
            setSessionData(prev => ({ ...prev, status: currentSession.status }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to check session status');
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to start session');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveSession = async () => {
    if (!sessionData) return;
    
    try {
      await fetch(`http://localhost:5000/api/sessions/${sessionData.sessionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      setSessionData(null);
    } catch (error) {
      console.error('Failed to leave session');
    }
  };

  // Render different states
  if (sessionData) {
    if (sessionData.status === 'waiting') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Clock className="h-6 w-6 mr-2 text-chart-5" />
                Waiting for Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-chart-5/10 rounded-lg border border-chart-5/20">
                <div className="w-3 h-3 bg-chart-5 rounded-full animate-pulse mx-auto mb-3"></div>
                <p className="font-semibold text-lg">Dr. {sessionData.doctorName}</p>
                <p className="text-sm text-muted-foreground">Session ID: {sessionData.sessionId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait while the doctor accepts your consultation request...
                </p>
              </div>
              
              <Button 
                onClick={leaveSession}
                variant="outline"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Leave Session
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (sessionData.status === 'active') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Video className="h-6 w-6 mr-2 text-chart-4" />
                Session Active
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-chart-4/10 rounded-lg border border-chart-4/20">
                <div className="w-3 h-3 bg-chart-4 rounded-full animate-pulse mx-auto mb-3"></div>
                <p className="font-semibold text-lg">Connected to Dr. {sessionData.doctorName}</p>
                <p className="text-sm text-muted-foreground">Session ID: {sessionData.sessionId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your consultation is now active. Please proceed with your medical consultation.
                </p>
              </div>
              
              <Button 
                onClick={leaveSession}
                variant="outline"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Leave Session
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{pharmacyName}</CardTitle>
          <p className="text-muted-foreground">Telemedicine Device</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center space-y-4">
            <div className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Phone className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Start Consultation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Press the button below to connect with an available doctor
              </p>
            </div>
          </div>
          
          <Button 
            onClick={startSession} 
            className="w-full h-12 text-lg"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Video className="mr-2 h-5 w-5" />
                Start Session
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}