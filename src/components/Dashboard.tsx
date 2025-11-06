import React, { useState, useEffect } from 'react';
import { FilterPanel } from './FilterPanel';
import { TimeSeriesChart } from './TimeSeriesChart';
import { ComparisonBarChart } from './ComparisonBarChart';
import { MineralDataTable } from './MineralDataTable';
import { InsightsPanel } from './InsightsPanel';
import { Card, CardContent } from '@/components/ui/card';
import { fetchMineralData } from '@/lib/mineralService';
import type {
  FilterOptions,
  MineralProperties,
  ChartDataPoint,
  MetricCard,
} from '@/types/minerals';

export function Dashboard({ client:load }: { 'client:load': true }) {
  const [filters, setFilters] = useState<FilterOptions>({
    commodity: 'copper',
    countries: [],
    yearFrom: 2010,
    yearTo: 2023,
    dataType: 'production',
  });

  const [data, setData] = useState<MineralProperties[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when filters change
  useEffect(() => {
    const loadData = async () => {
      if (!filters.commodity) return;

      setLoading(true);
      setError(null);

      try {
        const mineralData = await fetchMineralData({
          commodity: filters.commodity,
          yearFrom: filters.yearFrom,
          yearTo: filters.yearTo,
        });

        const features = mineralData.features || [];
        const properties = features.map((f) => f.properties);
        setData(properties);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters.commodity, filters.yearFrom, filters.yearTo]);

  // Map filter dataType to actual API field name
  const getDataField = (): keyof MineralProperties => {
    switch (filters.dataType) {
      case 'production':
        return 'PROD_AMOUNT';
      case 'imports':
        return 'IMP_AMOUNT';
      case 'exports':
        return 'EXP_AMOUNT';
      default:
        return 'PROD_AMOUNT';
    }
  };

  // Process data for charts
  const getChartData = (): ChartDataPoint[] => {
    const dataKey = getDataField();

    const aggregated = data.reduce((acc, item) => {
      const year = item.YEAR;
      const value = item[dataKey] as number | undefined;

      if (!acc[year]) {
        acc[year] = { total: 0, count: 0 };
      }

      if (value !== undefined && value !== null) {
        acc[year].total += value;
        acc[year].count += 1;
      }

      return acc;
    }, {} as Record<number, { total: number; count: number }>);

    return Object.entries(aggregated)
      .map(([year, { total, count }]) => ({
        year: Number(year),
        value: count > 0 ? total / count : 0,
      }))
      .sort((a, b) => a.year - b.year);
  };

  // Get top countries for comparison
  const getTopCountries = (limit: number = 5) => {
    const dataKey = getDataField();

    const countryTotals = data.reduce((acc, item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY || 'Unknown';
      const value = item[dataKey] as number | undefined;

      if (!acc[country]) {
        acc[country] = 0;
      }

      if (value !== undefined && value !== null) {
        acc[country] += value;
      }

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  // Calculate metrics
  const getMetrics = (): MetricCard[] => {
    if (data.length === 0) return [];

    const dataKey = getDataField();
    const values = data
      .map((item) => item[dataKey] as number | undefined)
      .filter((v): v is number => v !== undefined && v !== null);

    if (values.length === 0) return [];

    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend (compare last year to previous year)
    const chartData = getChartData();
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let change = 0;

    if (chartData.length >= 2) {
      const lastValue = chartData[chartData.length - 1].value;
      const previousValue = chartData[chartData.length - 2].value;
      change = previousValue !== 0 ? ((lastValue - previousValue) / previousValue) * 100 : 0;

      if (change > 1) trend = 'up';
      else if (change < -1) trend = 'down';
      else trend = 'stable';
    }

    return [
      {
        title: `Total ${filters.dataType}`,
        value: total.toLocaleString(),
        trend,
        change: Math.abs(Math.round(change)),
      },
      {
        title: 'Average',
        value: Math.round(avg).toLocaleString(),
      },
      {
        title: 'Peak Value',
        value: max.toLocaleString(),
      },
      {
        title: 'Lowest Value',
        value: min.toLocaleString(),
      },
    ];
  };

  // Export functions
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = ['Year', 'Country', 'Commodity', 'Production', 'Imports', 'Exports'];
    const rows = data.map((item) => [
      item.YEAR,
      item.COUNTRY_NAME || item.COUNTRY || '',
      item.ERML_COMMODITY || '',
      `${item.PROD_AMOUNT || ''}${item.PROD_UNIT ? ' ' + item.PROD_UNIT : ''}`,
      `${item.IMP_AMOUNT || ''}${item.IMP_UNIT ? ' ' + item.IMP_UNIT : ''}`,
      `${item.EXP_AMOUNT || ''}${item.EXP_UNIT ? ' ' + item.EXP_UNIT : ''}`,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mineral-data-${filters.commodity}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (data.length === 0) return;

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mineral-data-${filters.commodity}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = getChartData();
  const topCountries = getTopCountries();
  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-[#003C6E] text-white py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            BGS World Mineral Statistics
          </h1>
          <p className="text-blue-100">
            Comprehensive mineral production, import, and export data from 1970-2023
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-3">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Center Panel - Visualizations */}
          <section className="lg:col-span-6 space-y-6">
            {loading && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p>Loading data...</p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card>
                <CardContent className="py-8 text-center text-red-600">
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            {!loading && !error && data.length > 0 && (
              <>
                <TimeSeriesChart
                  data={chartData}
                  title={`${filters.dataType.charAt(0).toUpperCase() + filters.dataType.slice(1)} Trends Over Time`}
                  color="#003C6E"
                />

                <ComparisonBarChart
                  data={topCountries}
                  title={`Top 5 Countries by ${filters.dataType}`}
                  color="#003C6E"
                />

                <MineralDataTable data={data} onExport={exportToCSV} />
              </>
            )}

            {!loading && !error && data.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p>No data available for the selected filters.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Right Sidebar - Insights */}
          <aside className="lg:col-span-3">
            <InsightsPanel
              metrics={metrics}
              onExportCSV={exportToCSV}
              onExportJSON={exportToJSON}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
