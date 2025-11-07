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
import { formatCompactNumber } from '@/lib/utils';

interface MultiCommodityDataPoint {
  year: number;
  [key: string]: number; // Dynamic keys for each commodity
}

interface MultiCommodityChartProps {
  data: MultiCommodityDataPoint[];
  commodities: string[];
  title: string;
}

const CHART_COLORS = [
  '#002E40', // Deep Teal
  '#AD9C70', // Gold
  '#005571', // Mid Teal
  '#C5B88A', // Light Gold
  '#007A99', // Lighter Teal
  '#8B7A5E', // Dark Gold
];

export function MultiCommodityChart({
  data,
  commodities,
  title,
}: MultiCommodityChartProps) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        <CardDescription>Compare production trends across multiple commodities</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={450}>
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
            {commodities.map((commodity, index) => (
              <Line
                key={commodity}
                type="monotone"
                dataKey={commodity}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                name={commodity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
