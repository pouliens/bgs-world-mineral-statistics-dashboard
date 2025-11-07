# BGS World Mineral Statistics Dashboard

A professional, interactive dashboard for exploring mineral production, import, and export statistics from the British Geological Survey (BGS) World Mineral Statistics database.

## Overview

This dashboard provides access to comprehensive mineral commodity data spanning from 1970 to 2023, featuring:
- **39 mineral commodities** including metals and industrial minerals
- **Interactive visualizations** with time-series analysis and country comparisons
- **Multi-commodity comparison mode** for analyzing trends across multiple minerals
- **Data export capabilities** in CSV and JSON formats
- **Responsive design** optimized for desktop and mobile viewing

## Technology Stack

- **Framework**: [Astro](https://astro.build/) v5.15.4 - Static site generator
- **UI Library**: [React](https://react.dev/) v19.2.0 - Interactive components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4.1.16 - Utility-first CSS
- **Charts**: [Recharts](https://recharts.org/) v3.3.0 - Declarative charting library
- **Tables**: [TanStack React Table](https://tanstack.com/table) v8.21.3 - Headless table library
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **HTTP Client**: [Axios](https://axios-http.com/) v1.13.2 - Promise-based HTTP client

## Features

### 1. Single Commodity Analysis
- **Time-series chart**: Visualize production/import/export trends over time
- **Country comparison**: Bar chart showing top 5 producing/importing/exporting countries
- **Key metrics**: Total, average, peak, and lowest values with trend indicators
- **Data table**: Sortable, paginated table with detailed country-level data

### 2. Multi-Commodity Comparison
- **Toggle comparison mode**: Switch between single and multi-commodity views
- **Multi-select interface**: Choose multiple commodities to compare side-by-side
- **Comparative visualization**: Color-coded line chart showing all selected commodities
- **Summary cards**: Visual indicators of selected commodities

### 3. Interactive Filters
- **Commodity selector**: Dropdown with 39 available minerals
- **Time period slider**: Adjust year range from 1970 to 2023
- **Statistics type**: Toggle between Production, Imports, and Exports
- **Comparison mode**: Enable multi-commodity analysis

### 4. Data Export
- **CSV export**: Download filtered data in CSV format
- **JSON export**: Export data as JSON for further processing

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx                 # Main dashboard orchestrator
│   ├── FilterPanel.tsx               # Horizontal filter controls
│   ├── TimeSeriesChart.tsx           # Line chart for trends
│   ├── ComparisonBarChart.tsx        # Bar chart for country comparison
│   ├── MultiCommodityChart.tsx       # Multi-commodity line chart
│   ├── MineralDataTable.tsx          # Data table with sorting/pagination
│   ├── MetricsCard.tsx               # Individual metric display card
│   └── ui/                           # Radix UI components
│       ├── card.tsx                  # Card layout
│       ├── button.tsx                # Button component
│       ├── slider.tsx                # Range slider
│       ├── select.tsx                # Dropdown select
│       ├── checkbox.tsx              # Checkbox input
│       ├── radio-group.tsx           # Radio button group
│       ├── label.tsx                 # Form label
│       └── table.tsx                 # Table structure
├── lib/
│   ├── mineralService.ts             # BGS API data fetching
│   └── utils.ts                      # Utility functions
├── types/
│   └── minerals.ts                   # TypeScript types & commodity list
├── pages/
│   ├── api/
│   │   └── minerals.ts               # API endpoint for data fetching
│   └── index.astro                   # Main page
├── layouts/
│   └── main.astro                    # Base layout
└── styles/
    └── global.css                    # Tailwind config + brand theme
```

## Design System

### Brand Colors
- **Primary (Deep Teal)**: `#002E40` - Headers, primary actions, key UI elements
- **Accent (Gold)**: `#AD9C70` - Secondary elements, comparison charts, highlights

### Color Usage
- **Headers & Navigation**: Deep Teal (`#002E40`)
- **Line Charts**: Deep Teal (`#002E40`)
- **Bar Charts**: Gold (`#AD9C70`)
- **Interactive Elements**: Teal with hover states
- **Metric Cards**: Teal for values, semantic colors for trends

### Typography
- **Headers**: Bold, tight tracking
- **Body**: Regular weight, relaxed line-height
- **Labels**: Semibold, uppercase for metrics
- **Data**: Monospace for numbers (inherited from system)

### Layout
- **Max Width**: 1600px for optimal readability on large screens
- **Grid System**: CSS Grid for responsive layouts
- **Spacing**: 8px base unit (Tailwind's default)
- **Cards**: Subtle shadows with rounded corners

## Data Source

The dashboard fetches data from the **BGS World Mineral Statistics API**:
- **Service**: WFS (Web Feature Service) v2.0.0
- **Base URL**: `http://ogc2.bgs.ac.uk/cgi-bin/UKWM/ows`
- **Format**: GeoJSON
- **Coverage**: Global data from 1970-2023
- **Update Frequency**: Varies by commodity

### Available Commodities (39)

**Metals**:
Aluminium, Antimony, Bismuth, Cadmium, Chromium, Cobalt, Copper, Gold, Lead, Lithium, Magnesium, Manganese, Mercury, Molybdenum, Nickel, Platinum, Silver, Tin, Titanium, Tungsten, Uranium, Vanadium, Zinc, Zirconium

**Industrial Minerals**:
Barite, Bauxite, Bentonite, Diamond, Feldspar, Fluorite, Graphite, Gypsum, Kaolin, Phosphate, Potash, Salt, Sulfur, Talc

**Ores**:
Iron Ore

### API Implementation

**Development Mode**:
- Uses Vite proxy (`/bgs-api`) to avoid CORS issues
- Direct connection to BGS servers

**Production Mode**:
- Uses CORS proxy (`https://corsproxy.io/`)
- Fallback to direct fetch if CORS is configured
- 30-second timeout for API calls
- Error handling with user-friendly messages

## Development

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bgs-world-mineral-statistics-dashboard

# Install dependencies
bun install
# or
npm install
```

### Development Server

```bash
# Start dev server with hot reload
bun run dev
# or
npm run dev

# Server runs at http://localhost:4321
```

### Build for Production

```bash
# Build static site
bun run build
# or
npm run build

# Preview production build
bun run preview
# or
npm run preview
```

### Environment Variables

The dashboard works out of the box without additional configuration. API requests are proxied through Vite in development and use a CORS proxy in production.

## Deployment

The dashboard generates a static site that can be deployed to any static hosting service.

### GitHub Pages Deployment

The project includes automated GitHub Pages deployment:

1. **Setup**:
   - Push your code to a GitHub repository
   - Go to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions"

2. **Configuration**:
   - The `.github/workflows/deploy.yml` file handles automatic builds
   - Triggers on push to `main` branch
   - Uses Bun for fast dependency installation and builds
   - Deploys to GitHub Pages automatically

3. **Custom Domain** (optional):
   - Update `astro.config.mjs`:
     ```js
     export default defineConfig({
       site: 'https://your-username.github.io',
       base: '/your-repo-name', // if not at root
     });
     ```

### GitLab Pages Deployment

The project includes a `.gitlab-ci.yml` configuration:

1. **Setup**:
   - Push your code to a GitLab repository
   - CI/CD pipeline runs automatically on push to `main`

2. **Configuration**:
   - Uses Bun runtime for builds
   - Outputs to `public` directory (GitLab Pages requirement)
   - Caches `node_modules` for faster builds
   - Accessible at `https://<username>.gitlab.io/<project>`

3. **Custom Domain** (optional):
   - Update `astro.config.mjs`:
     ```js
     export default defineConfig({
       site: 'https://your-username.gitlab.io',
       base: '/your-project-name', // if not at root
     });
     ```

### Other Platforms
- **Netlify**: Drop the `dist` folder or connect Git repo
- **Vercel**: Import project and deploy automatically
- **AWS S3 + CloudFront**: Upload static files from `dist/`
- **Cloudflare Pages**: Connect repository for automatic builds

### Build Output
- Located in `dist/` directory
- Contains static HTML, CSS, JS, and assets
- No server-side rendering required
- Client-side JavaScript for interactivity

## Performance Considerations

### Optimization Techniques
- **Static Generation**: Pre-rendered HTML for fast initial load
- **Code Splitting**: React components loaded on demand
- **Lazy Loading**: Charts render only when data is available
- **Caching**: API responses cached for 1 hour
- **Parallel Requests**: Multi-commodity data fetched concurrently

### Bundle Size
- Initial bundle: ~200KB (gzipped)
- React + Recharts: ~150KB
- Radix UI components: ~50KB
- Total page weight: ~250-300KB

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Semantic HTML with ARIA labels
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Visible focus states on all controls
- **Responsive Text**: Scales appropriately on all devices

## Known Limitations

1. **Commodity Coverage**: Not all commodities have data for all years/countries
2. **Rare Earth Elements**: Not available as a single commodity (typically tracked individually)
3. **API Rate Limiting**: Rapid successive requests may be throttled
4. **CORS in Production**: Relies on CORS proxy for browser access
5. **Data Freshness**: BGS updates data periodically; dashboard reflects latest available

## Future Enhancements

Potential improvements for future versions:
- [ ] Add map visualization showing global production
- [ ] Implement country-specific drill-down views
- [ ] Add forecast/prediction capabilities
- [ ] Include commodity price data
- [ ] Add user-saved filter presets
- [ ] Implement dark mode toggle
- [ ] Add PDF export for reports
- [ ] Include data quality indicators
- [ ] Add API status monitoring
- [ ] Implement advanced filtering (by region, continent)

## Contributing

This project follows standard Git workflow:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull/merge request
5. Wait for review and approval

### Code Style
- TypeScript for type safety
- React functional components with hooks
- Tailwind CSS for styling (no custom CSS unless necessary)
- Descriptive variable/function names
- Comments for complex logic

## License

This project uses data from the British Geological Survey (BGS). Please refer to BGS data licensing terms for commercial use restrictions.

## Credits

- **Data Source**: [British Geological Survey (BGS)](https://www.bgs.ac.uk/)
- **Design & Development**: Built with Claude Code
- **UI Components**: Radix UI primitives
- **Charts**: Recharts library

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Refer to BGS documentation for data-related queries

---

**Last Updated**: November 7, 2025
**Version**: 1.0.0
**Status**: Production Ready

## Deployment Checklist

- [x] All console.log statements removed
- [x] TypeScript errors resolved
- [x] Package.json updated with proper name and version
- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [x] GitLab CI/CD configuration ready (`.gitlab-ci.yml`)
- [x] README.md updated with deployment instructions
- [x] All features tested and working
- [x] Responsive design verified
- [x] Production build tested
- [x] Documentation complete

## Quick Deploy Instructions

### To GitHub Pages:
```bash
# 1. Create GitHub repository
# 2. Push code
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Enable GitHub Pages in repo settings (Settings > Pages > GitHub Actions)
# 4. Wait for workflow to complete
# 5. Visit https://<username>.github.io/<repo-name>
```

### To GitLab Pages:
```bash
# 1. Create GitLab repository
# 2. Push code
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. CI/CD pipeline runs automatically
# 4. Visit https://<username>.gitlab.io/<project-name>
```

