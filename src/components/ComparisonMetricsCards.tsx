import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface CommodityMetrics {
  commodity: string;
  totalVolume: number;
  avgAnnual: number;
  peakYear: number;
  peakValue: number;
  growthRate: number;
  volatility: number;
}

interface ComparisonMetricsCardsProps {
  metrics: CommodityMetrics[];
}

export function ComparisonMetricsCards({ metrics }: ComparisonMetricsCardsProps) {
  if (metrics.length === 0) return null;

  // Find highest volume commodity
  const highestVolume = metrics.reduce((max, m) =>
    m.totalVolume > max.totalVolume ? m : max
  );

  // Find fastest growing commodity
  const fastestGrowing = metrics.reduce((max, m) =>
    m.growthRate > max.growthRate ? m : max
  );

  // Find most volatile commodity
  const mostVolatile = metrics.reduce((max, m) =>
    m.volatility > max.volatility ? m : max
  );

  // Find most stable commodity (lowest volatility)
  const mostStable = metrics.reduce((min, m) =>
    m.volatility < min.volatility ? m : min
  );

  const formatCommodityName = (name: string) => {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Highest Volume */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            HIGHEST VOLUME
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#002E40]">
              {formatCommodityName(highestVolume.commodity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {highestVolume.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} total volume
            </p>
            <p className="text-xs text-muted-foreground">
              Avg: {highestVolume.avgAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}/year
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fastest Growing */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            FASTEST GROWING
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#002E40]">
              {formatCommodityName(fastestGrowing.commodity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {fastestGrowing.growthRate > 0 ? '+' : ''}{fastestGrowing.growthRate.toFixed(1)}% growth rate
            </p>
            <p className="text-xs text-muted-foreground">
              Peak: {fastestGrowing.peakYear}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Most Volatile */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            MOST VOLATILE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#AD9C70]">
              {formatCommodityName(mostVolatile.commodity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {mostVolatile.volatility.toFixed(1)}% variability
            </p>
            <p className="text-xs text-muted-foreground">
              Higher fluctuation in production
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Most Stable */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 rotate-0" />
            MOST STABLE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#005571]">
              {formatCommodityName(mostStable.commodity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {mostStable.volatility.toFixed(1)}% variability
            </p>
            <p className="text-xs text-muted-foreground">
              Consistent production levels
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
