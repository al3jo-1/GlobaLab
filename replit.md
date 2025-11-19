# GlobalLab

## Overview
GlobalLab is a comprehensive educational simulation platform designed to provide students and teachers with realistic, hands-on experience across three specialized learning environments: finance, accounting, and business management. The platform offers interactive simulators, real-time data, and robust classroom management tools, aiming to develop practical skills in a risk-free setting. It includes a Trading Lab for market simulations, an Accounting Lab for financial analysis, and a Business Lab for entrepreneurial management, positioning itself as a leading tool for experiential learning in economic and business education.

## Recent Changes (November 19, 2025)
- **Authentication System**: Updated AccountingContext and BusinessContext to use consistent object-based login/register signatures, fixed critical persistence bug ensuring user registrations are saved to localStorage
- **Business Lab Authentication Pages**: Created complete authentication flow with BusinessLandingPage, BusinessLogin, and BusinessRegister pages following violet/purple color scheme
- **Translations**: Completed and corrected all translations across 8 languages (en, es, fr, de, it, pt, ru, hi) for both Accounting and Business modules, including missing keys for register forms and landing pages
- **Accounting Lab Color Palette**: Applied consistent emerald/teal color scheme across all Accounting Lab components, replacing blue/purple gradients
- **Routes**: Added Business Lab routes to App.jsx for /business, /business/login, /business/register paths

## User Preferences
I prefer iterative development, so please propose changes and explain them before implementing. Ensure all user-facing text is clear, concise, and easy to understand. I prioritize robust error handling and clear visual feedback for users. When implementing new features, ensure they integrate seamlessly with existing functionalities and maintain a consistent UI/UX. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture
The platform is built with a React + Vite frontend utilizing Tailwind CSS for styling, Radix UI for components, and Lightweight Charts for data visualization. The backend is an Express.js server employing Socket.IO for real-time WebSocket communication, particularly for market data synchronization and real-time notifications. Market data is authoritative on the server, updated every 5 seconds, and can be manually overridden by teachers in an "Experimental Market" mode. State management is handled by React Context API, complemented by Socket.IO for real-time updates. User data and portfolios are persisted in Local Storage, with server-side in-memory state for active rooms. Routing is managed by React Router DOM. AI integration is optional via OpenAI GPT-5 for enhanced chatbot responses.

Key architectural features include:
- **UI/UX**: Professional design with distinct color palettes for each simulator (navy/blue for Trading, emerald/teal for Accounting, violet/purple for Business), adhering to financial platform aesthetics. Radix UI ensures accessibility and responsiveness.
- **Real-time Sync**: Socket.IO with room-based architecture for synchronized market data, pending orders, price alarms, and teacher notifications.
- **Multi-simulator Platform**: A central hub (`/`) routes to separate, full-featured simulators for Trading, Accounting, and Business, each with its own student/teacher management.
- **Financial Analysis**: The Accounting Lab includes financial statement viewers (Balance Sheet, P&L, Cash Flow), ratio calculators, and horizontal/vertical analysis tools.
- **Business Management**: The Business Lab allows virtual company creation, workforce management, loan simulations, and KPI tracking.
- **Teacher Controls**: Comprehensive classroom management, student portfolio monitoring, and market manipulation tools.
- **Persistence**: `market-state.json` for server price persistence and `localStorage` for client-side user and portfolio data.

## External Dependencies
- **Socket.IO**: For real-time, bidirectional communication between clients and server, crucial for market data, notifications, and interactive features.
- **Lightweight Charts**: A high-performance charting library used for displaying market data visualizations.
- **Radix UI**: A collection of accessible, unstyled components for building high-quality UI.
- **OpenAI GPT-5**: (Optional) Integrated for an enhanced educational chatbot, providing detailed and contextual financial concepts.
- **Finnhub API**: (Planned/Partially Integrated for market-state.json) For fetching real-time stock and cryptocurrency market data, providing a more realistic simulation.
- **React Router DOM**: For declarative routing in the React application.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **Framer Motion**: For animations and transitions within the UI.