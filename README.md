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

## Testing

This project includes a comprehensive testing suite with industry-standard practices:

### Testing Framework
- **Vitest** - Fast unit test runner with native ESM support
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for realistic tests
- **@testing-library/jest-dom** - Additional DOM matchers

### Test Coverage
- **142 tests** across **8 test files**
- **100% coverage** on critical business logic components
- **Professional-grade** error handling and edge case testing

### What's Tested
- **Authentication System** - Login, signup, logout flows with Redux integration
- **Route Protection** - Security-critical route guards and redirects
- **Redux State Management** - Auth and notification slices with immutability
- **HTTP Client** - Axios configuration, interceptors, and error handling
- **Custom Hooks** - Authentication hooks and HTTP client wrapper
- **UI Components** - Button component with all variants and states
- **Error Handling** - API error formatting and user-friendly messages

### Testing Commands
```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run tests with coverage report
npm run test:ui           # Run tests with interactive UI
```

### Testing Approach
- **Unit Testing** - Individual functions and components in isolation
- **Integration Testing** - Redux store integration with React hooks and API calls
- **Mocking Strategy** - MSW for API calls, mocked Redux store, React Router mocking
- **Environment Flexibility** - Tests adapt to different .env configurations
- **Coverage Thresholds** - 80% minimum coverage on critical components
- **Error Scenarios** - Comprehensive error handling and edge case testing

## Project Structure

```
src/
├── __tests__/         # Unit tests for core modules
├── components/        # Reusable UI components
│   ├── __tests__/    # Component tests
│   ├── dashboard/    # Dashboard-specific components
│   └── reusable/     # Reusable UI components
│       └── __tests__/ # Reusable component tests
├── hooks/             # Custom hooks
│   ├── __tests__/    # Hook tests
│   ├── queries/      # TanStack Query hooks
│   │   └── __tests__/ # Query hook tests
│   └── ...          # Other custom hooks
├── store/             # Redux store for UI state
│   ├── __tests__/    # Redux slice tests
│   ├── auth.ts       # Authentication state management
│   ├── notification.ts # Notification state management
│   └── index.ts      # Root reducer and store configuration
├── test/              # Test configuration
│   └── setup.ts      # Global test setup and mocks
├── utils/             # Helper functions
│   └── __tests__/    # Utility function tests
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

5. Run tests:
   ```bash
   npm run test:coverage    # Run tests with coverage
   npm run test            # Run tests in watch mode
   ```

## Security Features

- Axios scoped to trusted baseURL via environment variables
- CSRF protection with Laravel Sanctum handshake
- Cookies auto-managed with `withCredentials`
- Relative request paths to avoid SSRF risks
- Protected routes with authentication

## Dependencies

### Production Dependencies
- `react` and `react-dom` - Core React library
- `@tanstack/react-query` - Powerful server state management
- `@reduxjs/toolkit` - Modern Redux with simplified state management
- `react-redux` - React bindings for Redux
- `react-router-dom` - Routing
- `chart.js` and `react-chartjs-2` - Interactive charts
- `tailwindcss` - Utility-first CSS framework
- `axios` - HTTP client
- `@vitejs/plugin-react` - Vite React plugin

### Testing Dependencies
- `vitest` - Fast unit test runner with native ESM support
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Additional DOM matchers for assertions
- `@testing-library/user-event` - User interaction simulation
- `msw` - Mock Service Worker for API mocking
- `@vitest/coverage-v8` - Code coverage reporting

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with interactive UI
