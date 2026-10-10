# Findit Code Review & Evaluation Guide

This guide is prepared for technical reviewers (including automated LLM code review).

---

## 1. Project Overview

- **Project Name**: Findit
- **Target Institution**: Kakatiya Institute of Technology & Science (KITSW), Warangal
- **Tech Stack**: React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS 4 + Leaflet 1.9
- **Linter Status**: Oxlint verified (`0 warnings, 0 errors`)
- **TypeScript Compiler Status**: `tsc -b` clean (`0 errors`)

---

## 2. Directory Structure & Key Files

| File / Folder | Role & Architecture Decision |
|---|---|
| `src/services/campusLocations.ts` | Centralized KITSW landmark coordinates, all 17 blocks, and Haversine distance calculator. |
| `src/components/common/CampusLocationPicker.tsx` | Interactive Leaflet + OpenStreetMap picker with custom SVG pin, drag/click events, block search, and fallback error handling. |
| `src/components/common/CampusLocationViewer.tsx` | Read-only campus map display for item details page. |
| `src/services/matchingEngine.ts` | 5-factor explainable SmartMatch algorithm incorporating Haversine geographic distance. |
| `src/services/imageAnalysisService.ts` | Client-side image integrity heuristics, duplicate detection, and cautious risk ratings. |
| `src/services/storageService.ts` | Typed LocalStorage wrapper with canvas downsampling to protect against quota exceptions. |
| `src/context/FindItContext.tsx` | Central state management split into definition and provider for clean React Fast Refresh. |
| `src/pages/ReportPage.tsx` | Dual-mode (Lost/Found) report submission with map picker and inline validation. |
| `src/pages/ItemDetailsPage.tsx` | Item inspection with interactive campus map, match candidates, and claim submission. |
| `src/pages/BrowsePage.tsx` | Filterable catalog by category, type, color, and KITSW blocks. |

---

## 3. Review Checklist & Verification Results

1. **Brand & Identity**:
   - Application name is strictly `Findit` across all headers, titles, and manifest.
   - Campus identifier is `KITSW`.
   - Custom SVG app icon is configured in `public/favicon.svg`.
   - No unwanted images, purple gradient cards, or AI/watermark badges.

2. **Map & Leaflet Compliance**:
   - Zero Google Maps API keys required (pure OpenStreetMap tile provider).
   - Centered at KITSW `(18.0522, 79.5361)`.
   - Safe lifecycle cleanup (`map.remove()`) prevents Leaflet container reinitialization memory leaks.
   - Graceful dropdown fallback ensures reports can be submitted even if offline or tile server is unreachable.

3. **SmartMatch Robustness**:
   - Photo-optional guarantee: reports without photos are scored strictly on physical attributes without penalty.
   - Proximity weighting: uses exact coordinates if present, or resolves building blocks via `findCampusBlock`.

4. **Code Quality**:
   - TypeScript `noUnusedLocals` compliant.
   - Zero lint errors or warnings under `oxlint`.
   - Vite production build generates valid bundles (`dist/`).
