import { SessionForm } from '@/components/patient/session-form';

export default function PatientPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Telemedicine Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with healthcare professionals from your local pharmacy
          </p>
        </div>
        <SessionForm />
      </div>
    </div>
  );
}