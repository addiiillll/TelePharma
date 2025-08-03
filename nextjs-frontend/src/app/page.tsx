'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Stethoscope, MapPin, Shield, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          credentials: 'include'
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🚀 Next-Gen Healthcare Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            TelePharma
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionary telemedicine platform connecting patients with doctors through pharmacy devices. 
            No registration needed - just walk in and consult.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No Patient Registration</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real-time Consultations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Pharmacy Network</span>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-8 md:mb-16">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-600">For Doctors</CardTitle>
              </div>
              <CardDescription className="text-base">
                Join our network and provide remote consultations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Manage availability status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time session notifications</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Firebase-powered communication</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Session management dashboard</span>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button className="w-full" size="lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button className="w-full" size="lg">
                        Doctor Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                   
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">For Pharmacies</CardTitle>
              </div>
              <CardDescription className="text-base">
                Register devices and enable telemedicine services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Device registration with API keys</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>GPS location tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time device monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Session analytics</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/pharmacy">
                  <Button className="w-full" size="lg" variant="secondary">
                    Register Device
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-600">For Admins</CardTitle>
              </div>
              <CardDescription className="text-base">
                Monitor platform activity and manage operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time session monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Doctor availability tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Device location mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Platform analytics</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/admin/login">
                  <Button className="w-full" size="lg" variant="outline">
                    Admin Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How TelePharma Works</h2>
            <p className="text-muted-foreground text-base md:text-lg">Simple, secure, and efficient telemedicine process</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Visit Pharmacy</h3>
              <p className="text-sm text-muted-foreground">Patient walks into any registered pharmacy location</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Use Device</h3>
              <p className="text-sm text-muted-foreground">Access pharmacy device with no registration required</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Connect Doctor</h3>
              <p className="text-sm text-muted-foreground">System matches with available doctor instantly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Start Session</h3>
              <p className="text-sm text-muted-foreground">Begin real-time consultation via Firebase</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">0 Sec</div>
            <div className="text-sm text-muted-foreground">Patient Registration Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">Real-time</div>
            <div className="text-sm text-muted-foreground">Firebase Communication</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Platform Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
}