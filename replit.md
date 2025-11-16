# GlobalTradeLab

## Overview
GlobalTradeLab is a trading simulation platform for educational purposes. It allows students to practice trading stocks and cryptocurrencies in a simulated environment with teacher oversight. The application features real-time market data simulation, portfolio management, and educational resources.

## Project Architecture
- **Frontend**: React + Vite application with Tailwind CSS
- **Backend API**: Express.js server with Socket.IO for real-time WebSocket communication
- **Real-time Sync**: Socket.IO with room-based architecture for synchronized market data
- **Market Data Authority**: Server-side price generation with 5-second update loop
- **UI Components**: Radix UI with custom styling
- **Charts**: Lightweight Charts library for market visualization
- **Routing**: React Router DOM
- **State Management**: React Context API (TradingContext) + Socket.IO for real-time state
- **Storage**: Local Storage for user data and portfolios + In-memory server state for rooms
- **AI Integration**: OpenAI GPT-5 for enhanced chatbot responses (optional)
- **Ports**: Frontend on port 5000, Backend API/WebSocket on port 3000

## Key Features
- User authentication (Teacher/Student roles)
- Market simulation with multiple symbols (stocks and crypto)
- **Real-time synchronized market data** via WebSocket (Socket.IO)
- **Experimental Market**: Teacher-controlled manual price overrides with disclaimer
- Portfolio management
- Trade execution (Market orders + Pending orders)
- **Pending Orders**: Buy Limit, Sell Limit, Take Profit, Stop Loss
- **Price Alarms**: TradingView-style price alerts on charts
- **Real-time Notifications**: Teachers receive instant notifications of student trades
- Transaction history
- Teacher controls for market simulation
- Student portfolio monitoring
- Multi-room support with unique class codes

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
- 2025-11-16: Implementación completa de sincronización en tiempo real con Socket.IO
  - ✅ **INFRAESTRUCTURA WEBSOCKET**: Socket.IO configurado en servidor y cliente
    - Server-side market data authority: precios generados en servidor cada 5 segundos
    - Room-based architecture: estado en memoria por sala (precios, órdenes, alarmas, notificaciones)
    - Event handlers completos: join_room, leave_room, price_override, pending_order, price_alarm, notify_student_trade
    - Sincronización automática de estado cuando clientes se conectan
  - ✅ **PANEL MERCADO EXPERIMENTAL**: Control manual de precios para docentes
    - Switch para activar/desactivar modo experimental
    - AlertDialog con disclaimer de responsabilidad
    - Controles deslizantes para ajustar precio de cualquier símbolo
    - Overrides persisten hasta que docente los desactive
    - UI responsive con tabs por tipo de activo (Crypto, Acciones, Forex, Índices)
  - ✅ **PENDING ORDERS (Órdenes Pendientes)**: Sistema completo de órdenes límite
    - Buy Limit: Compra automática cuando precio baja a nivel objetivo
    - Sell Limit: Venta automática cuando precio sube a nivel objetivo
    - Take Profit: Cierre automático de posición al alcanzar ganancia objetivo
    - Stop Loss: Cierre automático de posición para limitar pérdidas
    - Verificación cada 5 segundos en servidor
    - Notificaciones en tiempo real cuando se ejecutan
    - Persistencia en localStorage para resiliencia
  - ✅ **ALARMAS DE PRECIOS**: Alertas estilo TradingView en gráficos
    - Configuración de alarmas por símbolo con precio objetivo
    - Notificaciones push cuando precio alcanza objetivo
    - Gestión completa: crear, editar, eliminar alarmas
    - Verificación en servidor cada 5 segundos
    - UI integrada en componente de gráfico
  - ✅ **SISTEMA DE NOTIFICACIONES EN TIEMPO REAL**
    - Docentes reciben notificaciones instantáneas de operaciones de estudiantes
    - Panel dedicado con lista de notificaciones y estado leído/no leído
    - Socket.IO broadcast a sala cuando estudiante ejecuta trade
    - Persistencia en servidor y localStorage
    - Badge con contador de notificaciones no leídas
  - ✅ **NUEVOS COMPONENTES Y HOOKS**
    - `useSocketManager.js`: Hook personalizado para gestión de Socket.IO
    - `ExperimentalMarket.jsx`: Panel de control de precios experimentales
    - `NotificationPanel.jsx`: Panel de notificaciones en tiempo real
    - `PriceAlarms.jsx`: Gestor de alarmas de precios
    - `alert-dialog.jsx`: Componente UI de Radix para disclaimers
  - ✅ **ACTUALIZACIONES DE NAVEGACIÓN**
    - Nuevas rutas: `/experimental-market`, `/notifications`, `/price-alarms`, `/terms`
    - Sidebar actualizado con navegación a nuevas secciones
    - Documento HTML de términos de uso servido estáticamente
  - ✅ **INTEGRACIÓN COMPLETA**
    - TradingContext refactorizado para usar Socket.IO
    - usePortfolioManager integrado con notifyStudentTrade
    - useMarketDataUpdater deprecado (reemplazado por servidor)
    - Todos los workflows corriendo sin errores
    - Sistema probado y funcional

- 2025-11-07: Fix crítico de unirse a salas y mejora de chatbot con OpenAI
  - ✅ **ARREGLADO DEFINITIVAMENTE**: Bug de ingreso a salas con código
    - Estudiantes pueden unirse correctamente usando el código de sala
    - Se actualiza correctamente el array `rooms` del estudiante
    - Se establece `selectedRoomId` automáticamente a la sala recién unida
    - Se incrementa el contador de estudiantes en la sala del profesor
    - Todos los cambios se persisten en localStorage
    - Funcionalidad probada y verificada por el arquitecto
  - ✅ **CHATBOT MEJORADO CON IA**: Integración de OpenAI GPT-5
    - Backend API configurado con OpenAI (requiere API key con cuota)
    - Sistema de fallback inteligente con respuestas educativas predefinidas
    - Manejo robusto de errores de cuota (error 429)
    - Chatbot siempre funcional, con o sin OpenAI activo
    - Soporte completo para español e inglés
    - Temas: acciones, criptos, riesgo, análisis, portafolio, estrategias
  - ✅ Código limpiado (removidos console.logs de debug)
  - ✅ Documentación completa en TESTING_GUIDE.md
  
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
