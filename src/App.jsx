import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import LandingPage from '@/pages/LandingPage';
import RoomSelection from '@/pages/RoomSelection';
import SettingsPage from '@/pages/SettingsPage';
import HelpPage from '@/pages/HelpPage'; 
import LearnPage from '@/pages/LearnPage';
import StudentPortfolioPage from '@/pages/StudentPortfolioPage';
import { TradingProvider, useTradingContext } from '@/contexts/TradingContext';
import TeacherMarkets from '@/components/teacher/TeacherMarkets';
import TeacherPortfolio from '@/components/teacher/TeacherPortfolio';
import MarketSimulator from '@/components/teacher/MarketSimulator';
import ExperimentalMarket from '@/components/teacher/ExperimentalMarket';
import NotificationPanel from '@/components/NotificationPanel';
import PriceAlarms from '@/components/PriceAlarms';

const ProtectedRoute = ({ children, requireRoom = false }) => {
  const { user, isLoading } = useTradingContext();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cargando GlobalTradeLab...</h2>
          <p className="text-muted-foreground">Preparando la plataforma de trading.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  if (requireRoom && (!user.rooms || user.rooms.length === 0 || !user.selectedRoomId)) {
    return <Navigate to="/rooms" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, isLoading } = useTradingContext();

  if (isLoading) {
     return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cargando...</h2>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/rooms" replace />;
  }
  return children;
}

const PlaceholderComponent = ({ sectionName }) => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold mb-4">{sectionName}</h1>
    <p className="text-muted-foreground">Esta sección está en construcción o es para otro rol.</p>
    <img  alt="En construcción" className="mx-auto mt-8 w-1/2" src="https://images.unsplash.com/photo-1576446468606-ae005a78f937" />
  </div>
);


const TeacherRouteContent = ({ component: Component, sectionName }) => {
  const { user } = useTradingContext();
  if (user?.role !== 'teacher') {
    return <Dashboard mainContent={<PlaceholderComponent sectionName={sectionName || "Acceso Restringido"} />} />;
  }
  return <Dashboard mainContent={<Component />} />;
};

const StudentRouteContent = ({ component: Component, sectionName }) => {
  const { user } = useTradingContext();
  // For markets, students will use the TeacherMarkets component as well
  if (user?.role !== 'student' && sectionName !== "Mercados") {
    return <Dashboard mainContent={<PlaceholderComponent sectionName={sectionName || "Acceso Restringido"} />} />;
  }
  return <Dashboard mainContent={<Component />} />;
};


function AppContent() {
  const { user, theme, toggleTheme } = useTradingContext(); // Get theme and toggleTheme from context

  // Theme application is now handled within TradingContext
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/welcome" 
          element={<LandingPage />} 
        />
        <Route 
          path="/rooms" 
          element={
            <ProtectedRoute requireRoom={false}>
              <RoomSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/markets"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<TeacherMarkets />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/portfolio"
          element={
            <ProtectedRoute requireRoom={true}>
               {user?.role === 'teacher' 
                ? <TeacherRouteContent component={TeacherPortfolio} sectionName="Portafolio (Docente)" />
                : user?.role === 'student'
                ? <StudentRouteContent component={StudentPortfolioPage} sectionName="Mi Portafolio" />
                : <Dashboard mainContent={<PlaceholderComponent sectionName="Portafolio" />} />
               }
            </ProtectedRoute>
          }
        />
        <Route 
          path="/learn"
          element={
            <ProtectedRoute requireRoom={true}>
              {user?.role === 'student' 
                ? <StudentRouteContent component={LearnPage} sectionName="Aprender" />
                : <Dashboard mainContent={<PlaceholderComponent sectionName="Aprender" />} /> 
              }
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin"
          element={
            <ProtectedRoute requireRoom={true}>
              <TeacherRouteContent component={MarketSimulator} sectionName="Simulador de Mercado" />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/experimental"
          element={
            <ProtectedRoute requireRoom={true}>
              <TeacherRouteContent component={ExperimentalMarket} sectionName="Aula Experimental" />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/notifications"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<NotificationPanel />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/alarms"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<PriceAlarms />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/settings"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<SettingsPage currentTheme={theme} toggleTheme={toggleTheme} />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/help"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<HelpPage />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
}

export default App;