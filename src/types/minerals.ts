export interface MineralData {
  type: string;
  features: Feature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
}

export interface Feature {
  type: string;
  id: string;
  geometry: null;
  properties: MineralProperties;
}

export interface MineralProperties {
  OBJECTID?: number;
  COUNTRY_NAME: string;
  ERML_COMMODITY: string;
  ERML_SUBCOMMODITY?: string;
  YEAR: number;
  PROD_AMOUNT?: number;
  PROD_UNIT?: string;
  IMP_AMOUNT?: number;
  IMP_UNIT?: string;
  EXP_AMOUNT?: number;
  EXP_UNIT?: string;
  PARENT_COMMODITY?: number;
  SOURCE?: string;
  // Legacy field names for backwards compatibility
  COUNTRY?: string;
  COMMODITY?: string;
  PRODUCTION?: number;
  IMPORTS?: number;
  EXPORTS?: number;
  UNIT?: string;
}

export interface FilterOptions {
  commodity: string;
  countries: string[];
  yearFrom: number;
  yearTo: number;
  dataType: 'production' | 'imports' | 'exports';
}

export interface ChartDataPoint {
  year: number;
  value: number;
  country?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

// Common commodities for the commodity selector
export const COMMODITIES = [
  { value: 'antimony', label: 'Antimony' },
  { value: 'bauxite', label: 'Bauxite' },
  { value: 'copper', label: 'Copper' },
  { value: 'gold', label: 'Gold' },
  { value: 'iron-ore', label: 'Iron Ore' },
  { value: 'lead', label: 'Lead' },
  { value: 'lithium', label: 'Lithium' },
  { value: 'nickel', label: 'Nickel' },
  { value: 'silver', label: 'Silver' },
  { value: 'tin', label: 'Tin' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'rare-earth-elements', label: 'Rare Earth Elements' },
] as const;

export type CommodityType = typeof COMMODITIES[number]['value'];
