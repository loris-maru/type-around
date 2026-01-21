# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.4 application built with React 19, TypeScript, and Tailwind CSS v4. The project uses the App Router architecture and follows modern Next.js conventions.

## Development Commands

### Development Server
```bash
npm run dev
```
Starts the Next.js development server at http://localhost:3000 with hot reload enabled.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Production Server
```bash
npm run start
```
Runs the production build locally (requires running `npm run build` first).

### Linting
```bash
npm run lint
```
Runs ESLint with Next.js configuration for code quality checks.

## Architecture

### Framework Stack
- **Next.js 16.1.4** with App Router (app directory)
- **React 19.2.3** with React JSX transform
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS v4** with PostCSS integration

### Project Structure
- `app/` - Next.js App Router directory containing routes and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives and CSS variables
- `public/` - Static assets (images, fonts, etc.)
- Path alias: `@/*` maps to project root

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX: react-jsx (new JSX transform)
- Path alias `@/*` points to root directory

### Styling Approach
- Tailwind CSS v4 via `@tailwindcss/postcss`
- CSS variables for theming (`--background`, `--foreground`)
- Dark mode support using `prefers-color-scheme`
- Geist Sans and Geist Mono fonts from `next/font/google`
- Inline theme configuration in `globals.css`

### ESLint Configuration
- Uses `eslint-config-next` with core-web-vitals and TypeScript support
- Flat config format (`eslint.config.mjs`)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Coding Standards

### Type Definitions
When creating type definitions, use `type` instead of `interface`.

```typescript
// Preferred
type Props = {
  children: React.ReactNode;
}

// Avoid
interface Props {
  children: React.ReactNode;
}
```

### Component Structure
Follow Next.js App Router patterns:
- Server Components by default
- Use `"use client"` directive only when client-side features are needed
- Metadata exports for SEO configuration

## Deployment

The project is configured for Vercel deployment. Account email: admin@lo-ol.design

To deploy:
1. Push changes to your git repository
2. Connect repository to Vercel
3. Vercel will automatically build and deploy
