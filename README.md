# Real-Time Logistics Tracker by Kenneth Tan

A modern web application for real-time driver tracking and dispatch management, built with Next.js, TypeScript, and Redux Toolkit.

![Logistics Tracker](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple)

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd real-time-logistics-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Architecture Decisions & Design Trade-offs

### State Management - Redux Toolkit

**Decision**: Chose Redux Toolkit over Context API or Zustand - Excellent for complex state with multiple data relationships (ensuring the application is scalable and can handle more complex states)

- **Trade-off**: Redux is larger in size compared to Zustand, which is a lighter and more straightforward alternative that could also handle the requirements. However, Redux was chosen for its enterprise-grade scalability, future-proofing the application in case it needs to handle more complex data and states.

### Map Integration - Leaflet vs. Mapbox

**Decision**: Chose React-Leaflet over Mapbox - Lightweight, open source, no API keys required, excellent TypeScript support

- **Trade-off**: Less advanced styling options vs. Mapbox's premium features though it was not necessary for th demo's purposes

### Real-time Architecture - Mock WebSocket

**Decision**: Implemented mock WebSocket with fallback instead of real server for demo purposes, simulating realistic network conditions

- **Trade-off**: Not production WebSocket vs. full server implementation to focus on the front-end.

### Movement Simulation - Linear Interpolation

**Decision**: Used linear interpolation to simulate driver movement which is significantly faster and lighter than implementing full pathfinding algorithms

- **Trade-off**: Drivers move in straight lines between points, which does not reflect real-world road networks or traffic conditions. Linear interpolation was used to avoid requiring external APIs and making the demo unnecessarily complex.

## Known Limitations & Future Optimizations

### Current Limitations

1. **Simplified Movement**

   - Linear interpolation instead of road-based routing, e.g., Google API, which considers traffic and follows actual routes
   - _Optimization_: Integrate Google Directions API for realistic paths

2. **Mock Data Constraints**

   - Limited to 3 drivers and 3 deliveries
   - Hardcoded Ottawa/Toronto locations
   - _Optimization_: Dynamic data loading with pagination involving more cities
   - _Optimization_: Implement data virtualization for 1000+ drivers

3. **WebSocket Simulation**

   - Shows "Offline" status despite working functionality
   - 10% artificial failure rate for demo purposes
   - _Optimization_: Real WebSocket server with Node.js/Socket.io

4. **Browser Performance**

   - No virtualization for large driver lists
   - Map re-renders on every state change
   - _Optimization_: React.memo, virtualization, map clustering

5. **User Experience**

   - Lacks mouse-related/keyboard shortcuts, e.g., dispatch actions
   - Lacks visual or audio notifications
   - _Optimization_: Improve user experience by utilizing more visuals, audio, and accessibility-related features/considerations

6. **Other Constraints**

   - User authentication and role-based permissions haven't been tested
   - Add offline mode with sync capabilities
