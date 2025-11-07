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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCompactNumber } from '@/lib/utils';

interface RegionalData {
  region: string;
  production: number;
  imports: number;
  exports: number;
  countries: Set<string>;
}

interface CountryData {
  name: string;
  production: number;
  imports: number;
  exports: number;
}

interface RegionalDistributionChartProps {
  data: CountryData[];
  title?: string;
}

// Country to region mapping
const COUNTRY_TO_REGION: Record<string, string> = {
  // North America
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'United States of America': 'North America',
  'USA': 'North America',

  // South America
  'Brazil': 'South America',
  'Argentina': 'South America',
  'Chile': 'South America',
  'Peru': 'South America',
  'Colombia': 'South America',
  'Venezuela': 'South America',
  'Bolivia': 'South America',
  'Ecuador': 'South America',
  'Paraguay': 'South America',
  'Uruguay': 'South America',
  'Guyana': 'South America',
  'Suriname': 'South America',

  // Europe
  'United Kingdom': 'Europe',
  'Germany': 'Europe',
  'France': 'Europe',
  'Italy': 'Europe',
  'Spain': 'Europe',
  'Poland': 'Europe',
  'Romania': 'Europe',
  'Netherlands': 'Europe',
  'Belgium': 'Europe',
  'Greece': 'Europe',
  'Portugal': 'Europe',
  'Czech Republic': 'Europe',
  'Hungary': 'Europe',
  'Sweden': 'Europe',
  'Austria': 'Europe',
  'Bulgaria': 'Europe',
  'Denmark': 'Europe',
  'Finland': 'Europe',
  'Slovakia': 'Europe',
  'Norway': 'Europe',
  'Ireland': 'Europe',
  'Croatia': 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  'Serbia': 'Europe',
  'Lithuania': 'Europe',
  'Slovenia': 'Europe',
  'Latvia': 'Europe',
  'Estonia': 'Europe',
  'Albania': 'Europe',
  'North Macedonia': 'Europe',
  'Moldova': 'Europe',
  'Malta': 'Europe',
  'Switzerland': 'Europe',
  'Iceland': 'Europe',
  'Russia': 'Europe',
  'Russian Federation': 'Europe',
  'Ukraine': 'Europe',
  'Belarus': 'Europe',

  // Asia
  'China': 'Asia',
  'India': 'Asia',
  'Japan': 'Asia',
  'South Korea': 'Asia',
  'Indonesia': 'Asia',
  'Thailand': 'Asia',
  'Vietnam': 'Asia',
  'Philippines': 'Asia',
  'Malaysia': 'Asia',
  'Singapore': 'Asia',
  'Pakistan': 'Asia',
  'Bangladesh': 'Asia',
  'Myanmar': 'Asia',
  'Kazakhstan': 'Asia',
  'Uzbekistan': 'Asia',
  'Mongolia': 'Asia',
  'Nepal': 'Asia',
  'Sri Lanka': 'Asia',
  'Afghanistan': 'Asia',
  'Cambodia': 'Asia',
  'Laos': 'Asia',
  'Taiwan': 'Asia',
  'North Korea': 'Asia',
  'Kyrgyzstan': 'Asia',
  'Tajikistan': 'Asia',
  'Turkmenistan': 'Asia',
  'Iran': 'Asia',
  'Iraq': 'Asia',
  'Saudi Arabia': 'Asia',
  'United Arab Emirates': 'Asia',
  'Turkey': 'Asia',
  'Israel': 'Asia',
  'Jordan': 'Asia',
  'Syria': 'Asia',
  'Lebanon': 'Asia',
  'Kuwait': 'Asia',
  'Qatar': 'Asia',
  'Bahrain': 'Asia',
  'Oman': 'Asia',
  'Yemen': 'Asia',

  // Africa
  'South Africa': 'Africa',
  'Egypt': 'Africa',
  'Nigeria': 'Africa',
  'Kenya': 'Africa',
  'Morocco': 'Africa',
  'Algeria': 'Africa',
  'Tunisia': 'Africa',
  'Ghana': 'Africa',
  'Ethiopia': 'Africa',
  'Tanzania': 'Africa',
  'Uganda': 'Africa',
  'Zimbabwe': 'Africa',
  'Zambia': 'Africa',
  'Botswana': 'Africa',
  'Namibia': 'Africa',
  'Mozambique': 'Africa',
  'Angola': 'Africa',
  'Senegal': 'Africa',
  'Mali': 'Africa',
  'Burkina Faso': 'Africa',
  'Ivory Coast': 'Africa',
  'Cameroon': 'Africa',
  'Madagascar': 'Africa',
  'Mauritania': 'Africa',
  'Niger': 'Africa',
  'Chad': 'Africa',
  'Congo': 'Africa',
  'Democratic Republic of the Congo': 'Africa',
  'Gabon': 'Africa',
  'Rwanda': 'Africa',
  'Burundi': 'Africa',
  'Libya': 'Africa',
  'Sudan': 'Africa',
  'Eritrea': 'Africa',

  // Oceania
  'Australia': 'Oceania',
  'New Zealand': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'Fiji': 'Oceania',
  'New Caledonia': 'Oceania',
  'Solomon Islands': 'Oceania',
};

export function RegionalDistributionChart({
  data,
  title = 'Regional Distribution',
}: RegionalDistributionChartProps) {
  const [activeTab, setActiveTab] = React.useState<'production' | 'imports' | 'exports'>('production');

  // Aggregate data by region
  const getRegionalData = () => {
    const regionMap = new Map<string, RegionalData>();

    data.forEach((country) => {
      const region = COUNTRY_TO_REGION[country.name] || 'Other';

      if (!regionMap.has(region)) {
        regionMap.set(region, {
          region,
          production: 0,
          imports: 0,
          exports: 0,
          countries: new Set(),
        });
      }

      const regionData = regionMap.get(region)!;
      regionData.production += country.production || 0;
      regionData.imports += country.imports || 0;
      regionData.exports += country.exports || 0;
      regionData.countries.add(country.name);
    });

    return Array.from(regionMap.values())
      .map(region => ({
        region: `${region.region} (${region.countries.size})`,
        production: region.production,
        imports: region.imports,
        exports: region.exports,
      }))
      .sort((a, b) => b[activeTab] - a[activeTab]);
  };

  const regionalData = getRegionalData();

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
                {formatCompactNumber(entry.value, 0)}
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
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            <CardDescription>Aggregated by region (number of countries shown)</CardDescription>
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
        {regionalData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionalData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  width={95}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey={activeTab}
                  fill={activeTab === 'production' ? '#002E40' : activeTab === 'imports' ? '#AD9C70' : '#1E5A70'}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
