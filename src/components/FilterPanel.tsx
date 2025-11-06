import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMMODITIES } from '@/types/minerals';
import type { FilterOptions } from '@/types/minerals';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
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

  const handleDataTypeChange = (value: 'production' | 'imports' | 'exports') => {
    onFiltersChange({ ...filters, dataType: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
      </div>

      {/* Commodity Selector */}
      <div className="space-y-2">
        <Label htmlFor="commodity">Commodity</Label>
        <Select value={filters.commodity} onValueChange={handleCommodityChange}>
          <SelectTrigger id="commodity">
            <SelectValue placeholder="Select a commodity" />
          </SelectTrigger>
          <SelectContent>
            {COMMODITIES.map((commodity) => (
              <SelectItem key={commodity.value} value={commodity.value}>
                {commodity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Range Slider */}
      <div className="space-y-4">
        <Label>Year Range</Label>
        <div className="space-y-2">
          <Slider
            value={[filters.yearFrom, filters.yearTo]}
            onValueChange={handleYearRangeChange}
            min={1970}
            max={2023}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.yearFrom}</span>
            <span>{filters.yearTo}</span>
          </div>
        </div>
      </div>

      {/* Data Type Toggle */}
      <div className="space-y-3">
        <Label>Data Type</Label>
        <RadioGroup
          value={filters.dataType}
          onValueChange={handleDataTypeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="production" id="production" />
            <Label htmlFor="production" className="font-normal cursor-pointer">
              Production
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imports" id="imports" />
            <Label htmlFor="imports" className="font-normal cursor-pointer">
              Imports
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exports" id="exports" />
            <Label htmlFor="exports" className="font-normal cursor-pointer">
              Exports
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
}
