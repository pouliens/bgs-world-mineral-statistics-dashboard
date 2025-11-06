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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
      </div>

      {/* Metrics Cards */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} metric={metric} />
        ))}
      </div>

      {/* Export Options */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Export Data</h3>
        <div className="space-y-2">
          <Button
            onClick={onExportCSV}
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
          </Button>
          <Button
            onClick={onExportJSON}
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </Button>
        </div>
      </Card>
    </div>
  );
}
