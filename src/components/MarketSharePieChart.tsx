import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCompactNumber } from '@/lib/utils';

interface MarketShareData {
  name: string;
  production: number;
  imports: number;
  exports: number;
}

interface MarketSharePieChartProps {
  data: MarketShareData[];
  title?: string;
}

// Professional color palette with high contrast and distinctiveness
const COLORS = [
  '#002E40', // Deep Teal (brand primary)
  '#AD9C70', // Gold (brand accent)
  '#E67E22', // Burnt Orange
  '#3498DB', // Sky Blue
  '#27AE60', // Emerald Green
  '#8B4789', // Purple
  '#C0392B', // Deep Red
  '#16A085', // Turquoise
  '#F39C12', // Orange
  '#9B59B6', // Amethyst
  '#1ABC9C', // Turquoise
  '#34495E', // Wet Asphalt
  '#E74C3C', // Alizarin
  '#2ECC71', // Nephritis
];

export function MarketSharePieChart({ data, title = 'Market Share Distribution' }: MarketSharePieChartProps) {
  const [activeTab, setActiveTab] = React.useState<'production' | 'imports' | 'exports'>('production');

  // Prepare data for the selected statistic
  const getBarData = () => {
    const sortedData = data
      .map(item => ({
        name: item.name,
        value: item[activeTab],
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Take top 12 countries individually
    const topCountries = sortedData.slice(0, 12);
    
    // Calculate "Others" if there are more countries
    if (sortedData.length > 12) {
      const othersValue = sortedData
        .slice(12)
        .reduce((sum, item) => sum + item.value, 0);
      
      return [...topCountries, { name: 'Others', value: othersValue }];
    }
    
    return topCountries;
  };

  const barData = getBarData();
  const total = data.reduce((sum, item) => sum + item[activeTab], 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            {formatCompactNumber(payload[0].value, 0)}
          </p>
          <p className="text-sm font-medium text-[#002E40]">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#374151"
          fontSize={12}
          fontWeight={payload.value === 'Others' ? 400 : 500}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const percentage = total > 0 ? ((payload.value / total) * 100).toFixed(0) : '0';
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={11}
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            <CardDescription>Market share percentage by country</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="bg-gray-100">
              <TabsTrigger
                value="production"
                className="data-[state=active]:bg-[#002E40] data-[state=active]:text-white text-xs"
              >
                Production
              </TabsTrigger>
              <TabsTrigger
                value="imports"
                className="data-[state=active]:bg-[#002E40] data-[state=active]:text-white text-xs"
              >
                Imports
              </TabsTrigger>
              <TabsTrigger
                value="exports"
                className="data-[state=active]:bg-[#002E40] data-[state=active]:text-white text-xs"
              >
                Exports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {barData.length > 0 ? (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                <XAxis
                  type="number"
                  tick={<CustomXAxisTick />}
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#D1D5DB' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={<CustomYAxisTick />}
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#D1D5DB' }}
                  width={95}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 46, 64, 0.05)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === 'Others' ? '#94a3b8' : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[500px] flex items-center justify-center text-muted-foreground">
            <p>No data available for {activeTab}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
