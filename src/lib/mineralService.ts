import axios, { type AxiosError } from 'axios';
import type { MineralData } from '@/types/minerals';

interface FetchMineralDataParams {
  commodity: string;
  yearFrom: number;
  yearTo: number;
}

const REQUEST_TIMEOUT = 30000; // 30 seconds
const BGS_BASE_URL = 'https://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows';
const CORS_PROXY_URL = 'https://corsproxy.io/';

/**
 * Fetches mineral production, import, and export data from the British Geological Survey (BGS) WFS API
 *
 * @param params - Commodity name and year range
 * @returns Promise resolving to mineral data in GeoJSON format
 * @throws Error if the API request fails or times out
 *
 * Environment-specific behavior:
 * - Development: Uses Vite proxy (/bgs-api) to avoid CORS issues
 * - Production: Uses HTTPS endpoint with CORS proxy, falls back to direct connection
 */
export async function fetchMineralData({
  commodity,
  yearFrom,
  yearTo,
}: FetchMineralDataParams): Promise<MineralData> {
  // Input validation
  if (!commodity || commodity.trim() === '') {
    throw new Error('Commodity name is required');
  }
  if (yearFrom < 1970 || yearTo > new Date().getFullYear()) {
    throw new Error('Year range must be between 1970 and current year');
  }
  if (yearFrom > yearTo) {
    throw new Error('Start year must be before or equal to end year');
  }

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

  // Development: Use Vite proxy
  if (import.meta.env.DEV) {
    const url = `/bgs-api?${wfsParams.toString()}`;
    const response = await axios.get<MineralData>(url, {
      timeout: REQUEST_TIMEOUT,
    });
    return response.data;
  }

  // Production: Use HTTPS with CORS proxy
  const bgsUrl = `${BGS_BASE_URL}?${wfsParams.toString()}`;

  try {
    const proxyUrl = `${CORS_PROXY_URL}?${encodeURIComponent(bgsUrl)}`;
    const response = await axios.get<MineralData>(proxyUrl, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (proxyError) {
    // Fallback: Try direct HTTPS connection
    try {
      const response = await axios.get<MineralData>(bgsUrl, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (directError) {
      const axiosError = directError as AxiosError;
      const errorMessage =
        axiosError.response?.status === 404
          ? `Mineral commodity "${commodity}" not found in BGS database`
          : 'Failed to fetch mineral data from BGS. The service may be temporarily unavailable. Please try again later.';

      throw new Error(errorMessage);
    }
  }
}
