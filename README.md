# Findit — Campus Lost & Found Web Application

Built for the **TriCity AI Hackathon**, **Findit** is a mobile-first campus lost-and-found application designed specifically for **Kakatiya Institute of Technology & Science (KITSW), Warangal**.

It features an editorial aesthetic (warm ivory `#F7F5EF`, forest green `#174B3A`, and serif headlines), an interactive Leaflet + OpenStreetMap campus map, photo-optional SmartMatch, and local image integrity analysis.

---

## Quick Start (Run in your CMD)

Open Command Prompt in the project directory:

```cmd
cd c:\Users\prana\Downloads\FindIt

# 1. Start development server
npm run dev
```

Open your browser at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### Other Useful Commands

```cmd
# Run Type-Check & Production Build
npm run build

# Run Oxlint (0 warnings, 0 errors)
npm run lint

# Preview Production Build locally
npm run preview
```

---

## Core Capabilities

### 1. Interactive KITSW Campus Map (Leaflet + OpenStreetMap)
- **No Google Maps API Key Required**: Powered by Leaflet and OpenStreetMap tiles.
- **Centered on KITSW**: Centered at coordinates `18.0522, 79.5361` with a custom forest green pin.
- **Interactive Pin Adjustment**: Click anywhere on the map or drag the pin to fine-tune report coordinates.
- **Full KITSW Buildings & Blocks (17 Locations)**:
  - Block I: Civil Engineering
  - Block II: Computer Science & Engineering (CSE)
  - Block III: Electrical & Electronics Engineering (EEE) and Mechanical Engineering
  - Block IV: Administrative Block
  - Block V: Information Technology (IT)
  - Block VI: Electronics & Communication Engineering (ECE)
  - Block VII: I2RE
  - Auditorium
  - Cafeteria
  - Indoor Stadium
  - Girl's Hostel
  - Boy's Hostel
  - Dispensary
  - New Convention Hall
  - Workshop
  - Library
  - Main Gate
- **Graceful Fallback**: If map tiles cannot load, reports can still be submitted smoothly by selecting from the campus dropdown.

### 2. Photo-Optional SmartMatch Engine
- A photograph is **never required**. Students can describe items using attributes (category, color, location, distinguishing marks).
- Multi-factor explainable scoring formula:
  - Description & Distinguishing Features (35%)
  - Category & Name Agreement (25%)
  - Color Alignment (15%)
  - **Location & Geographic Proximity (15%)** (uses Haversine distance in meters between pins or block proximity)
  - Date Proximity (10%)

### 3. Image Integrity Analysis (Client-Side)
- Safe, cautious heuristics without falsely accusing genuine students.
- FNV-1a content hash duplicate reuse detection.
- Aspect ratio and resolution anomaly checks.
- Transparent "Flagged for Coordinator Review" workflow.

### 4. Privacy & Claim Verification
- Private identifying detail (e.g., initials inside card holder, scratch marks) stays hidden from public listings.
- Coordinate claims verified in-person at campus coordinator help desks.

---

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System Tokens
- **Maps**: Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **Storage**: Typed LocalStorage with canvas image downsampling
