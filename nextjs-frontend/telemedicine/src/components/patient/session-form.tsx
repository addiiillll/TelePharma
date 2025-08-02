'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSessionMutation, useGetDevicesQuery } from '@/lib/redux/slices/apiSlice';
import { toast } from 'sonner';

const sessionSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  patientAge: z.number().min(1).max(120),
  symptoms: z.string().min(1, 'Symptoms are required'),
  deviceId: z.string().min(1, 'Please select a pharmacy'),
});

export function SessionForm() {
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const { data: devices } = useGetDevicesQuery({});

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      patientName: '',
      patientAge: 0,
      symptoms: '',
      deviceId: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof sessionSchema>) => {
    try {
      await createSession(values).unwrap();
      toast.success('Session request submitted successfully');
      form.reset();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create session');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request Telemedicine Session</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Pharmacy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a pharmacy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {devices?.map((device: any) => (
                        <SelectItem key={device._id} value={device._id}>
                          {device.pharmacyName} - {device.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your symptoms..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Request Session'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}