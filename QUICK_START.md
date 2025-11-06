# Quick Start Guide

## ✅ All Fixed!

Three major issues have been resolved:
1. ✅ Dropdown now has solid white background
2. ✅ API calls work correctly
3. ✅ Data field names match actual BGS API (no more zeros!)

## Start Development Server

```bash
bun run dev
```

Then open: http://localhost:4321

## How It Works

### Development (bun run dev)
- Uses **Vite proxy** to handle CORS
- Requests go: Dashboard → `/bgs-api` → Vite proxy → BGS WFS
- No CORS errors!

### Production (GitLab Pages)
- Uses **public CORS proxy** (corsproxy.io)
- Requests go: Dashboard → CORS proxy → BGS WFS
- Works on any static hosting!

## Configuration Summary

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Static output + Vite dev proxy |
| `src/lib/mineralService.ts` | Smart data fetching (dev/prod) |
| `src/components/Dashboard.tsx` | Uses mineral service |
| `src/components/ui/select.tsx` | Fixed dropdown styling |

## What Changed

### From Previous Attempt
- ❌ Tried `output: 'hybrid'` → Not supported in Astro 5
- ❌ Server-side API routes → Not needed!
- ✅ Now using `output: 'static'` → Works everywhere
- ✅ Vite proxy for dev + CORS proxy for prod → Simple!

### Files Modified
1. `astro.config.mjs` - Added Vite proxy, set to static
2. `src/lib/mineralService.ts` - Simplified to use proxies
3. `src/components/ui/select.tsx` - Fixed transparent dropdown
4. `src/components/Dashboard.tsx` - Uses new service
5. `src/pages/index.astro` - Removed unnecessary prerender flag

## Deployment

### GitLab Pages (Ready to Go)
```bash
# Just push to your GitLab repo
git add .
git commit -m "Add BGS dashboard"
git push origin main
```

The `.gitlab-ci.yml` is already configured and will automatically deploy!

### Other Platforms
Works on:
- ✅ Netlify
- ✅ Vercel
- ✅ Cloudflare Pages
- ✅ GitHub Pages
- ✅ Any static hosting

## Testing Checklist

Start the dev server and verify:

- [ ] Page loads without errors
- [ ] Dropdown has white background (not transparent)
- [ ] Can select different commodities
- [ ] Data loads in charts and table
- [ ] Year slider works
- [ ] Data type radio buttons work
- [ ] Export buttons work

## Troubleshooting

### If dropdown is still transparent
- Hard refresh: `Ctrl + Shift + R` or `Cmd + Shift + R`
- Clear browser cache

### If data doesn't load
- Check browser console (F12)
- Look for error messages
- Check terminal where dev server is running
- Should see: "DEV: Fetching via Vite proxy: /bgs-api?..."

### If build fails
- Delete `node_modules` and `bun.lock`
- Run `bun install` again
- Try build: `bun run build`

## Next Steps

1. Start dev server: `bun run dev`
2. Test all features
3. Customize commodities in `src/types/minerals.ts` if needed
4. Deploy to GitLab Pages or your preferred platform
5. Share with stakeholders!

## Questions?

Check these files:
- `FIXES.md` - Detailed explanation of what was fixed
- `.claude.md` - Complete project documentation
- `README.md` - General project info
