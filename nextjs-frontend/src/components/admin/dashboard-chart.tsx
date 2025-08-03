'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dashboardData from '@/data/dashboard-data.json';

const chartConfig = {
  sessions: {
    label: 'Total Sessions',
    color: 'hsl(var(--chart-1))',
    theme: {
      light: 'hsl(var(--chart-1))',
      dark: 'hsl(var(--chart-1))'
    }
  },
  completedSessions: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
    theme: {
      light: 'hsl(var(--chart-2))',
      dark: 'hsl(var(--chart-2))'
    }
  },
  cancelledSessions: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-3))',
    theme: {
      light: 'hsl(var(--chart-3))',
      dark: 'hsl(var(--chart-3))'
    }
  },
  totalDoctors: {
    label: 'Total Doctors',
    color: 'hsl(var(--chart-1))',
    theme: {
      light: 'hsl(var(--chart-1))',
      dark: 'hsl(var(--chart-1))'
    }
  },
  onlineDoctors: {
    label: 'Online Doctors',
    color: 'hsl(var(--chart-2))',
    theme: {
      light: 'hsl(var(--chart-2))',
      dark: 'hsl(var(--chart-2))'
    }
  },
  totalPharmacies: {
    label: 'Total Pharmacies',
    color: 'hsl(var(--chart-1))',
    theme: {
      light: 'hsl(var(--chart-1))',
      dark: 'hsl(var(--chart-1))'
    }
  },
  activePharmacies: {
    label: 'Active Pharmacies',
    color: 'hsl(var(--chart-2))',
    theme: {
      light: 'hsl(var(--chart-2))',
      dark: 'hsl(var(--chart-2))'
    }
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const [selectedChart, setSelectedChart] = useState('sessions');

  const getChartData = () => {
    switch (selectedChart) {
      case 'sessions':
        return {
          data: dashboardData.sessionsData,
          config: {
            sessions: chartConfig.sessions,
            completedSessions: chartConfig.completedSessions,
            cancelledSessions: chartConfig.cancelledSessions,
          },
          title: 'Telemedicine Sessions',
          description: 'Monthly session statistics',
        };
      case 'doctors':
        return {
          data: dashboardData.doctorsData,
          config: {
            totalDoctors: chartConfig.totalDoctors,
            onlineDoctors: chartConfig.onlineDoctors,
          },
          title: 'Doctor Statistics',
          description: 'Monthly doctor availability',
        };
      case 'pharmacies':
        return {
          data: dashboardData.pharmaciesData,
          config: {
            totalPharmacies: chartConfig.totalPharmacies,
            activePharmacies: chartConfig.activePharmacies,
          },
          title: 'Pharmacy Network',
          description: 'Monthly pharmacy growth',
        };
      default:
        return {
          data: dashboardData.sessionsData,
          config: {
            sessions: chartConfig.sessions,
            completedSessions: chartConfig.completedSessions,
          },
          title: 'Telemedicine Sessions',
          description: 'Monthly session statistics',
        };
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{chartData.title}</CardTitle>
          <CardDescription>{chartData.description}</CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <Select value={selectedChart} onValueChange={setSelectedChart}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="doctors">Doctors</SelectItem>
                <SelectItem value="pharmacies">Pharmacies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartData.config} className="aspect-auto h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} className="stroke-muted-foreground/20" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent className="bg-background border-border" />} 
            />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartData.config).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={chartData.config[key as keyof typeof chartData.config].color}
                fillOpacity={0.4}
                stroke={chartData.config[key as keyof typeof chartData.config].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}