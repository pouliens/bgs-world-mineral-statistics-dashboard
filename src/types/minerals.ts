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
  comparisonMode?: boolean;
  selectedCommodities?: string[];
}

export interface ChartDataPoint {
  year: number;
  value: number;
  country?: string;
}

export interface MetricCard {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: 'trophy' | 'calendar' | 'globe' | 'activity' | 'chart';
}

// UK Critical Minerals List (2021)
// Source: UK Government - Critical Minerals Strategy
export const UK_CRITICAL_MINERALS = new Set([
  'antimony',
  'bismuth',
  'cobalt',
  'gallium',
  'graphite',
  'indium',
  'lithium',
  'magnesium',
  'niobium',
  'platinum',
  'rare-earth-element',
  'tantalum',
  'tellurium',
  'tin',
  'tungsten',
  'vanadium',
]);

// Common commodities for the commodity selector
// Note: Values must match the CGI commodity code identifiers
export const COMMODITIES = [
  { value: 'aluminium', label: 'Aluminium', isCritical: false },
  { value: 'antimony', label: 'Antimony', isCritical: true },
  { value: 'arsenic', label: 'Arsenic', isCritical: false },
  { value: 'barite', label: 'Barite', isCritical: false },
  { value: 'bauxite', label: 'Bauxite', isCritical: false },
  { value: 'bentonite', label: 'Bentonite', isCritical: false },
  { value: 'bismuth', label: 'Bismuth', isCritical: true },
  { value: 'cadmium', label: 'Cadmium', isCritical: false },
  { value: 'chromium', label: 'Chromium', isCritical: false },
  { value: 'cobalt', label: 'Cobalt', isCritical: true },
  { value: 'copper', label: 'Copper', isCritical: false },
  { value: 'diamond', label: 'Diamond', isCritical: false },
  { value: 'feldspar', label: 'Feldspar', isCritical: false },
  { value: 'fluorite', label: 'Fluorite', isCritical: false },
  { value: 'gallium', label: 'Gallium', isCritical: true },
  { value: 'germanium', label: 'Germanium', isCritical: false },
  { value: 'gold', label: 'Gold', isCritical: false },
  { value: 'graphite', label: 'Graphite', isCritical: true },
  { value: 'gypsum', label: 'Gypsum', isCritical: false },
  { value: 'indium', label: 'Indium', isCritical: true },
  { value: 'iron-ore', label: 'Iron Ore', isCritical: false },
  { value: 'kaolin', label: 'Kaolin', isCritical: false },
  { value: 'lead', label: 'Lead', isCritical: false },
  { value: 'lithium', label: 'Lithium', isCritical: true },
  { value: 'magnesium', label: 'Magnesium', isCritical: true },
  { value: 'manganese', label: 'Manganese', isCritical: false },
  { value: 'mercury', label: 'Mercury', isCritical: false },
  { value: 'molybdenum', label: 'Molybdenum', isCritical: false },
  { value: 'nickel', label: 'Nickel', isCritical: false },
  { value: 'niobium', label: 'Niobium', isCritical: true },
  { value: 'phosphate', label: 'Phosphate', isCritical: false },
  { value: 'platinum', label: 'Platinum', isCritical: true },
  { value: 'potash', label: 'Potash', isCritical: false },
  { value: 'rare-earth-element', label: 'Rare Earth Elements', isCritical: true },
  { value: 'rhenium', label: 'Rhenium', isCritical: false },
  { value: 'salt', label: 'Salt', isCritical: false },
  { value: 'selenium', label: 'Selenium', isCritical: false },
  { value: 'silver', label: 'Silver', isCritical: false },
  { value: 'strontium', label: 'Strontium', isCritical: false },
  { value: 'sulfur', label: 'Sulfur', isCritical: false },
  { value: 'talc', label: 'Talc', isCritical: false },
  { value: 'tantalum', label: 'Tantalum', isCritical: true },
  { value: 'tellurium', label: 'Tellurium', isCritical: true },
  { value: 'tin', label: 'Tin', isCritical: true },
  { value: 'titanium', label: 'Titanium', isCritical: false },
  { value: 'tungsten', label: 'Tungsten', isCritical: true },
  { value: 'uranium', label: 'Uranium', isCritical: false },
  { value: 'vanadium', label: 'Vanadium', isCritical: true },
  { value: 'zinc', label: 'Zinc', isCritical: false },
  { value: 'zirconium', label: 'Zirconium', isCritical: false },
] as const;

export type CommodityType = typeof COMMODITIES[number]['value'];
