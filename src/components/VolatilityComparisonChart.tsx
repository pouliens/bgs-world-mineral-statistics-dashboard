import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VolatilityData {
  commodity: string;
  volatility: number;
  avgValue: number;
}

interface VolatilityComparisonChartProps {
  data: VolatilityData[];
  title: string;
}

const COLORS = ['#002E40', '#AD9C70', '#005571', '#C5B88A', '#007A99', '#8B7A5E'];

export function VolatilityComparisonChart({ data, title }: VolatilityComparisonChartProps) {
  const formatCommodityName = (name: string) => {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const chartData = data.map(d => ({
    ...d,
    name: formatCommodityName(d.commodity),
  }));

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        <CardDescription>
          Volatility measures the degree of variation in production over time. Higher values indicate more fluctuation.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#6b7280', fontSize: 11 }}
            />
            <YAxis
              label={{ value: 'Volatility (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              tick={{ fill: '#6b7280', fontSize: 12 }}
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
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Volatility']}
            />
            <Bar dataKey="volatility" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
