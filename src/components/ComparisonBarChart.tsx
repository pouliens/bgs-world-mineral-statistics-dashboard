import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCompactNumber } from '@/lib/utils';

interface ComparisonData {
  name: string;
  production: number;
  imports: number;
  exports: number;
  total: number;
}

interface ComparisonBarChartProps {
  data: ComparisonData[];
  title: string;
}

type DataView = 'all' | 'production' | 'imports' | 'exports';

export function ComparisonBarChart({
  data,
  title,
}: ComparisonBarChartProps) {
  const [dataView, setDataView] = useState<DataView>('all');

  // Dynamically sort and filter top 5 countries based on selected view
  const getFilteredData = () => {
    let sortedData = [...data];
    
    switch (dataView) {
      case 'production':
        sortedData = sortedData
          .sort((a, b) => b.production - a.production)
          .filter(d => d.production > 0)
          .slice(0, 5);
        break;
      case 'imports':
        sortedData = sortedData
          .sort((a, b) => b.imports - a.imports)
          .filter(d => d.imports > 0)
          .slice(0, 5);
        break;
      case 'exports':
        sortedData = sortedData
          .sort((a, b) => b.exports - a.exports)
          .filter(d => d.exports > 0)
          .slice(0, 5);
        break;
      case 'all':
      default:
        sortedData = sortedData
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        break;
    }
    
    return sortedData;
  };

  const filteredData = getFilteredData();
  
  // Update title based on view
  const getChartTitle = () => {
    switch (dataView) {
      case 'production':
        return 'Top 5 Countries by Production';
      case 'imports':
        return 'Top 5 Countries by Imports';
      case 'exports':
        return 'Top 5 Countries by Exports';
      case 'all':
      default:
        return 'Top 5 Countries by Total Activity';
    }
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{getChartTitle()}</CardTitle>
            <CardDescription>Compare leading countries across different metrics</CardDescription>
          </div>
          <Tabs value={dataView} onValueChange={(value) => setDataView(value as DataView)} className="w-auto">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="production" className="text-xs">Production</TabsTrigger>
              <TabsTrigger value="imports" className="text-xs">Imports</TabsTrigger>
              <TabsTrigger value="exports" className="text-xs">Exports</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              angle={-20}
              textAnchor="end"
              height={90}
            />
            <YAxis
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
              cursor={{ fill: 'rgba(173, 156, 112, 0.1)' }}
              formatter={(value: number) => formatCompactNumber(value, 0)}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {(dataView === 'all' || dataView === 'production') && (
              <Bar
                dataKey="production"
                fill="#002E40"
                name="Production"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            )}
            {(dataView === 'all' || dataView === 'imports') && (
              <Bar
                dataKey="imports"
                fill="#AD9C70"
                name="Imports"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            )}
            {(dataView === 'all' || dataView === 'exports') && (
              <Bar
                dataKey="exports"
                fill="#10b981"
                name="Exports"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
