import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricsCard } from './MetricsCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { MetricCard } from '@/types/minerals';

interface InsightsPanelProps {
  metrics: MetricCard[];
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function InsightsPanel({
  metrics,
  onExportCSV,
  onExportJSON,
}: InsightsPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="p-4 border-b-4 border-b-[#AD9C70] shadow-sm">
        <h2 className="text-xl font-bold text-foreground">Key Insights</h2>
      </Card>

      {/* Metrics Cards */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} metric={metric} />
        ))}
      </div>

      {/* Export Options */}
      <Card className="p-5 shadow-sm border-border">
        <h3 className="text-sm font-semibold mb-4 text-foreground">Export Data</h3>
        <div className="space-y-3">
          <Button
            onClick={onExportCSV}
            variant="outline"
            className="w-full justify-start hover:bg-[#002E40] hover:text-white hover:border-[#002E40] transition-colors"
            size="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
          <Button
            onClick={onExportJSON}
            variant="outline"
            className="w-full justify-start hover:bg-[#002E40] hover:text-white hover:border-[#002E40] transition-colors"
            size="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </Button>
        </div>
      </Card>
    </div>
  );
}
