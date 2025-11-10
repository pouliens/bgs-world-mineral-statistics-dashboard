import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMMODITIES } from '@/types/minerals';
import type { FilterOptions } from '@/types/minerals';
import { Star } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const comparisonMode = filters.comparisonMode || false;
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>(filters.selectedCommodities || []);

  const handleCommodityChange = (value: string) => {
    onFiltersChange({ ...filters, commodity: value });
  };

  const handleYearRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      yearFrom: value[0],
      yearTo: value[1],
    });
  };

  const handleCommodityToggle = (commodityValue: string) => {
    const newSelected = selectedCommodities.includes(commodityValue)
      ? selectedCommodities.filter(c => c !== commodityValue)
      : [...selectedCommodities, commodityValue];

    setSelectedCommodities(newSelected);
    if (comparisonMode) {
      onFiltersChange({
        ...filters,
        selectedCommodities: newSelected,
      });
    }
  };

  return (
    <Card className="p-5 shadow-sm border-border">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Commodity Selector */}
        {!comparisonMode ? (
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="commodity" className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">
              Mineral Commodity
            </Label>
            <Select value={filters.commodity} onValueChange={handleCommodityChange}>
              <SelectTrigger
                id="commodity"
                className="w-full bg-white dark:bg-white border-2 border-input hover:border-[#002E40] focus:border-[#002E40] focus:ring-2 focus:ring-[#002E40]/20 transition-all"
              >
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                {COMMODITIES.map((commodity) => (
                  <SelectItem key={commodity.value} value={commodity.value}>
                    <div className="flex items-center gap-2">
                      <span>{commodity.label}</span>
                      {commodity.isCritical && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-[#AD9C70] text-white border-0 pointer-events-none">
                          <Star className="w-2.5 h-2.5 mr-0.5" />
                          UK Critical
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">
              Select Commodities
            </Label>
            <div className="space-y-1 max-h-48 overflow-y-auto p-2 border border-border rounded-lg bg-white">
              {COMMODITIES.map((commodity) => (
                <div
                  key={commodity.value}
                  className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    id={`compare-${commodity.value}`}
                    checked={selectedCommodities.includes(commodity.value)}
                    onCheckedChange={() => handleCommodityToggle(commodity.value)}
                  />
                  <Label
                    htmlFor={`compare-${commodity.value}`}
                    className="text-sm font-normal cursor-pointer flex-1 flex items-center gap-2"
                  >
                    <span>{commodity.label}</span>
                    {commodity.isCritical && (
                      <Star className="w-3 h-3 text-[#AD9C70] fill-[#AD9C70]" />
                    )}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedCommodities.length} selected
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-border"></div>

        {/* Year Range Slider */}
        <div className="flex-1 min-w-[240px]">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2 block">
            Time Period
          </Label>
          <div className="px-1 py-1">
            <Slider
              value={[filters.yearFrom, filters.yearTo]}
              onValueChange={handleYearRangeChange}
              min={1970}
              max={2023}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="bg-[#002E40] text-white px-2.5 py-1 rounded-md shadow-sm font-semibold text-xs">
              {filters.yearFrom}
            </span>
            <span className="text-muted-foreground text-xs">to</span>
            <span className="bg-[#002E40] text-white px-2.5 py-1 rounded-md shadow-sm font-semibold text-xs">
              {filters.yearTo}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
