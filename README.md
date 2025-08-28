# Min Lara React Frontend

The frontend application for the Min Lara React project, built with React and Vite. This modern single-page application (SPA) provides a responsive interface for user and organization management.

## Features

- Modern React with Hooks
- TanStack Query (React Query) for server state management
- Redux for global UI state management
- Vite for lightning-fast development
- Tailwind CSS for utility-first styling
- Responsive layouts with mobile-first design
- Interactive dashboard with real-time metrics
- Organization management interface
- User management dashboard
- Protected routes with authentication
- Comprehensive reporting system with multiple output formats

## Tech Stack

- React 18+
- Vite
- TanStack Query v5 for server state
- Redux for UI state management
- React Router v6
- Tailwind CSS v3
- Chart.js with React Chart.js 2
- Axios for API communication

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   └── ...           # Other UI components
├── hooks/             # Custom hooks
│   ├── queries/      # TanStack Query hooks
│   └── ...          # Other custom hooks
├── store/             # Redux store for UI state
│   ├── auth.js        # Authentication state management
│   ├── notification.js # Notification state management
│   └── index.js       # Root reducer and store configuration
├── utils/             # Helper functions
└── views/             # Page components
```

## Dashboard Module

The application features a comprehensive dashboard that provides:

### Features

- Real-time statistics and metrics
- Interactive charts and visualizations
- Organization growth tracking
- User role distribution analysis
- Quick action shortcuts
- Key performance indicators (KPIs)

### Charts and Visualizations

- Organization Growth Chart - Track organization creation over time
- User Role Distribution - Visual breakdown of user roles
- Activity metrics and trends
- Interactive data tooltips

## Reports Module

The application includes a powerful reporting system that allows users to generate various types of reports:

### Report Types

- Users Report - Detailed information about system users
- Organizations Report - Overview of registered organizations

### Output Formats

- PDF - For professional document presentation
- Excel - For data analysis and manipulation
- CSV - For raw data export
- JSON - For API integration and data interchange
- HTML - For web viewing with print capability

### Features

- Interactive report generation interface
- Real-time HTML preview
- Direct file downloads
- Print functionality for HTML reports
- Error handling and validation

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file in the frontend root:

   To run along with ASP.Net Core Web API, add the following

   ```env
   VITE_BACKEND_FRAMEWORK=ASP.NET
   VITE_API_BASE_URL=http://localhost:5003
   ```

   To run along with Laravel REST API, add the following

   ```env
   VITE_BACKEND_FRAMEWORK=laravel
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Security Features

- Axios scoped to trusted baseURL via environment variables
- CSRF protection with Laravel Sanctum handshake
- Cookies auto-managed with `withCredentials`
- Relative request paths to avoid SSRF risks
- Protected routes with authentication

## Dependencies

Key dependencies include:

- `react` and `react-dom` - Core React library
- `@tanstack/react-query` - Powerful server state management
- `@reduxjs/toolkit` - Modern Redux with simplified state management
- `react-redux` - React bindings for Redux
- `react-router-dom` - Routing
- `chart.js` and `react-chartjs-2` - Interactive charts
- `tailwindcss` - Utility-first CSS framework
- `axios` - HTTP client
- `@vitejs/plugin-react` - Vite React plugin

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
