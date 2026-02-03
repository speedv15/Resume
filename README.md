# Christian de Laszlo — Resume Website

A minimal, professional resume website built with Vite, designed for both web viewing and PDF export.

## Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production
npm run export-md    # Regenerate static HTML in /docs
```

## Architecture

### Content Files (`/content`)

| File | Purpose |
|------|---------|
| `website.md` | Main website content — unified narrative with visual components |
| `resume.md` | Traditional PDF resume format — bullet-point structure for ATS/recruiters |
| `master_profile.md` | Reference document with comprehensive career details |

### Key Files

```
resume-dev/
├── index.html              # SPA entry point (loads website.md dynamically)
├── src/
│   ├── main.js             # Markdown loading, scroll animations, sticky header
│   └── styles.css          # All styling (components, responsive, print)
├── content/                # Editable content (Markdown + HTML components)
├── docs/                   # Pre-rendered static HTML (for PDF export)
├── scripts/
│   └── build-md.js         # Generates /docs from /content
└── .github/workflows/
    └── deploy.yml          # GitHub Pages deployment
```

### Dual Delivery Model

1. **Website (SPA):** `index.html` dynamically loads `website.md` via JavaScript
2. **PDF/Print:** Static pre-rendered pages in `/docs` with print-optimized CSS

## Content Structure

### Website Flow (website.md)
```
Intro Statement (value proposition)
↓
Impact Stats (key metrics)
↓
Platform Launches (visual timeline)
↓
Training & Education (core responsibilities)
↓
Patents & Innovation (patent grid)
↓
Skills (categorized tags)
↓
Background (career history)
↓
Recognition (testimonials + awards)
```

### Custom HTML Components

The markdown files use embedded HTML for rich visual components:

- **`.impact-stats`** — 4-column stats grid
- **`.launch-timeline`** — Vertical timeline with date badges
- **`.patent-grid`** — 3-column patent listing (name, year, role)
- **`.skills-section`** — Categorized skill tags with color coding
- **`.testimonial-grid`** — Quote cards with attribution
- **`.intro-statement`** — Styled opening paragraph

## Styling

### CSS Variables (`:root`)
```css
--bg: #f6f7fb       /* Page background */
--card: #ffffff     /* Card backgrounds */
--muted: #6b7280    /* Secondary text */
--accent: #0ea5a4   /* Teal accent color */
--text: #0f172a     /* Primary text */
```

### Skill Tag Colors
- `.technical` — Teal
- `.platform` — Indigo
- `.innovation` — Amber
- `.domain` — Navy

### Responsive Breakpoints
- `600px` — Mobile layout (stacked header, 2-column stats)
- `400px` — Compact mobile (smaller fonts)

### Print Styles
Comprehensive `@media print` rules ensure clean PDF output:
- White background, black text
- No shadows or gradients
- Hidden navigation/footer
- Page break management

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Run export-md + Vite production build |
| `npm run export-md` | Generate static HTML in /docs |

### Regenerating Static Pages

After editing content files, run:
```bash
npm run export-md
```

This updates `/docs/*.html` for PDF export.

### Adding New Sections

1. Add content to `website.md` using Markdown + HTML components
2. Add corresponding CSS classes to `styles.css` if needed
3. Update `resume.md` if the section should appear in the PDF version
4. Run `npm run export-md` to regenerate static pages

## Deployment

### GitHub Pages (Automatic)

The `.github/workflows/deploy.yml` workflow:
1. Triggers on push to `main` or `master`
2. Runs `npm run build`
3. Deploys `/dist` to `gh-pages` branch

### Manual Deployment

```bash
npm run build
# Deploy contents of /dist to any static host
```

## File Reference

### Source Resume Files (`/Source Resume Files`)
Original comprehensive documents used as source material:
- `Master_Professional_Profile.md` — Full career profile
- `Performance_Analysis_Summary.md` — Performance review analysis

These are reference materials, not directly rendered.

## Customization

### Changing the Header
Edit `index.html` directly:
- `.site-title` — Name
- `.site-subtitle` — Title & company
- `.contact-inline` — Email & LinkedIn

### Changing Colors
Update CSS variables in `:root` section of `styles.css`

### Changing the Motto
Edit footer in `index.html`:
- `.footer-motto` — "Dream. Simplify. Communicate."

## Print/PDF Export

1. Click "Print / Download Resume" button (opens `/docs/resume.html`)
2. Use browser print dialog (Cmd+P / Ctrl+P)
3. Select "Save as PDF"

The resume.html includes a header with name/title/contact for standalone printing.
