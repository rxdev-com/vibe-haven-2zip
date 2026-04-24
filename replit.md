# JugaduBazar — Frontend

A React + Vite + Tailwind frontend for JugaduBazar (raw materials marketplace for street food vendors).

## Tech Stack

- React 18
- Vite 6
- React Router 6 (SPA mode)
- Tailwind CSS 3 + Radix UI + Lucide icons
- TanStack Query, Framer Motion, React Three Fiber

## Project Structure

```
client/
├── App.jsx              # SPA routing setup
├── main.jsx             # App entry point
├── global.css           # Tailwind theme + global styles
├── pages/               # Route components (Index.jsx is home)
├── components/
│   └── ui/              # Reusable UI primitives (shadcn-style, Radix-based)
├── contexts/            # Auth, Cart, Notification, Language providers
├── hooks/               # use-mobile, use-toast
└── lib/                 # api.js, mockData.js, utils.js, whatsapp.js
public/                  # Static assets (favicon, robots.txt, etc.)
index.html               # Vite entry HTML
vite.config.js           # Vite config (alias `@` → `./client`)
tailwind.config.js       # Tailwind theming
```

## Scripts

- `npm run dev` — start the Vite dev server on port 5000
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Notes

- Project is frontend-only. The previous Express backend, Mongo models, Netlify functions, and TypeScript tooling were removed per the user's request.
- All source files use `.js` / `.jsx` (no TypeScript).
- The Vite dev server runs on port 5000 with `host: 0.0.0.0` and `allowedHosts: true` so the Replit preview can proxy it.
