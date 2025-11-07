import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Shield, ShieldAlert, ShieldOff, ShieldCheck } from 'lucide-react';

interface CountryData {
  name: string;
  production: number;
  imports: number;
  exports: number;
}

interface ConcentrationIndexCardProps {
  data: CountryData[];
  title?: string;
}

export function ConcentrationIndexCard({
  data,
  title = 'Market Concentration Analysis',
}: ConcentrationIndexCardProps) {
  const [activeTab, setActiveTab] = React.useState<'production' | 'imports' | 'exports'>('production');

  // Calculate Herfindahl-Hirschman Index (HHI)
  // HHI = sum of squared market shares (in percentage points)
  // Range: 0-10,000 where higher = more concentrated
  const calculateHHI = (statType: 'production' | 'imports' | 'exports') => {
    const total = data.reduce((sum, country) => sum + (country[statType] || 0), 0);

    if (total === 0) return 0;

    const hhi = data.reduce((sum, country) => {
      const marketShare = ((country[statType] || 0) / total) * 100; // as percentage
      return sum + marketShare * marketShare;
    }, 0);

    return Math.round(hhi);
  };

  // Calculate top N concentration (e.g., top 3, top 5)
  const calculateTopNConcentration = (statType: 'production' | 'imports' | 'exports', n: number) => {
    const sortedData = [...data].sort((a, b) => (b[statType] || 0) - (a[statType] || 0));
    const total = data.reduce((sum, country) => sum + (country[statType] || 0), 0);

    if (total === 0) return 0;

    const topNTotal = sortedData.slice(0, n).reduce((sum, country) => sum + (country[statType] || 0), 0);
    return ((topNTotal / total) * 100).toFixed(1);
  };

  const hhi = calculateHHI(activeTab);
  const top3Concentration = calculateTopNConcentration(activeTab, 3);
  const top5Concentration = calculateTopNConcentration(activeTab, 5);

  // Interpret HHI
  // < 1,500: Competitive market
  // 1,500 - 2,500: Moderate concentration
  // > 2,500: High concentration
  const getConcentrationLevel = (hhi: number) => {
    if (hhi < 1500) return { level: 'Low', color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-50' };
    if (hhi < 2500) return { level: 'Moderate', color: 'text-yellow-600', icon: AlertTriangle, bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50' };
  };

  // Calculate Supply Risk Level
  // Critical Risk (red): HHI > 2500 AND top 3 > 80%
  // High Risk (orange): HHI > 2500 OR top 3 > 70%
  // Moderate Risk (yellow): HHI 1500-2500
  // Low Risk (green): HHI < 1500
  const getSupplyRiskLevel = () => {
    const top3Pct = typeof top3Concentration === 'string' ? parseFloat(top3Concentration) : 0;

    if (hhi > 2500 && top3Pct > 80) {
      return {
        level: 'Critical Risk',
        color: 'bg-red-600 text-white',
        icon: ShieldOff,
        description: 'Highly concentrated market with extreme supply chain vulnerability'
      };
    } else if (hhi > 2500 || top3Pct > 70) {
      return {
        level: 'High Risk',
        color: 'bg-orange-500 text-white',
        icon: ShieldAlert,
        description: 'Concentrated market with significant supply chain risk'
      };
    } else if (hhi >= 1500 && hhi <= 2500) {
      return {
        level: 'Moderate Risk',
        color: 'bg-yellow-500 text-white',
        icon: Shield,
        description: 'Moderately concentrated market with some supply concerns'
      };
    } else {
      return {
        level: 'Low Risk',
        color: 'bg-green-600 text-white',
        icon: ShieldCheck,
        description: 'Competitive market with diversified supply sources'
      };
    }
  };

  const concentration = getConcentrationLevel(hhi);
  const supplyRisk = getSupplyRiskLevel();
  const Icon = concentration.icon;
  const RiskIcon = supplyRisk.icon;

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            <CardDescription>Supply chain risk and market concentration</CardDescription>
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
        {data.length > 0 ? (
          <div className="space-y-6">
            {/* Supply Risk and HHI Score */}
            <div className={`${concentration.bg} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <RiskIcon className={`h-8 w-8 ${supplyRisk.level === 'Critical Risk' ? 'text-red-600' : supplyRisk.level === 'High Risk' ? 'text-orange-500' : supplyRisk.level === 'Moderate Risk' ? 'text-yellow-500' : 'text-green-600'}`} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Supply Risk Level</p>
                    <p className={`text-2xl font-bold ${supplyRisk.level === 'Critical Risk' ? 'text-red-600' : supplyRisk.level === 'High Risk' ? 'text-orange-500' : supplyRisk.level === 'Moderate Risk' ? 'text-yellow-500' : 'text-green-600'}`}>
                      {supplyRisk.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">HHI Score</p>
                  <p className="text-3xl font-bold text-[#002E40]">{hhi.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">out of 10,000</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic mb-3">{supplyRisk.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    hhi < 1500 ? 'bg-green-500' : hhi < 2500 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((hhi / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Top N Concentration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">Top 3 Countries</p>
                <p className="text-3xl font-bold text-[#002E40]">{top3Concentration}%</p>
                <p className="text-xs text-gray-500 mt-1">of total market</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-1">Top 5 Countries</p>
                <p className="text-3xl font-bold text-[#002E40]">{top5Concentration}%</p>
                <p className="text-xs text-gray-500 mt-1">of total market</p>
              </div>
            </div>

            {/* Interpretation Guide */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">HHI Interpretation:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium text-green-600">&lt; 1,500:</span> Competitive market - many suppliers</p>
                <p><span className="font-medium text-yellow-600">1,500-2,500:</span> Moderate concentration - supply risk exists</p>
                <p><span className="font-medium text-red-600">&gt; 2,500:</span> High concentration - significant supply risk</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
