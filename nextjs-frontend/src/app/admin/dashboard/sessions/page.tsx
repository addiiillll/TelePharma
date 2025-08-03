'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { Search, Activity, ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';

interface Session {
  _id: string;
  sessionId: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
  };
  deviceId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionsResponse {
  sessions: Session[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export default function SessionsPage() {
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSessions();
  }, [currentPage, status]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getSessions({
        page: currentPage,
        limit: 10,
        search,
        status
      });

      if (response.ok) {
        const sessionsData = await response.json();
        setData(sessionsData);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSessions();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'waiting': return <Pause className="h-4 w-4 text-yellow-600" />;
      default: return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const stats = useMemo(() => {
    if (!data?.sessions) return { active: 0, completed: 0, waiting: 0, cancelled: 0 };
    return {
      active: data.sessions.filter(s => s.status === 'active').length,
      completed: data.sessions.filter(s => s.status === 'completed').length,
      waiting: data.sessions.filter(s => s.status === 'waiting').length,
      cancelled: data.sessions.filter(s => s.status === 'cancelled').length
    };
  }, [data?.sessions]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sessions Management</h1>
        <p className="text-muted-foreground">Monitor all telemedicine sessions</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sessions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Waiting</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Cancelled</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions ({data?.pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data?.sessions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>
                      <span className="font-mono text-sm">{session.sessionId?.slice(-8) || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {session.doctorId?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{session.doctorId?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{session.doctorId?.specialization || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{session.deviceId || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(session.status)}
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1) || 'Unknown'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(session.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(session.updatedAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {((data.pagination.current - 1) * data.pagination.limit) + 1} to{' '}
                {Math.min(data.pagination.current * data.pagination.limit, data.pagination.total)} of{' '}
                {data.pagination.total} sessions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {data.pagination.current} of {data.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === data.pagination.pages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}