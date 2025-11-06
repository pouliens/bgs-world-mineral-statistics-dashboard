import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonData {
  name: string;
  value: number;
}

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title: string;
  color?: string;
}

export function ComparisonBarChart({
  data,
  title,
  color = '#003C6E',
}: ComparisonBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend />
            <Bar dataKey="value" fill={color} name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
