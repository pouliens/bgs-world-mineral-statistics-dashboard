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
 * - Uses multiple CORS proxy services for reliability
 * - Tries allorigins.win, cors-anywhere, and thingproxy
 * - All proxies use HTTPS to avoid mixed content issues
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
  
  // Try multiple CORS proxy services for better reliability
  const corsProxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(bgsUrl)}`,
    `https://cors-anywhere.herokuapp.com/${bgsUrl}`,
    `https://thingproxy.freeboard.io/fetch/${bgsUrl}`
  ];

  for (const proxyUrl of corsProxies) {
    try {
      const response = await axios.get<MineralData>(proxyUrl, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.warn(`CORS proxy ${proxyUrl} failed:`, error);
      // Continue to next proxy
    }
  }

  // If all proxies fail, throw an error
  throw new Error('Failed to fetch mineral data from BGS. All CORS proxy services are unavailable. Please try again later.');
}
