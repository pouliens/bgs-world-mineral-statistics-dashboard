import axios from 'axios';
import type { MineralData } from '@/types/minerals';

interface FetchMineralDataParams {
  commodity: string;
  yearFrom: number;
  yearTo: number;
}

/**
 * Fetches mineral data from BGS WFS service
 *
 * In development (bun run dev):
 * - Uses Vite proxy (/bgs-api) to avoid CORS
 *
 * In production (static build):
 * - Uses CORS proxy (corsproxy.io) to access BGS
 * - Fallback to direct fetch if CORS is allowed
 */
export async function fetchMineralData({
  commodity,
  yearFrom,
  yearTo,
}: FetchMineralDataParams): Promise<MineralData> {
  const wfsParams = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    STOREDQUERY_ID: 'CommodityURIByYearRangeStoredQuery',
    CGI_URL: `http://resource.geosciml.org/classifier/cgi/commodity-code/${commodity}`,
    'YEAR-FROM': yearFrom.toString(),
    'YEAR-TO': yearTo.toString(),
    outputFormat: 'JSON',
  });

  // In development, use Vite proxy
  if (import.meta.env.DEV) {
    const url = `/bgs-api?${wfsParams.toString()}`;
    const response = await axios.get<MineralData>(url);
    return response.data;
  }

  // In production, use CORS proxy
  const bgsUrl = `http://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows?${wfsParams.toString()}`;
  const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(bgsUrl)}`;

  try {
    const response = await axios.get<MineralData>(corsProxyUrl, {
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    // Fallback to direct fetch (may fail due to CORS)
    try {
      const response = await axios.get<MineralData>(bgsUrl);
      return response.data;
    } catch (directError) {
      throw new Error('Failed to fetch mineral data from BGS. Please try again later.');
    }
  }
}
