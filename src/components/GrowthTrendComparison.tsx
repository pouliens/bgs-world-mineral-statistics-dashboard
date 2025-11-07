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
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/utils';

interface GrowthData {
  commodity: string;
  growthRate: number;
  startValue: number;
  endValue: number;
}

interface GrowthTrendComparisonProps {
  data: GrowthData[];
  title: string;
}

export function GrowthTrendComparison({ data, title }: GrowthTrendComparisonProps) {
  const formatCommodityName = (name: string) => {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const chartData = data
    .map(d => ({
      ...d,
      name: formatCommodityName(d.commodity),
    }))
    .sort((a, b) => b.growthRate - a.growthRate);

  const getBarColor = (value: number) => {
    if (value > 0) return '#10b981'; // Green for positive growth
    if (value < 0) return '#ef4444'; // Red for negative growth
    return '#6b7280'; // Gray for neutral
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        <CardDescription>
          Average annual growth rate over the selected time period. Positive values indicate increasing trends.
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
              label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
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
              formatter={(value: number) => [
                `${value > 0 ? '+' : ''}${value.toFixed(2)}%`,
                'Growth Rate',
              ]}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
            <Bar dataKey="growthRate" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.growthRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
