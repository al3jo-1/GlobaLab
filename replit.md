# GlobalTradeLab

## Overview
GlobalTradeLab is a trading simulation platform for educational purposes. It allows students to practice trading stocks and cryptocurrencies in a simulated environment with teacher oversight. The application features real-time market data simulation, portfolio management, and educational resources.

## Project Architecture
- **Frontend**: React + Vite application with Tailwind CSS
- **UI Components**: Radix UI with custom styling
- **Charts**: Lightweight Charts library for market visualization
- **Routing**: React Router DOM
- **State Management**: React Context API (TradingContext)
- **Storage**: Local Storage for user data and portfolios
- **Port**: Frontend runs on port 5000

## Key Features
- User authentication (Teacher/Student roles)
- Market simulation with multiple symbols (stocks and crypto)
- Real-time price updates
- Portfolio management
- Trade execution (buy/sell)
- Transaction history
- Teacher controls for market simulation
- Student portfolio monitoring

## Technology Stack
- React 18.2.0
- Vite 4.4.5
- React Router DOM 6.16.0
- Tailwind CSS 3.3.3
- Radix UI components
- Lightweight Charts 4.1.1
- Framer Motion for animations

## Development
- Run `npm run dev` to start the development server
- Frontend available at port 5000
- Uses Vite with hot module replacement

## Recent Changes
- 2025-11-05: Mejoras de calidad y correcciones
  - ✅ Corregida conversión de precios: Acciones colombianas ahora se convierten correctamente de miles de COP a USD (×1000 × tasa de cambio)
  - ✅ Validación visual mejorada: Campos de login y registro se marcan en rojo cuando hay errores
  - ✅ Manejo de errores mejorado: Logging activado en useLocalStorage para mejor debugging
  - Todos los cambios revisados y aprobados por arquitecto
  
- 2025-11-05: Initial setup for Replit environment
  - Configured Vite to bind to 0.0.0.0:5000
  - Set up workflow for development server
  - Created .gitignore and documentation

## Project Structure
- `/src` - Source code
  - `/components` - React components (UI, trading forms, charts, teacher tools)
  - `/contexts` - React context providers (TradingContext)
  - `/hooks` - Custom React hooks
  - `/lib` - Utility libraries (market data generation)
  - `/pages` - Page components (Dashboard, Login, Register, etc.)
- `/public` - Static assets
