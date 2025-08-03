'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetSessionsQuery, useUpdateSessionStatusMutation } from '@/lib/redux/slices/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { socketService } from '@/lib/socket';
import { toast } from 'sonner';

export function SessionManagement() {
  const { data: sessions, refetch } = useGetSessionsQuery({});
  const [updateStatus, { isLoading }] = useUpdateSessionStatusMutation();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      const socket = socketService.connect(token);
      
      socket.on('sessionUpdate', () => {
        refetch();
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token, refetch]);

  const handleStatusUpdate = async (sessionId: string, status: string) => {
    try {
      await updateStatus({ id: sessionId, status }).unwrap();
      toast.success(`Session ${status}`);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions?.map((session: any) => (
            <div key={session._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Patient: {session.patientName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Device: {session.deviceId?.pharmacyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
              </div>
              
              {session.symptoms && (
                <p className="text-sm mb-3">
                  <strong>Symptoms:</strong> {session.symptoms}
                </p>
              )}

              <div className="flex gap-2">
                {session.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(session._id, 'active')}
                      disabled={isLoading}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(session._id, 'cancelled')}
                      disabled={isLoading}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {session.status === 'active' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(session._id, 'completed')}
                    disabled={isLoading}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {!sessions?.length && (
            <p className="text-center text-muted-foreground py-8">
              No sessions available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}