'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Telemedicine Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced healthcare platform where patients visit pharmacies to connect with doctors through registered devices for remote consultations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">For Pharmacies</CardTitle>
              <CardDescription>
                Register pharmacy devices and enable patient consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li>• Register pharmacy devices</li>
                <li>• Enable patient sessions</li>
                <li>• Location-based services</li>
                <li>• Device status monitoring</li>
              </ul>
              <Link href="/pharmacy">
                <Button className="w-full" size="lg">
                  Pharmacy Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">For Doctors</CardTitle>
              <CardDescription>
                Manage patient sessions and pharmacy device registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-muted-foreground">
                <li>• Manage patient sessions</li>
                <li>• Register pharmacy devices</li>
                <li>• Real-time notifications</li>
                <li>• Session status tracking</li>
              </ul>
              <Link href="/login">
                <Button className="w-full" size="lg" variant="outline">
                  Doctor Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}