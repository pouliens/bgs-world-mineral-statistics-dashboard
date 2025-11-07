import React, { useState, useEffect } from 'react';
import { FilterPanel } from './FilterPanel';
import { TimeSeriesChart } from './TimeSeriesChart';
import { ComparisonBarChart } from './ComparisonBarChart';
import { MultiCommodityChart } from './MultiCommodityChart';
import { MineralDataTable } from './MineralDataTable';
import { MetricsCard } from './MetricsCard';
import { MarketSharePieChart } from './MarketSharePieChart';
import { YearOverYearGrowthChart } from './YearOverYearGrowthChart';
import { RegionalDistributionChart } from './RegionalDistributionChart';
import { ConcentrationIndexCard } from './ConcentrationIndexCard';
import { ComparisonMetricsCards } from './ComparisonMetricsCards';
import { VolatilityComparisonChart } from './VolatilityComparisonChart';
import { GrowthTrendComparison } from './GrowthTrendComparison';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { fetchMineralData } from '@/lib/mineralService';
import type {
  FilterOptions,
  MineralProperties,
  ChartDataPoint,
  MetricCard,
} from '@/types/minerals';

export function Dashboard() {
  const [filters, setFilters] = useState<FilterOptions>({
    commodity: 'copper',
    countries: [],
    yearFrom: 2010,
    yearTo: 2023,
    dataType: 'production', // Keep for backward compatibility but not used in UI
  });

  const [data, setData] = useState<MineralProperties[]>([]);
  const [multiCommodityData, setMultiCommodityData] = useState<Record<string, MineralProperties[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedYoYCountry, setSelectedYoYCountry] = useState<string>('all');

  // Reset country filters when commodity or filters change
  useEffect(() => {
    setSelectedCountry('all');
    setSelectedYoYCountry('all');
  }, [filters.commodity, filters.yearFrom, filters.yearTo]);

  // Fetch data when filters change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Comparison mode: fetch data for multiple commodities
        if (filters.comparisonMode && filters.selectedCommodities && filters.selectedCommodities.length > 0) {
          const dataPromises = filters.selectedCommodities.map(async (commodity) => {
            const mineralData = await fetchMineralData({
              commodity,
              yearFrom: filters.yearFrom,
              yearTo: filters.yearTo,
            });
            return { commodity, data: mineralData.features.map((f) => f.properties) };
          });

          const results = await Promise.all(dataPromises);
          const commodityDataMap: Record<string, MineralProperties[]> = {};
          results.forEach(({ commodity, data }) => {
            commodityDataMap[commodity] = data;
          });

          setMultiCommodityData(commodityDataMap);
          setData([]); // Clear single commodity data
        }
        // Single commodity mode
        else if (!filters.comparisonMode && filters.commodity) {
          const mineralData = await fetchMineralData({
            commodity: filters.commodity,
            yearFrom: filters.yearFrom,
            yearTo: filters.yearTo,
          });

          const features = mineralData.features || [];
          const properties = features.map((f) => f.properties);
          setData(properties);
          setMultiCommodityData({}); // Clear multi-commodity data
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters.commodity, filters.yearFrom, filters.yearTo, filters.comparisonMode, filters.selectedCommodities]);

  // Get unique countries from data
  const getUniqueCountries = () => {
    const countries = new Set<string>();
    data.forEach((item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY;
      if (country && country !== 'Unknown') {
        countries.add(country);
      }
    });
    return Array.from(countries).sort();
  };

  // Process data for charts - now returns all three statistics types, with optional country filter
  const getChartData = (countryFilter: string = 'all') => {
    // Filter data by country if specified
    const filteredData = countryFilter === 'all'
      ? data
      : data.filter(item => {
          const country = item.COUNTRY_NAME || item.COUNTRY;
          return country === countryFilter;
        });

    const aggregated = filteredData.reduce((acc, item) => {
      const year = item.YEAR;

      if (!acc[year]) {
        acc[year] = {
          production: { total: 0, count: 0 },
          imports: { total: 0, count: 0 },
          exports: { total: 0, count: 0 }
        };
      }

      // Production
      if (item.PROD_AMOUNT !== undefined && item.PROD_AMOUNT !== null) {
        acc[year].production.total += item.PROD_AMOUNT;
        acc[year].production.count += 1;
      }

      // Imports
      if (item.IMP_AMOUNT !== undefined && item.IMP_AMOUNT !== null) {
        acc[year].imports.total += item.IMP_AMOUNT;
        acc[year].imports.count += 1;
      }

      // Exports
      if (item.EXP_AMOUNT !== undefined && item.EXP_AMOUNT !== null) {
        acc[year].exports.total += item.EXP_AMOUNT;
        acc[year].exports.count += 1;
      }

      return acc;
    }, {} as Record<number, {
      production: { total: number; count: number };
      imports: { total: number; count: number };
      exports: { total: number; count: number };
    }>);

    return Object.entries(aggregated)
      .map(([year, stats]) => ({
        year: Number(year),
        production: stats.production.count > 0 ? stats.production.total / stats.production.count : 0,
        imports: stats.imports.count > 0 ? stats.imports.total / stats.imports.count : 0,
        exports: stats.exports.count > 0 ? stats.exports.total / stats.exports.count : 0,
      }))
      .sort((a, b) => a.year - b.year);
  };

  // Get top countries for comparison - now returns all three statistics types
  const getTopCountries = (limit: number = 5) => {
    const countryTotals = data.reduce((acc, item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY || 'Unknown';

      if (!acc[country]) {
        acc[country] = { production: 0, imports: 0, exports: 0 };
      }

      if (item.PROD_AMOUNT !== undefined && item.PROD_AMOUNT !== null) {
        acc[country].production += item.PROD_AMOUNT;
      }

      if (item.IMP_AMOUNT !== undefined && item.IMP_AMOUNT !== null) {
        acc[country].imports += item.IMP_AMOUNT;
      }

      if (item.EXP_AMOUNT !== undefined && item.EXP_AMOUNT !== null) {
        acc[country].exports += item.EXP_AMOUNT;
      }

      return acc;
    }, {} as Record<string, { production: number; imports: number; exports: number }>);

    // Get top countries by total activity (sum of all three)
    return Object.entries(countryTotals)
      .map(([name, stats]) => ({
        name,
        production: stats.production,
        imports: stats.imports,
        exports: stats.exports,
        total: stats.production + stats.imports + stats.exports
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  };

  // Get all countries for regional analysis
  const getAllCountries = () => {
    const countryTotals = data.reduce((acc, item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY || 'Unknown';

      if (!acc[country]) {
        acc[country] = { production: 0, imports: 0, exports: 0 };
      }

      if (item.PROD_AMOUNT !== undefined && item.PROD_AMOUNT !== null) {
        acc[country].production += item.PROD_AMOUNT;
      }

      if (item.IMP_AMOUNT !== undefined && item.IMP_AMOUNT !== null) {
        acc[country].imports += item.IMP_AMOUNT;
      }

      if (item.EXP_AMOUNT !== undefined && item.EXP_AMOUNT !== null) {
        acc[country].exports += item.EXP_AMOUNT;
      }

      return acc;
    }, {} as Record<string, { production: number; imports: number; exports: number }>);

    return Object.entries(countryTotals)
      .map(([name, stats]) => ({
        name,
        production: stats.production,
        imports: stats.imports,
        exports: stats.exports,
        total: stats.production + stats.imports + stats.exports
      }))
      .filter(country => country.production > 0 || country.imports > 0 || country.exports > 0);
  };

  // Calculate comprehensive metrics with useful insights
  const getMetrics = (): MetricCard[] => {
    if (data.length === 0) return [];

    const metrics: MetricCard[] = [];
    const chartData = getChartData();
    const yearRange = filters.yearTo - filters.yearFrom + 1;

    // 1. Average Annual Production
    const prodValues = chartData.map(d => d.production).filter(v => v > 0);
    if (prodValues.length > 0) {
      const avgAnnual = prodValues.reduce((sum, v) => sum + v, 0) / prodValues.length;
      const unit = data.find(d => d.PROD_UNIT)?.PROD_UNIT || '';

      metrics.push({
        title: 'Avg Annual Production',
        value: avgAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        subtitle: unit ? `per year (${unit})` : 'per year',
        icon: 'activity',
      });
    }

    // 2. Top Producer
    const countryProduction = data.reduce((acc, item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY || 'Unknown';
      if (item.PROD_AMOUNT && item.PROD_AMOUNT > 0) {
        acc[country] = (acc[country] || 0) + item.PROD_AMOUNT;
      }
      return acc;
    }, {} as Record<string, number>);

    const topProducer = Object.entries(countryProduction)
      .sort(([, a], [, b]) => b - a)[0];

    if (topProducer) {
      const [country, amount] = topProducer;
      const totalProduction = Object.values(countryProduction).reduce((sum, v) => sum + v, 0);
      const percentage = ((amount / totalProduction) * 100).toFixed(1);

      metrics.push({
        title: 'Top Producer',
        value: country,
        subtitle: `${percentage}% of total production`,
        icon: 'trophy',
      });
    }

    // 3. Top Importer (if import data exists)
    const countryImports = data.reduce((acc, item) => {
      const country = item.COUNTRY_NAME || item.COUNTRY || 'Unknown';
      if (item.IMP_AMOUNT && item.IMP_AMOUNT > 0) {
        acc[country] = (acc[country] || 0) + item.IMP_AMOUNT;
      }
      return acc;
    }, {} as Record<string, number>);

    const topImporter = Object.entries(countryImports)
      .sort(([, a], [, b]) => b - a)[0];

    if (topImporter && topImporter[1] > 0) {
      const [country, amount] = topImporter;
      const totalImports = Object.values(countryImports).reduce((sum, v) => sum + v, 0);
      const percentage = ((amount / totalImports) * 100).toFixed(1);

      metrics.push({
        title: 'Top Importer',
        value: country,
        subtitle: `${percentage}% of total imports`,
        icon: 'trophy',
      });
    }

    // 4. Peak Production Year
    if (prodValues.length > 0) {
      const maxProd = Math.max(...prodValues);
      const peakYear = chartData.find(d => d.production === maxProd)?.year;

      if (peakYear) {
        const unit = data.find(d => d.PROD_UNIT)?.PROD_UNIT || '';
        metrics.push({
          title: 'Peak Production Year',
          value: peakYear.toString(),
          subtitle: `${maxProd.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${unit}`,
          icon: 'calendar',
        });
      }
    }

    // 5. Active Countries
    const uniqueCountries = new Set(
      data
        .filter(d => (d.PROD_AMOUNT && d.PROD_AMOUNT > 0) ||
                     (d.IMP_AMOUNT && d.IMP_AMOUNT > 0) ||
                     (d.EXP_AMOUNT && d.EXP_AMOUNT > 0))
        .map(d => d.COUNTRY_NAME || d.COUNTRY || 'Unknown')
    );

    metrics.push({
      title: 'Active Countries',
      value: uniqueCountries.size.toString(),
      subtitle: `in ${yearRange} year${yearRange > 1 ? 's' : ''}`,
      icon: 'globe',
    });

    // 6. Recent Growth Trend (Year-over-Year)
    if (chartData.length >= 2) {
      const lastValue = chartData[chartData.length - 1].production;
      const previousValue = chartData[chartData.length - 2].production;
      const change = previousValue !== 0 ? ((lastValue - previousValue) / previousValue) * 100 : 0;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (change > 1) trend = 'up';
      else if (change < -1) trend = 'down';

      metrics.push({
        title: 'Recent Trend',
        value: chartData[chartData.length - 1].year.toString(),
        subtitle: `${Math.abs(change).toFixed(1)}% vs previous year`,
        trend,
        change: Math.abs(Math.round(change)),
      });
    }

    return metrics;
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

  // Process multi-commodity data for comparison chart - aggregates all statistics together
  const getMultiCommodityChartData = () => {
    const allYears = new Set<number>();

    // Collect all years
    Object.values(multiCommodityData).forEach((commodityData) => {
      commodityData.forEach((item) => allYears.add(item.YEAR));
    });

    const years = Array.from(allYears).sort((a, b) => a - b);

    // Build chart data with a data point for each year and commodity
    return years.map((year) => {
      const dataPoint: any = { year };

      Object.entries(multiCommodityData).forEach(([commodity, commodityData]) => {
        const yearData = commodityData.filter((item) => item.YEAR === year);

        // Calculate total volume (production + imports + exports)
        const prodTotal = yearData.reduce((sum, item) => sum + (item.PROD_AMOUNT || 0), 0);
        const impTotal = yearData.reduce((sum, item) => sum + (item.IMP_AMOUNT || 0), 0);
        const expTotal = yearData.reduce((sum, item) => sum + (item.EXP_AMOUNT || 0), 0);

        // Aggregate all statistics together
        const totalVolume = prodTotal + impTotal + expTotal;
        dataPoint[commodity] = yearData.length > 0 ? totalVolume / yearData.length : 0;
      });

      return dataPoint;
    });
  };

  // Calculate comparison metrics for each commodity
  const getComparisonMetrics = () => {
    return Object.entries(multiCommodityData).map(([commodity, commodityData]) => {
      const yearlyVolumes = commodityData.reduce((acc, item) => {
        const year = item.YEAR;
        const volume = (item.PROD_AMOUNT || 0) + (item.IMP_AMOUNT || 0) + (item.EXP_AMOUNT || 0);

        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(volume);
        return acc;
      }, {} as Record<number, number[]>);

      // Calculate annual averages
      const annualAverages = Object.entries(yearlyVolumes)
        .map(([year, volumes]) => ({
          year: Number(year),
          value: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
        }))
        .sort((a, b) => a.year - b.year);

      const values = annualAverages.map(d => d.value).filter(v => v > 0);

      if (values.length === 0) {
        return {
          commodity,
          totalVolume: 0,
          avgAnnual: 0,
          peakYear: 0,
          peakValue: 0,
          growthRate: 0,
          volatility: 0,
        };
      }

      // Calculate metrics
      const totalVolume = values.reduce((sum, v) => sum + v, 0);
      const avgAnnual = totalVolume / values.length;
      const peakValue = Math.max(...values);
      const peakYear = annualAverages.find(d => d.value === peakValue)?.year || 0;

      // Calculate growth rate (CAGR)
      const firstValue = annualAverages[0].value;
      const lastValue = annualAverages[annualAverages.length - 1].value;
      const years = annualAverages.length - 1;
      const growthRate = years > 0 && firstValue > 0
        ? (Math.pow(lastValue / firstValue, 1 / years) - 1) * 100
        : 0;

      // Calculate volatility (coefficient of variation)
      const mean = avgAnnual;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      const volatility = mean > 0 ? (stdDev / mean) * 100 : 0;

      return {
        commodity,
        totalVolume,
        avgAnnual,
        peakYear,
        peakValue,
        growthRate,
        volatility,
      };
    });
  };

  // Get volatility data for chart
  const getVolatilityData = () => {
    const metrics = getComparisonMetrics();
    return metrics.map(m => ({
      commodity: m.commodity,
      volatility: m.volatility,
      avgValue: m.avgAnnual,
    }));
  };

  // Get growth data for chart
  const getGrowthData = () => {
    const metrics = getComparisonMetrics();
    return metrics.map(m => {
      // Get first and last year data
      const commodityData = multiCommodityData[m.commodity];
      const sortedByYear = [...commodityData].sort((a, b) => a.YEAR - b.YEAR);
      const startValue = sortedByYear[0]
        ? (sortedByYear[0].PROD_AMOUNT || 0) + (sortedByYear[0].IMP_AMOUNT || 0) + (sortedByYear[0].EXP_AMOUNT || 0)
        : 0;
      const endValue = sortedByYear[sortedByYear.length - 1]
        ? (sortedByYear[sortedByYear.length - 1].PROD_AMOUNT || 0) +
          (sortedByYear[sortedByYear.length - 1].IMP_AMOUNT || 0) +
          (sortedByYear[sortedByYear.length - 1].EXP_AMOUNT || 0)
        : 0;

      return {
        commodity: m.commodity,
        growthRate: m.growthRate,
        startValue,
        endValue,
      };
    });
  };

  const chartData = getChartData(selectedCountry);
  const yoyChartData = getChartData(selectedYoYCountry);
  const topCountries = getTopCountries();
  const allCountries = getAllCountries();
  const uniqueCountries = getUniqueCountries();
  const metrics = getMetrics();
  const multiChartData = filters.comparisonMode ? getMultiCommodityChartData() : [];
  const comparisonMetrics = filters.comparisonMode ? getComparisonMetrics() : [];
  const volatilityData = filters.comparisonMode ? getVolatilityData() : [];
  const growthData = filters.comparisonMode ? getGrowthData() : [];
  const isComparisonActive = filters.comparisonMode && filters.selectedCommodities && filters.selectedCommodities.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-[#002E40] text-white py-8 px-4 md:px-8 shadow-lg">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-[#AD9C70]">
                BGS World Mineral Statistics
              </h1>
              <p className="text-gray-200">
                Mineral production, import, and export data from 1970-2023
              </p>
            </div>
            <Tabs
              value={filters.comparisonMode ? "comparison" : "single"}
              onValueChange={(value: string) => {
                const newMode = value === "comparison";
                setFilters({
                  ...filters,
                  comparisonMode: newMode,
                  selectedCommodities: newMode ? filters.selectedCommodities : undefined,
                });
              }}
            >
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger
                  value="single"
                  className="text-white/90 data-[state=active]:bg-white data-[state=active]:text-[#002E40]"
                >
                  Single Commodity
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="text-white/90 data-[state=active]:bg-white data-[state=active]:text-[#002E40]"
                >
                  Comparison
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* Filters Section - Full Width at Top */}
        <section className="mb-8">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </section>

        {/* Key Insights - Horizontal Cards */}
        {!loading && !error && !isComparisonActive && data.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Key Insights</h2>
              <div className="flex gap-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="hover:bg-[#002E40] hover:text-white hover:border-[#002E40] transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  onClick={exportToJSON}
                  variant="outline"
                  size="sm"
                  className="hover:bg-[#002E40] hover:text-white hover:border-[#002E40] transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <MetricsCard key={index} metric={metric} />
              ))}
            </div>
          </section>
        )}

        {/* Visualizations Section - Full Width */}
        <section className="space-y-8">
            {loading && (
              <Card className="shadow-sm border-border">
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#002E40] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading data...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="shadow-sm border-destructive/50 bg-destructive/5">
                <CardContent className="py-8 text-center text-destructive">
                  <p className="font-medium">{error}</p>
                </CardContent>
              </Card>
            )}

          {!loading && !error && isComparisonActive && (
            <>
              {/* Comparison Metrics Cards */}
              <ComparisonMetricsCards metrics={comparisonMetrics} />

              {/* Main Comparison Chart */}
              <MultiCommodityChart
                data={multiChartData}
                commodities={filters.selectedCommodities || []}
                title="Production Comparison Across Commodities"
              />

              {/* Volatility and Growth Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <VolatilityComparisonChart
                  data={volatilityData}
                  title="Volatility Analysis"
                />
                <GrowthTrendComparison
                  data={growthData}
                  title="Growth Rate Comparison"
                />
              </div>

              {/* Comparison Summary */}
              <Card className="shadow-sm border-border">
                <CardContent className="py-8 px-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Comparison Summary</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Comparing {filters.selectedCommodities?.length} commodities from {filters.yearFrom} to {filters.yearTo}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {filters.selectedCommodities?.map((commodity) => (
                        <span
                          key={commodity}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#002E40] text-white"
                        >
                          {commodity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!loading && !error && !isComparisonActive && data.length > 0 && (
            <>
              {/* Row 1: Time Series and Country Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TimeSeriesChart
                  data={chartData}
                  title="Production, Imports & Exports Over Time"
                  countries={uniqueCountries}
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                />

                <ComparisonBarChart
                  data={allCountries}
                  title="Top 5 Countries by Total Activity"
                />
              </div>

              {/* Row 2: Market Share Pie Chart and Year-over-Year Growth */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MarketSharePieChart
                  data={allCountries}
                  title="Market Share Distribution"
                />

                <YearOverYearGrowthChart
                  data={yoyChartData}
                  title="Year-over-Year Growth Rate (%)"
                  countries={uniqueCountries}
                  selectedCountry={selectedYoYCountry}
                  onCountryChange={setSelectedYoYCountry}
                />
              </div>

              {/* Row 3: Regional Distribution and Concentration Index */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RegionalDistributionChart
                  data={allCountries}
                  title="Regional Distribution"
                />

                <ConcentrationIndexCard
                  data={allCountries}
                  title="Market Concentration Analysis"
                />
              </div>

              {/* Data Table */}
              <MineralDataTable data={data} onExport={exportToCSV} />
            </>
          )}

          {!loading && !error && !isComparisonActive && data.length === 0 && (
            <Card className="shadow-sm border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No data available for the selected filters.</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && isComparisonActive && (!filters.selectedCommodities || filters.selectedCommodities.length === 0) && (
            <Card className="shadow-sm border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Please select at least one commodity to compare.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#002E40] text-white py-6 px-4 md:px-8 mt-8">
        <div className="max-w-[1600px] mx-auto text-center">
          <p className="text-sm md:text-base mb-2">
            Created by <b>BGS Analysis & Design team</b> with <b><a href="https://www.claude.com/product/claude-code" target="_blank">Claude Code</a></b>
          </p>
          <p className="text-xs md:text-sm text-gray-300">
            Data from{' '}
            <a 
              href="https://www.bgs.ac.uk/technologies/web-services/web-feature-services-wfs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#AD9C70] hover:underline hover:text-white transition-colors"
            >
              World Mineral Statistics (WFS)
            </a>
            {' '} | Contact: <a 
              href="mailto:ux@bgs.ac.uk"
              className="text-[#AD9C70] hover:underline hover:text-white transition-colors"
            >
              ux@bgs.ac.uk
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
