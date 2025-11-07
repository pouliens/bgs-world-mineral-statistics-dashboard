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
  subtitle?: string; // Optional subtitle for additional context
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: 'trophy' | 'calendar' | 'globe' | 'activity'; // Optional icon identifier
}

// Common commodities for the commodity selector
// Note: Values must match the CGI commodity code identifiers
export const COMMODITIES = [
  { value: 'aluminium', label: 'Aluminium' },
  { value: 'antimony', label: 'Antimony' },
  { value: 'arsenic', label: 'Arsenic' },
  { value: 'barite', label: 'Barite' },
  { value: 'bauxite', label: 'Bauxite' },
  { value: 'bentonite', label: 'Bentonite' },
  { value: 'bismuth', label: 'Bismuth' },
  { value: 'cadmium', label: 'Cadmium' },
  { value: 'chromium', label: 'Chromium' },
  { value: 'cobalt', label: 'Cobalt' },
  { value: 'copper', label: 'Copper' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'feldspar', label: 'Feldspar' },
  { value: 'fluorite', label: 'Fluorite' },
  { value: 'gallium', label: 'Gallium' },
  { value: 'germanium', label: 'Germanium' },
  { value: 'gold', label: 'Gold' },
  { value: 'graphite', label: 'Graphite' },
  { value: 'gypsum', label: 'Gypsum' },
  { value: 'indium', label: 'Indium' },
  { value: 'iron-ore', label: 'Iron Ore' },
  { value: 'kaolin', label: 'Kaolin' },
  { value: 'lead', label: 'Lead' },
  { value: 'lithium', label: 'Lithium' },
  { value: 'magnesium', label: 'Magnesium' },
  { value: 'manganese', label: 'Manganese' },
  { value: 'mercury', label: 'Mercury' },
  { value: 'molybdenum', label: 'Molybdenum' },
  { value: 'nickel', label: 'Nickel' },
  { value: 'niobium', label: 'Niobium' },
  { value: 'phosphate', label: 'Phosphate' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'potash', label: 'Potash' },
  { value: 'rare-earth-element', label: 'Rare Earth Elements' },
  { value: 'rhenium', label: 'Rhenium' },
  { value: 'salt', label: 'Salt' },
  { value: 'selenium', label: 'Selenium' },
  { value: 'silver', label: 'Silver' },
  { value: 'strontium', label: 'Strontium' },
  { value: 'sulfur', label: 'Sulfur' },
  { value: 'talc', label: 'Talc' },
  { value: 'tantalum', label: 'Tantalum' },
  { value: 'tellurium', label: 'Tellurium' },
  { value: 'tin', label: 'Tin' },
  { value: 'titanium', label: 'Titanium' },
  { value: 'tungsten', label: 'Tungsten' },
  { value: 'uranium', label: 'Uranium' },
  { value: 'vanadium', label: 'Vanadium' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'zirconium', label: 'Zirconium' },
] as const;

export type CommodityType = typeof COMMODITIES[number]['value'];
