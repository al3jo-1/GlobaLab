import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import LandingPage from '@/pages/LandingPage';
import GlobalLabHub from '@/pages/GlobalLabHub';
import RoomSelection from '@/pages/RoomSelection';
import SettingsPage from '@/pages/SettingsPage';
import HelpPage from '@/pages/HelpPage'; 
import LearnPage from '@/pages/LearnPage';
import StudentPortfolioPage from '@/pages/StudentPortfolioPage';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import { TradingProvider, useTradingContext } from '@/contexts/TradingContext';
import { AccountingProvider, useAccountingContext } from '@/contexts/AccountingContext';
import { BusinessProvider, useBusinessContext } from '@/contexts/BusinessContext';
import TeacherMarkets from '@/components/teacher/TeacherMarkets';
import TeacherPortfolio from '@/components/teacher/TeacherPortfolio';
import MarketSimulator from '@/components/teacher/MarketSimulator';
import ExperimentalMarket from '@/components/teacher/ExperimentalMarket';
import NotificationPanel from '@/components/NotificationPanel';
import PriceAlarms from '@/components/PriceAlarms';
import AccountingComingSoon from '@/pages/AccountingComingSoon';
import AccountingLandingPage from '@/pages/AccountingLandingPage';
import AccountingLogin from '@/pages/AccountingLogin';
import AccountingRegister from '@/pages/AccountingRegister';
import AccountingRooms from '@/pages/accounting/AccountingRooms';
import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import FinancialStatements from '@/pages/accounting/FinancialStatements';
import RatioCalculator from '@/pages/accounting/RatioCalculator';
import TeacherDashboard from '@/pages/accounting/TeacherDashboard';
import CaseManager from '@/pages/accounting/CaseManager';
import BusinessComingSoon from '@/pages/BusinessComingSoon';
import BusinessRooms from '@/pages/business/BusinessRooms';
import BusinessDashboard from '@/pages/business/BusinessDashboard';
import CompanyBuilder from '@/pages/business/CompanyBuilder';
import WorkforceManager from '@/pages/business/WorkforceManager';
import LoanSimulator from '@/pages/business/LoanSimulator';
import DecisionCenter from '@/pages/business/DecisionCenter';
import BusinessTeacherDashboard from '@/pages/business/TeacherDashboard';

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
    return <Navigate to="/" replace />;
  }

  if (requireRoom && (!user.rooms || user.rooms.length === 0 || !user.selectedRoomId)) {
    return <Navigate to="/trading/rooms" replace />;
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
    return <Navigate to="/trading/rooms" replace />;
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

const AccountingProtectedRoute = ({ children, requireRoom = false }) => {
  const { user, isLoading } = useAccountingContext();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cargando AccountingLab...</h2>
          <p className="text-slate-300">Preparando la plataforma de contabilidad.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/accounting" replace />;
  }

  if (requireRoom && (!user.rooms || user.rooms.length === 0 || !user.selectedRoomId)) {
    return <Navigate to="/accounting/rooms" replace />;
  }

  return children;
};

const AccountingAuthRoute = ({ children }) => {
  const { user, isLoading } = useAccountingContext();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cargando...</h2>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/accounting/rooms" replace />;
  }
  return children;
};

const BusinessProtectedRoute = ({ children, requireRoom = false }) => {
  const { user, isLoading } = useBusinessContext();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cargando BusinessLab...</h2>
          <p className="text-slate-300">Preparando la plataforma de gestión empresarial.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/business" replace />;
  }

  if (requireRoom && (!user.rooms || user.rooms.length === 0 || !user.selectedRoomId)) {
    return <Navigate to="/business" replace />;
  }

  return children;
};


