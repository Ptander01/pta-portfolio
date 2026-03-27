# PTA Geospatial Intelligence — Portfolio

A premium portfolio site for **PTA Geospatial Intelligence**, showcasing the MLS Analytics Dashboard and other data visualization projects.

Built with the **"Forged Monolith"** design system — dark forge industrial neumorphism bridged from the MLS Dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | Wouter |
| Styling | Tailwind CSS 4 + Custom CSS Variables |
| Animation | Framer Motion 12 |
| Build | Vite 7 |
| Hosting | Vercel |

## Design System

The site uses the **Dark Forge Industrial Neumorphism** design language:

- **Palette:** Deep navy (`#121220`), cyan (`#00d4ff`), amber (`#ffb347`), brushed steel grays
- **Typography:** Space Grotesk (display) + JetBrains Mono (labels/code)
- **Surfaces:** Neumorphic raised/pressed/concave cards with directional bevel lighting
- **Effects:** Glassmorphism, noise grain texture, cyan/amber text glow
- **Motion:** Framer Motion page transitions, staggered reveals, fade-in animations

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Hero section with forge glow, stats bar, about section |
| `/projects` | Projects | MLS Dashboard showcase with feature cards and architecture details |
| `/contact` | Contact | Contact form and social links |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for **Vercel**. Connect the GitHub repo to Vercel and it will auto-detect the Vite configuration.

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Project Structure

```
src/
├── components/
│   ├── animations/       # FadeIn, StaggerChildren, PageTransition
│   ├── layout/           # Navbar, Footer
│   └── ui/               # shadcn/ui primitives (sonner, tooltip, button)
├── contexts/             # ThemeContext (dark mode)
├── hooks/                # useMobile
├── lib/                  # Utility helpers (cn)
├── pages/                # Home, Projects, Contact, NotFound
├── App.tsx               # Root layout + routes
├── main.tsx              # React entry point
└── index.css             # Design system tokens + neumorphic/glass utilities
```

## Related

- [MLS Analytics Dashboard](https://github.com/Ptander01/mls-dashboard) — The flagship project showcased on this portfolio
