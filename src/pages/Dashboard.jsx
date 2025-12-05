import React, { useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PriceChart from '@/components/PriceChart';
import MarketSymbols from '@/components/MarketSymbols';
import TradeForm from '@/components/TradeForm';
import PositionsList from '@/components/PositionsList';
import TransactionHistory from '@/components/TransactionHistory';
import StudentPortfolios from '@/components/StudentPortfolios'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardContent = () => {
  const { user, studentsInClass } = useTradingContext();
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          <TradeForm />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PositionsList />
        </div>
        <div>
          <MarketSymbols />
        </div>
      </div>
      
      <div className="mb-6">
        <TransactionHistory limit={isStudent ? 10 : undefined} />
      </div>

      {isTeacher && (
        <div className="mb-6">
          <StudentPortfolios students={studentsInClass || []} />
        </div>
      )}
      
    </motion.div>
  );
};


const Dashboard = ({ mainContent }) => {
  const { isLoading, user } = useTradingContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
     return <Navigate to="/trading/login" replace />;
  }
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block lg:w-64">
        <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 w-64 lg:hidden"
            >
              <Sidebar onLinkClick={toggleMobileMenu} />
            </motion.div>
            {/* Overlay for mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 lg:hidden"
              onClick={toggleMobileMenu}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-screen"> {/* Ensure main content area can scroll independently */}
        <Header isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <main className="container mx-auto p-4 pt-20 lg:pt-4"> {/* Add padding-top for mobile header */}
          {mainContent || <DashboardContent />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;