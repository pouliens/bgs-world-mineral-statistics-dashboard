import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface YearOverYearData {
  year: number;
  production: number;
  imports: number;
  exports: number;
}

interface YearOverYearGrowthChartProps {
  data: YearOverYearData[];
  title?: string;
}

export function YearOverYearGrowthChart({
  data,
  title = 'Year-over-Year Growth Rate (%)',
}: YearOverYearGrowthChartProps) {
  // Calculate year-over-year percentage changes
  const getGrowthData = () => {
    if (data.length < 2) return [];

    return data.slice(1).map((current, index) => {
      const previous = data[index];

      const prodGrowth =
        previous.production !== 0
          ? ((current.production - previous.production) / previous.production) * 100
          : 0;

      const impGrowth =
        previous.imports !== 0
          ? ((current.imports - previous.imports) / previous.imports) * 100
          : 0;

      const expGrowth =
        previous.exports !== 0
          ? ((current.exports - previous.exports) / previous.exports) * 100
          : 0;

      return {
        year: current.year,
        productionGrowth: parseFloat(prodGrowth.toFixed(2)),
        importsGrowth: parseFloat(impGrowth.toFixed(2)),
        exportsGrowth: parseFloat(expGrowth.toFixed(2)),
      };
    });
  };

  const growthData = getGrowthData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.value > 0 ? '+' : ''}
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        <CardDescription>Percentage change compared to previous year</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {growthData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => {
                    switch (value) {
                      case 'productionGrowth':
                        return 'Production';
                      case 'importsGrowth':
                        return 'Imports';
                      case 'exportsGrowth':
                        return 'Exports';
                      default:
                        return value;
                    }
                  }}
                />
                <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
                <Bar
                  dataKey="productionGrowth"
                  fill="#002E40"
                  radius={[4, 4, 0, 0]}
                  name="Production"
                />
                <Bar
                  dataKey="importsGrowth"
                  fill="#AD9C70"
                  radius={[4, 4, 0, 0]}
                  name="Imports"
                />
                <Bar
                  dataKey="exportsGrowth"
                  fill="#1E5A70"
                  radius={[4, 4, 0, 0]}
                  name="Exports"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            <p>Insufficient data for year-over-year comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
