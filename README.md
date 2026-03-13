# Interactive Portfolio

Personal portfolio with a scroll-driven floating-dots background. Built with Vite, React, Three.js, GSAP, and Lenis.

## Stack

- **Vite** + **React** (TypeScript)
- **@react-three/fiber** + **Three.js** (floating dots scene)
- **GSAP** + **ScrollTrigger** (camera path, text reveals)
- **Lenis** (smooth scroll)
- **SplitType** (text reveal animations)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Edit content

Edit **`src/experience.json`** for hero text, section copy, projects, and contact (email, LinkedIn, resume URL).

## Social preview (optional)

Add **`public/og-image.png`** (1200×630 px) for link previews on LinkedIn, iMessage, etc. If missing, shares will fall back to your meta description without an image.

## Build

```bash
npm run build
npm run preview
```
