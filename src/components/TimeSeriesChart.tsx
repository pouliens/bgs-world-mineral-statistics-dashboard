import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCompactNumber } from '@/lib/utils';

interface TimeSeriesData {
  year: number;
  production: number;
  imports: number;
  exports: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function TimeSeriesChart({
  data,
  title,
  countries,
  selectedCountry,
  onCountryChange,
}: TimeSeriesChartProps) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            <CardDescription>Track production, imports, and exports trends over time</CardDescription>
          </div>
          <div className="min-w-[200px]">
            <Label htmlFor="country-filter" className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">
              Filter by Country
            </Label>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger
                id="country-filter"
                className="w-full bg-white dark:bg-white border-2 border-input hover:border-[#002E40] focus:border-[#002E40] focus:ring-2 focus:ring-[#002E40]/20 transition-all"
              >
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Volume', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => formatCompactNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '12px',
              }}
              labelStyle={{ fontWeight: 600, color: '#002E40', marginBottom: '4px' }}
              formatter={(value: number) => formatCompactNumber(value, 0)}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#002E40"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#002E40', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#002E40', strokeWidth: 2, stroke: '#fff' }}
              name="Production"
            />
            <Line
              type="monotone"
              dataKey="imports"
              stroke="#AD9C70"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#AD9C70', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#AD9C70', strokeWidth: 2, stroke: '#fff' }}
              name="Imports"
            />
            <Line
              type="monotone"
              dataKey="exports"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              name="Exports"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
