import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Trophy, Calendar, Globe, Activity, LineChart } from 'lucide-react';
import type { MetricCard } from '@/types/minerals';

interface MetricsCardProps {
  metric: MetricCard;
}

export function MetricsCard({ metric }: MetricsCardProps) {
  const getTrendIcon = () => {
    if (!metric.trend) return null;

    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!metric.trend) return '';
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
    }
  };

  const getIcon = () => {
    if (!metric.icon) return null;

    const iconClass = "w-5 h-5 text-[#AD9C70]";
    switch (metric.icon) {
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'globe':
        return <Globe className={iconClass} />;
      case 'activity':
        return <Activity className={iconClass} />;
      case 'chart':
        return <LineChart className={iconClass} />;
    }
  };

  return (
    <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {metric.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex-1">
            <div className="text-2xl font-bold text-[#002E40]">{metric.value}</div>
            {metric.subtitle && (
              <div className="text-xs text-muted-foreground mt-1">{metric.subtitle}</div>
            )}
          </div>
          {metric.change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(metric.change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
