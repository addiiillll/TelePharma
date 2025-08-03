'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { Search, Building2, ChevronLeft, ChevronRight, MapPin, Clock, Wifi, WifiOff } from 'lucide-react';
import { PharmacyMap } from '@/components/admin/pharmacy-map';

interface Pharmacy {
  _id: string;
  deviceId: string;
  pharmacyName: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  isActive: boolean;
  lastPing: string;
  createdAt: string;
}

interface PharmaciesResponse {
  pharmacies: Pharmacy[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export default function PharmaciesPage() {
  const [data, setData] = useState<PharmaciesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPharmacies();
  }, [currentPage, status]);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPharmacies({
        page: currentPage,
        limit: 10,
        search,
        status
      });

      if (response.ok) {
        const pharmaciesData = await response.json();
        setData(pharmaciesData);
      }
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPharmacies();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastPing = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const stats = useMemo(() => {
    if (!data?.pharmacies) return { active: 0, inactive: 0 };
    return {
      active: data.pharmacies.filter(p => p.isActive).length,
      inactive: data.pharmacies.filter(p => !p.isActive).length
    };
  }, [data?.pharmacies]);

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
        <h1 className="text-3xl font-bold">Pharmacies Management</h1>
        <p className="text-muted-foreground">Monitor all pharmacy devices and locations</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pharmacies by name, device ID, or location..."
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
                <SelectItem value="all">All Pharmacies</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {data?.pharmacies && data.pharmacies.length > 0 && (
        <PharmacyMap pharmacies={data.pharmacies} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Pharmacies</span>
            </div>
            <p className="text-2xl font-bold">{data?.pagination.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pharmacies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pharmacies ({data?.pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data?.pharmacies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pharmacies found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacy</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Ping</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{pharmacy.pharmacyName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{pharmacy.deviceId}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{pharmacy.location?.address || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono text-muted-foreground">
                        {pharmacy.location?.latitude && pharmacy.location?.longitude ? (
                          <>
                            <div>Lat: {pharmacy.location.latitude.toFixed(6)}</div>
                            <div>Lng: {pharmacy.location.longitude.toFixed(6)}</div>
                          </>
                        ) : pharmacy.location?.coordinates ? (
                          <>
                            <div>Lat: {pharmacy.location.coordinates[1]?.toFixed(6)}</div>
                            <div>Lng: {pharmacy.location.coordinates[0]?.toFixed(6)}</div>
                          </>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          pharmacy.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <Badge variant={pharmacy.isActive ? "default" : "secondary"} className="text-xs">
                          {pharmacy.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatLastPing(pharmacy.lastPing)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(pharmacy.createdAt)}
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
                {data.pagination.total} pharmacies
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