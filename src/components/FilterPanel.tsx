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
        <Label htmlFor="commodity" className="text-sm font-semibold text-foreground">
          Select Mineral Commodity
        </Label>
        <Select value={filters.commodity} onValueChange={handleCommodityChange}>
          <SelectTrigger
            id="commodity"
            className="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 hover:border-[#003C6E] focus:border-[#003C6E] transition-colors"
          >
            <SelectValue placeholder="Choose a commodity..." />
          </SelectTrigger>
          <SelectContent>
            {COMMODITIES.map((commodity) => (
              <SelectItem key={commodity.value} value={commodity.value}>
                {commodity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select a mineral to view its statistics
        </p>
      </div>

      {/* Year Range Slider */}
      <div className="space-y-3 py-2">
        <Label className="text-sm font-semibold text-foreground">
          Time Period
        </Label>
        <div className="px-1">
          <Slider
            value={[filters.yearFrom, filters.yearTo]}
            onValueChange={handleYearRangeChange}
            min={1970}
            max={2023}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-foreground px-1">
          <span className="bg-[#003C6E] text-white px-3 py-1.5 rounded-md shadow-sm">
            {filters.yearFrom}
          </span>
          <span className="text-muted-foreground font-normal">to</span>
          <span className="bg-[#003C6E] text-white px-3 py-1.5 rounded-md shadow-sm">
            {filters.yearTo}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Drag the handles to adjust the year range
        </p>
      </div>

      {/* Data Type Toggle */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">
          Statistics Type
        </Label>
        <RadioGroup
          value={filters.dataType}
          onValueChange={handleDataTypeChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RadioGroupItem value="production" id="production" />
            <Label htmlFor="production" className="font-normal cursor-pointer flex-1">
              Production
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RadioGroupItem value="imports" id="imports" />
            <Label htmlFor="imports" className="font-normal cursor-pointer flex-1">
              Imports
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RadioGroupItem value="exports" id="exports" />
            <Label htmlFor="exports" className="font-normal cursor-pointer flex-1">
              Exports
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          Choose the type of data to display
        </p>
      </div>
    </Card>
  );
}
