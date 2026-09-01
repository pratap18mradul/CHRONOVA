# 🌍 CHRONOVA

### Global Time • Weather • News • Intelligence

**CHRONOVA** is a modern, 100% client-side global intelligence dashboard that brings **world time, interactive maps, live weather, forecasts, atmospheric data, alerts, and location-based news** into one unified experience.

Built entirely with **HTML5, CSS3, Vanilla JavaScript, D3.js, and browser APIs**, CHRONOVA requires **no backend, database, API keys, package manager, or build process**.

---

## ✨ Features

### 🌎 Interactive World Map

* Interactive SVG world map powered by **D3.js v7**
* Pan and zoom support
* Click/select locations
* Local and fallback world geometry
* Location-based dashboard updates

### 🕐 Global Time Intelligence

* Real-time local time
* India Standard Time (IST)
* Selected-location timezone
* Live timezone formatting using `Intl.DateTimeFormat`
* Location time comparison

### 🌤️ Live Weather

* Current temperature
* Weather conditions
* Feels-like temperature
* Humidity
* Wind speed and direction
* Atmospheric pressure
* Visibility
* UV index
* Sunrise and sunset
* Daylight information

### 📅 Weather Forecast

* 5-day weather forecast
* 24-hour temperature trend
* Daily weather conditions
* Temperature visualization using HTML5 Canvas

### 🌙 Solar & Lunar Information

* Sunrise and sunset timings
* Daylight duration
* Moon phase information
* Solar/weather intelligence for selected locations

### 🚨 Weather Alerts

* Severe weather alerts
* National Weather Service integration for supported US locations
* Alert information displayed directly in the dashboard

### 📰 Global News

* Location-based news
* Powered primarily by the **GDELT Project API**
* RSS-style fallback sources through CORS proxy services
* Cached news using `localStorage`

### 📍 Location Intelligence

* Search cities, districts, and countries
* Browser geolocation support
* "Use My Location" functionality
* Recent locations
* Favorite locations
* Location comparison

### 🎨 Modern UI

* Glassmorphism interface
* Responsive CSS Grid & Flexbox
* CSS variables for theme management
* Gradients, borders, shadows, and blur effects
* Animated panels and UI transitions
* Animated starfield background
* Space Grotesk, Inter & JetBrains Mono typography

### 📱 Progressive Web App

* Installable as a PWA
* Web App Manifest
* Service Worker
* Offline caching
* Cache Storage API
* Static deployment compatible

---

## 🛠️ Tech Stack

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**

### Visualization

* **D3.js v7**
* **topojson-client**
* **HTML5 Canvas**
* SVG

### Browser APIs

* Fetch API
* Geolocation API
* Intl.DateTimeFormat
* localStorage
* Service Worker API
* Cache Storage API

### External APIs

| API                              | Purpose                     |
| -------------------------------- | --------------------------- |
| **Open-Meteo Forecast API**      | Weather & forecast data     |
| **Open-Meteo Geocoding API**     | Location search & geocoding |
| **National Weather Service API** | US severe weather alerts    |
| **GDELT Project API**            | Location-based news         |
| **RSS/CORS Proxy Fallbacks**     | Additional news sources     |

---

## 🏗️ Architecture

CHRONOVA follows a **100% client-side architecture**.

```text
                         ┌─────────────────────┐
                         │      CHRONOVA       │
                         │  Global Dashboard   │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
          │  D3.js Map  │    │ Weather API │    │  News API   │
          └─────────────┘    └─────────────┘    └─────────────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │  Vanilla JS State  │
                         │ & Data Processing   │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐   ┌────────────┐   ┌────────────┐
              │   DOM    │   │  Canvas    │   │ localStorage│
              │   UI     │   │ Charts/FX  │   │   Cache     │
              └──────────┘   └────────────┘   └────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Service Worker    │
                         │   Offline Caching   │
                         └─────────────────────┘
```

---

## 📂 Project Structure

```text
CHRONOVA/
│
├── index.html
├── style.css
├── script.js
│
├── service-worker.js
├── manifest.webmanifest
│
├── assets/
│   └── ...
│
└── README.md
```

### Core Files

**`index.html`**
Contains the complete application structure and dashboard layout.

**`style.css`**
Handles the visual system, glassmorphism design, responsive layouts, animations, themes, and UI components.

**`script.js`**
Contains the core application logic, including:

* Application state
* API requests
* Location search
* Geolocation
* World map
* Time calculations
* Weather processing
* News fetching
* Forecast processing
* Canvas charts
* Favorites & recents

**`service-worker.js`**
Provides offline caching and PWA functionality.

**`manifest.webmanifest`**
Defines the application's PWA metadata and installation behavior.

---

## 🚀 Getting Started

CHRONOVA does not require Node.js, npm, a backend, or a build process.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Open the project

Navigate into the project directory:

```bash
cd YOUR-REPOSITORY
```

### 3. Run locally

Because CHRONOVA uses browser APIs and a Service Worker, running it through a local development server is recommended.

For example, using VS Code:

**Live Server → Open with Live Server**

Or use any static HTTP server.

### 4. Deploy

CHRONOVA can be deployed directly to static hosting platforms such as:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages

No backend deployment is required.

---

## 🔑 API Keys

One of the advantages of CHRONOVA is its simple architecture.

**No API keys are required for the primary integrations.**

The application communicates directly with publicly available APIs from the browser.

> API availability and rate limits are controlled by the respective API providers.

---

## 📱 PWA & Offline Support

CHRONOVA is designed as a Progressive Web App.

The application uses:

```text
manifest.webmanifest
        ↓
Installable Web App

service-worker.js
        ↓
Caching & Offline Support

Cache Storage API
        ↓
Previously Cached Resources
```

This allows the application to provide a more app-like experience when installed on supported devices.

---

## 🎯 Design Philosophy

CHRONOVA was designed around the idea of **"global information at a glance."**

Instead of opening separate applications for:

* Time zones
* Weather
* Forecasts
* Maps
* News
* Weather alerts
* Location information

CHRONOVA brings these different data sources together into a single interactive dashboard.

The interface uses a **dark glassmorphism aesthetic** with animated elements to create a futuristic global-control-center feel.

---

## ⚡ Performance & Architecture Goals

CHRONOVA was intentionally built without a framework or backend.

### Why Vanilla JavaScript?

* Lightweight
* No build step
* No dependency management
* Direct browser API access
* Easy static deployment
* Minimal runtime overhead

### Why Client-Side?

The application can be hosted as a collection of static files while still providing:

* Dynamic API data
* Interactive maps
* Location services
* Real-time clocks
* Persistent user preferences
* Offline caching

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* 🌐 More global severe-weather alert providers
* 🌧️ Weather radar integration
* 🗺️ More advanced map layers
* 📊 Additional weather analytics
* 🌍 More location comparison tools
* 🔔 Custom weather notifications
* 📱 Improved mobile dashboard
* 🌙 Enhanced lunar information
* 🛰️ Satellite/weather visualization
* ⚡ Further performance optimization

## 👨‍💻 Author

**MRADUL PRATAP**

Frontend Developer • DSA • UI/UX • JavaScript

* GitHub: `pratap18mradul`
* LinkedIn: `mradul-pratap-42b33732a`

---

## ⭐ Support

If you found CHRONOVA interesting, consider giving the repository a ⭐.

It helps support the project and encourages further development.

---

### 🚀 Built with HTML5 • CSS3 • JavaScript • D3.js • Canvas • Browser APIs
