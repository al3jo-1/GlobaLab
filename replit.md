# GlobalTradeLab

## Overview
GlobalTradeLab is a trading simulation platform for educational purposes. It allows students to practice trading stocks and cryptocurrencies in a simulated environment with teacher oversight. The application features real-time market data simulation, portfolio management, and educational resources.

## Project Architecture
- **Frontend**: React + Vite application with Tailwind CSS
- **Backend API**: Express.js server for AI chatbot integration
- **UI Components**: Radix UI with custom styling
- **Charts**: Lightweight Charts library for market visualization
- **Routing**: React Router DOM
- **State Management**: React Context API (TradingContext)
- **Storage**: Local Storage for user data and portfolios
- **AI Integration**: OpenAI GPT-5 for enhanced chatbot responses (optional)
- **Ports**: Frontend on port 5000, Backend API on port 3000

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
- Run `npm run dev` to start the frontend development server (port 5000)
- Run `npm run server` to start the backend API server (port 3000)
- Run `npm run dev:all` to start both servers simultaneously
- Frontend uses Vite with hot module replacement
- Backend provides AI chatbot API with OpenAI integration

## Recent Changes
- 2025-11-07: Correcciones críticas de bugs y mejoras UX
  - ✅ **ARREGLADO**: Bug de ingreso a salas - estudiantes ahora son redirigidos automáticamente al dashboard
    - Modificado `joinRoom` para siempre setear `selectedRoomId` a la sala recién unida
    - Eliminado comportamiento donde estudiantes veían mensaje de éxito pero no ingresaban
  - ✅ **ARREGLADO**: Código de sala ahora aparece en sidebar para profesores y estudiantes
    - Unificada lógica para ambos roles usando `currentRoom.classCode`
    - Funcionalidad de copiar al portapapeles funciona correctamente
  - ✅ Corregido problema de letras cortadas en landing page (agregado line-height y padding adecuado)
  - ✅ Chatbot educativo con integración de OpenAI GPT-5 (opcional):
    - Backend API seguro en Express.js (puerto 3000)
    - Respuestas detalladas y contextuales sobre conceptos financieros
    - Sistema de fallback a knowledge base local (funciona sin API key)
    - Soporte multilenguaje (español e inglés)
    - Para habilitar IA: configurar `OPENAI_API_KEY` en Secrets de Replit
  - ✅ Nuevo workflow backend para API del chatbot


- 2025-11-06: Chatbot educativo y traducciones completas
  - ✅ Chatbot de educación financiera integrado en HelpPage con respuestas simuladas
  - ✅ Traducciones completas del chatbot en los 8 idiomas soportados
  - ✅ Completadas todas las traducciones faltantes en los 8 idiomas (es, en, ru, de, fr, pt, it, hi)
  - ✅ Agregadas secciones "common", "auth", "landing", "rooms" y "chatbot" a todos los archivos de traducción
  - ✅ Código de sala movido arriba del botón de cerrar sesión en el Sidebar (visible para ambos roles)
  - ✅ Funcionalidad de copiar al portapapeles del código de sala para profesores y estudiantes
  - ✅ Todos los mensajes toast ahora usan traducciones i18next (eliminados textos hardcodeados)
  - ✅ TradingContext y useAuthManager completamente traducidos
  - ✅ Archivos JSON validados y corregidos (sintaxis correcta)

- 2025-11-06: Sistema multi-salas y landing page implementados
  - ✅ Landing page tipo Disney+ con 3 planes de precios ($10, $19, y tier empresarial)
  - ✅ Sistema de salas múltiples: profesores pueden crear salas según su plan, estudiantes pueden unirse con código
  - ✅ Interfaz de selección de salas tipo Aternos con opciones de crear/unirse
  - ✅ Estudiantes ya NO ingresan código durante registro, se unen después en /rooms
  - ✅ Rutas actualizadas: /welcome (landing), /rooms (selección), rutas protegidas requieren sala activa
  - ✅ Botón de cambiar salas en el Header
  - ✅ Traducciones completas en español e inglés para todo el sistema de salas
  - ✅ Códigos de sala únicos y no repetibles generados automáticamente
  - ✅ Límites de salas basados en plan: Starter (1), Professional (2), Enterprise (3)
  
- 2025-11-05: Mejoras de calidad y correcciones
  - ✅ Corregida conversión de precios: Acciones colombianas ahora se convierten correctamente de miles de COP a USD (×1000 × tasa de cambio)
  - ✅ Validación visual mejorada: Campos de login y registro se marcan en rojo cuando hay errores
  - ✅ Manejo de errores mejorado: Logging activado en useLocalStorage para mejor debugging
  
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
