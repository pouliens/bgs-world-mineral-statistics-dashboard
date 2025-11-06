import type { APIRoute } from 'astro';
import axios from 'axios';

const BGS_WFS_BASE_URL = 'http://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const commodity = url.searchParams.get('commodity');
    const yearFrom = url.searchParams.get('yearFrom') || '1970';
    const yearTo = url.searchParams.get('yearTo') || '2023';
    const outputFormat = url.searchParams.get('outputFormat') || 'JSON';

    if (!commodity) {
      return new Response(
        JSON.stringify({ error: 'Commodity parameter is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Build WFS request
    const wfsParams = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      STOREDQUERY_ID: 'CommodityURIByYearRangeStoredQuery',
      CGI_URL: `http://resource.geosciml.org/classifier/cgi/commodity-code/${commodity}`,
      'YEAR-FROM': yearFrom,
      'YEAR-TO': yearTo,
      outputFormat: outputFormat,
    });

    const wfsUrl = `${BGS_WFS_BASE_URL}?${wfsParams.toString()}`;

    // Fetch data from BGS WFS service
    const response = await axios.get(wfsUrl, {
      timeout: 30000,
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching mineral data:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch mineral data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
};