function AppContent() {
  const { user, theme, toggleTheme } = useTradingContext(); // Get theme and toggleTheme from context

  // Theme application is now handled within TradingContext
  
  return (
    <Router>
      <Routes>
        {/* Main GlobalLab Hub */}
        <Route 
          path="/" 
          element={<GlobalLabHub />} 
        />

        {/* Legacy redirect */}
        <Route 
          path="/welcome" 
          element={<Navigate to="/trading" replace />} 
        />

        {/* Trading Lab Routes */}
        <Route 
          path="/trading" 
          element={<LandingPage />} 
        />
        <Route 
          path="/trading/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/trading/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />
        <Route 
          path="/trading/rooms" 
          element={
            <ProtectedRoute requireRoom={false}>
              <RoomSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trading/dashboard" 
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trading/markets"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<TeacherMarkets />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/portfolio"
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
          path="/trading/learn"
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
          path="/trading/admin"
          element={
            <ProtectedRoute requireRoom={true}>
              <TeacherRouteContent component={MarketSimulator} sectionName="Simulador de Mercado" />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/experimental"
          element={
            <ProtectedRoute requireRoom={true}>
              <TeacherRouteContent component={ExperimentalMarket} sectionName="Aula Experimental" />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/notifications"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<NotificationPanel />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/alarms"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<PriceAlarms />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/settings"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<SettingsPage currentTheme={theme} toggleTheme={toggleTheme} />} />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trading/help"
          element={
            <ProtectedRoute requireRoom={true}>
              <Dashboard mainContent={<HelpPage />} />
            </ProtectedRoute>
          }
        />

        {/* Accounting Lab Routes */}
        <Route 
          path="/accounting" 
          element={<AccountingLandingPage />} 
        />
        <Route 
          path="/accounting/login" 
          element={
            <AccountingAuthRoute>
              <AccountingLogin />
            </AccountingAuthRoute>
          } 
        />
        <Route 
          path="/accounting/register" 
          element={
            <AccountingAuthRoute>
              <AccountingRegister />
            </AccountingAuthRoute>
          } 
        />
        <Route 
          path="/accounting/rooms" 
          element={
            <AccountingProtectedRoute requireRoom={false}>
              <AccountingRooms />
            </AccountingProtectedRoute>
          } 
        />
        <Route 
          path="/accounting/dashboard" 
          element={
            <AccountingProtectedRoute requireRoom={true}>
              <AccountingDashboard />
            </AccountingProtectedRoute>
          } 
        />
        <Route 
          path="/accounting/statements" 
          element={
            <AccountingProtectedRoute requireRoom={true}>
              <FinancialStatements />
            </AccountingProtectedRoute>
          } 
        />
        <Route 
          path="/accounting/ratios" 
          element={
            <AccountingProtectedRoute requireRoom={true}>
              <RatioCalculator />
            </AccountingProtectedRoute>
          } 
        />
        <Route 
          path="/accounting/teacher" 
          element={
            <AccountingProtectedRoute requireRoom={true}>
              <TeacherDashboard />
            </AccountingProtectedRoute>
          } 
        />
        <Route 
          path="/accounting/cases" 
          element={
            <AccountingProtectedRoute requireRoom={true}>
              <CaseManager />
            </AccountingProtectedRoute>
          } 
        />

        {/* Business Lab Routes */}
        <Route 
          path="/business" 
          element={<BusinessComingSoon />} 
        />
        <Route 
          path="/business/dashboard" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <BusinessDashboard />
            </BusinessProtectedRoute>
          } 
        />
        <Route 
          path="/business/company" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <CompanyBuilder />
            </BusinessProtectedRoute>
          } 
        />
        <Route 
          path="/business/workforce" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <WorkforceManager />
            </BusinessProtectedRoute>
          } 
        />
        <Route 
          path="/business/loans" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <LoanSimulator />
            </BusinessProtectedRoute>
          } 
        />
        <Route 
          path="/business/decisions" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <DecisionCenter />
            </BusinessProtectedRoute>
          } 
        />
        <Route 
          path="/business/teacher" 
          element={
            <BusinessProtectedRoute requireRoom={true}>
              <BusinessTeacherDashboard />
            </BusinessProtectedRoute>
          } 
        />

        {/* Legal */}
        <Route 
          path="/privacy" 
          element={<PrivacyPolicy />} 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <TradingProvider>
      <AccountingProvider>
        <BusinessProvider>
          <AppContent />
        </BusinessProvider>
      </AccountingProvider>
    </TradingProvider>
  );
}

export default App;