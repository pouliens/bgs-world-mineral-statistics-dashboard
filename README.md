# BGS World Mineral Statistics Dashboard

A professional, interactive dashboard for visualizing and analyzing BGS (British Geological Survey) World Mineral Statistics data. This dashboard provides comprehensive insights into mineral production, imports, and exports from 1970-2023.

Published on GitHub Pages: https://pouliens.github.io/bgs-world-mineral-statistics-dashboard/

## Features

- **Interactive Visualizations**: Time-series line charts and comparative bar charts using Recharts
- **Advanced Filtering**: Filter by commodity, year range, and data type (production/imports/exports)
- **Data Tables**: Sortable and paginated tables with TanStack React Table
- **Key Metrics**: Real-time calculation of trends, totals, averages, and peak values
- **Export Functionality**: Export data as CSV or JSON
- **Responsive Design**: Mobile-first design with collapsible 3-column layout
- **Professional Styling**: Clean, accessible design using shadcn/ui components with BGS branding

## Tech Stack

- **Framework**: [Astro](https://astro.build/) with React
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Charts**: Recharts
- **Data Management**: TanStack React Table
- **API Proxy**: Astro API routes (avoids CORS issues)
- **Package Manager**: Bun
- **Deployment**: GitLab Pages

## Data Source

This dashboard uses the BGS World Mineral Statistics WFS service:
- Base URL: `http://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows`
- Format: JSON and CSV
- Coverage: 1970-2023
- Data types: Production, Imports, Exports

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bgs-world-mineral-statistics-dashboard
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Dashboard.tsx     # Main dashboard component
│   │   ├── FilterPanel.tsx   # Filter controls
│   │   ├── TimeSeriesChart.tsx
│   │   ├── ComparisonBarChart.tsx
│   │   ├── MineralDataTable.tsx
│   │   ├── MetricsCard.tsx
│   │   └── InsightsPanel.tsx
│   ├── pages/
│   │   ├── api/
│   │   │   └── minerals.ts   # API proxy endpoint
│   │   └── index.astro       # Main page
│   ├── types/
│   │   └── minerals.ts       # TypeScript types
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── styles/
│       └── global.css        # Global styles with theme
├── .gitlab-ci.yml            # GitLab Pages deployment
├── astro.config.mjs          # Astro configuration
├── components.json           # shadcn/ui configuration
└── package.json
```

## Deployment

### GitLab Pages

This project is configured for automatic deployment to GitLab Pages:

1. Push your code to a GitLab repository
2. The `.gitlab-ci.yml` file will automatically build and deploy on push to `main`
3. If your project is not at the root, update `astro.config.mjs`:
   ```js
   export default defineConfig({
     site: 'https://your-username.gitlab.io',
     base: '/your-project-name',
     // ...
   });
   ```

### GitHub Pages

This project is also configured for GitHub Pages deployment:

1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Under "Build and deployment", select "GitHub Actions"
4. The `.github/workflows/deploy.yml` file will automatically build and deploy on push to `main`
5. If your project is not at the root, update `astro.config.mjs`:
   ```js
   export default defineConfig({
     site: 'https://your-username.github.io',
     base: '/your-repo-name',
     // ...
   });
   ```

## Usage

1. **Select a Commodity**: Choose from the dropdown (e.g., Copper, Gold, Lithium)
2. **Adjust Year Range**: Use the slider to select your time period of interest
3. **Choose Data Type**: Toggle between Production, Imports, or Exports
4. **View Insights**: Check the metrics cards for key statistics and trends
5. **Export Data**: Use the export buttons to download data as CSV or JSON

## Customization

### Adding More Commodities

Edit `src/types/minerals.ts` and add to the `COMMODITIES` array:

```typescript
export const COMMODITIES = [
  { value: 'your-commodity', label: 'Your Commodity' },
  // ...
];
```

### Changing Colors

The primary brand color is set to BGS Blue (`#003C6E`). To change:
- Update the header background in `Dashboard.tsx`
- Update chart colors in `TimeSeriesChart.tsx` and `ComparisonBarChart.tsx`
- Modify theme colors in `src/styles/global.css`

## Accessibility

This dashboard follows WCAG 2.1 AA guidelines:
- Semantic HTML
- Keyboard navigation support
- ARIA labels where appropriate
- Sufficient color contrast ratios
- Responsive font sizing

## License

This project is open source and available under the MIT License.

## Credits

- Data provided by the British Geological Survey (BGS)
- Built with Astro, React, and shadcn/ui
- Charts powered by Recharts
