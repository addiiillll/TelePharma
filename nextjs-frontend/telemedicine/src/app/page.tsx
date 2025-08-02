import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Telemedicine Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced healthcare platform connecting patients with doctors through pharmacy devices for remote consultations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">For Patients</CardTitle>
              <CardDescription>
                Request telemedicine sessions and connect with healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>• Request consultation sessions</li>
                <li>• Connect through local pharmacies</li>
                <li>• Real-time communication</li>
                <li>• Easy symptom reporting</li>
              </ul>
              <Link href="/patient">
                <Button className="w-full" size="lg">
                  Start Patient Session
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">For Doctors</CardTitle>
              <CardDescription>
                Manage patient sessions and pharmacy device registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-gray-600">
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

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold mb-2">Pharmacy Integration</h3>
              <p className="text-gray-600">Connect through registered pharmacy devices</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Live session status and notifications</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">JWT authentication and secure communications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}