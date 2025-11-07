# API Field Names Fix

## Problem
The dashboard was showing all zeros because our TypeScript types didn't match the actual BGS WFS API response field names.

## Root Cause

**Expected (our code):**
- `COUNTRY`
- `PRODUCTION`
- `IMPORTS`
- `EXPORTS`
- `UNIT`

**Actual (BGS API):**
- `COUNTRY_NAME`
- `PROD_AMOUNT` / `PROD_UNIT`
- `IMP_AMOUNT` / `IMP_UNIT`
- `EXP_AMOUNT` / `EXP_UNIT`
- `ERML_COMMODITY`

## Sample API Response

```json
{
  "type": "Feature",
  "properties": {
    "COUNTRY_NAME": "France",
    "YEAR": 2016,
    "ERML_COMMODITY": "Antimony",
    "ERML_SUBCOMMODITY": "Metal",
    "IMP_AMOUNT": 9194.0,
    "IMP_UNIT": "t",
    "EXP_AMOUNT": 77.0,
    "EXP_UNIT": "t"
  }
}
```

## Files Fixed

### 1. ✅ `src/types/minerals.ts`
Updated `MineralProperties` interface to match actual API:
- Added `COUNTRY_NAME`, `ERML_COMMODITY`, `ERML_SUBCOMMODITY`
- Added `PROD_AMOUNT`, `IMP_AMOUNT`, `EXP_AMOUNT`
- Added `PROD_UNIT`, `IMP_UNIT`, `EXP_UNIT`
- Kept legacy fields for backwards compatibility

### 2. ✅ `src/components/Dashboard.tsx`
Created `getDataField()` helper to map filter types to API fields:
- `production` → `PROD_AMOUNT`
- `imports` → `IMP_AMOUNT`
- `exports` → `EXP_AMOUNT`

Updated functions:
- `getChartData()` - uses correct field names
- `getTopCountries()` - uses `COUNTRY_NAME`
- `getMetrics()` - uses correct field names
- `exportToCSV()` - exports with units included

### 3. ✅ `src/components/MineralDataTable.tsx`
Updated all column definitions:
- `COUNTRY_NAME` instead of `COUNTRY`
- `PROD_AMOUNT` + `PROD_UNIT` instead of `PRODUCTION`
- `IMP_AMOUNT` + `IMP_UNIT` instead of `IMPORTS`
- `EXP_AMOUNT` + `EXP_UNIT` instead of `EXPORTS`
- Removed standalone `UNIT` column
- Shows units inline with values (e.g., "9194 t")

## API Query Used

The correct WFS query format:
```
http://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows?
  service=WFS&
  version=2.0.0&
  request=GetFeature&
  STOREDQUERY_ID=CommodityURIByYearRangeStoredQuery&
  CGI_URL=http://resource.geosciml.org/classifier/cgi/commodity-code/copper&
  YEAR-FROM=2010&
  YEAR-TO=2023&
  outputFormat=JSON
```

## Testing

After these changes, you should see:
- ✅ Charts populate with real data
- ✅ Tables show values with units (e.g., "1234 t")
- ✅ Metrics cards show correct totals
- ✅ Export functions include units
- ✅ No more zeros!

## Verified Queries

The following stored queries are available:
1. `CommodityURIByYearRangeStoredQuery` (✅ what we use)
   - Uses `CGI_URL` parameter
   - Returns production, imports, exports for all countries

2. `CommodityProductsByYearRangeStoredQuery`
   - Uses `ERML_COMMODITY` parameter
   - Returns only production data

3. `CommodityImportsByYearRangeStoredQuery`
   - Uses `ERML_COMMODITY` parameter
   - Returns only import data

4. `CommodityExportsByYearRangeStoredQuery`
   - Uses `ERML_COMMODITY` parameter
   - Returns only export data

We use #1 because it returns all three data types in one query.
