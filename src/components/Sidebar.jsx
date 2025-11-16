import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, LogOut, UserCircle, Settings, BookOpen, Briefcase, ShieldCheck, Info, Copy, CheckCircle, X, FlaskConical, Bell, BellRing } from 'lucide-react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';

const Sidebar = ({ onLinkClick }) => {
  const { user, logout } = useTradingContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const currentRoom = user?.rooms?.find(r => r.id === user.selectedRoomId) || user?.rooms?.[0];

  const handleLogout = () => {
    logout();
    if (onLinkClick) onLinkClick();
    navigate('/trading/login');
  };

  const handleCopyCode = (roomCode) => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode).then(() => {
        setCopied(true);
        toast({
          title: t('teacher.code_copied'),
          description: t('teacher.code_copied_description'),
        });
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const navItems = [
    { name: t('navigation.dashboard'), icon: <Home className="h-5 w-5" />, path: '/trading/dashboard', role: ['student', 'teacher'] },
    { name: t('navigation.markets'), icon: <BarChart2 className="h-5 w-5" />, path: '/trading/markets', role: ['student', 'teacher'] },
    { name: t('navigation.portfolio'), icon: <Briefcase className="h-5 w-5" />, path: '/trading/portfolio', role: ['student', 'teacher'] },
    { name: t('navigation.learn', { defaultValue: 'Learn' }), icon: <BookOpen className="h-5 w-5" />, path: '/trading/learn', role: ['student'] },
    { name: t('navigation.admin', { defaultValue: 'Admin' }), icon: <ShieldCheck className="h-5 w-5" />, path: '/trading/admin', role: ['teacher'] },
    { name: t('navigation.experimental', { defaultValue: 'Experimental' }), icon: <FlaskConical className="h-5 w-5" />, path: '/trading/experimental', role: ['teacher'] },
    { name: t('navigation.notifications', { defaultValue: 'Notifications' }), icon: <Bell className="h-5 w-5" />, path: '/trading/notifications', role: ['teacher', 'student'] },
    { name: t('navigation.alarms', { defaultValue: 'Alarms' }), icon: <BellRing className="h-5 w-5" />, path: '/trading/alarms', role: ['teacher', 'student'] },
    { name: t('navigation.settings'), icon: <Settings className="h-5 w-5" />, path: '/trading/settings', role: ['student', 'teacher'] },
    { name: t('navigation.help'), icon: <Info className="h-5 w-5" />, path: '/trading/help', role: ['student', 'teacher'] },
  ];

  const handleNavLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <motion.aside 
      className="bg-background text-foreground p-6 flex flex-col justify-between h-full sticky top-0 glass-sidebar shadow-xl lg:shadow-none"
      initial={{ x: -250 }} // Initial animation for desktop sidebar if needed, or remove if only for mobile
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div>
        <div className="mb-10 flex items-center justify-between">
          <NavLink to="/trading/dashboard" className="inline-block" onClick={handleNavLinkClick}>
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-bold">
                <span className="text-primary">GlobalTrade</span>
                <span className="text-primary/70">Lab</span>
              </h1>
            </div>
          </NavLink>
          <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={onLinkClick}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="space-y-3">
          {navItems.map((item) => 
            item.role.includes(user?.role || 'student') && (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavLinkClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                  isActive ? 'bg-primary/20 text-primary font-semibold shadow-md' : 'text-muted-foreground'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto">
        {user ? (
          <>
            <div className="text-center mb-4 p-3 bg-secondary/30 rounded-lg">
              <UserCircle className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            
            {user?.role === 'teacher' && currentRoom && currentRoom.classCode && (
              <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  {t('teacher.class_code')} {currentRoom.name && `- ${currentRoom.name}`}
                </p>
                <div className="flex items-center justify-center bg-background p-2 rounded-md">
                  <span className="text-sm font-mono text-primary mr-2">{currentRoom.classCode}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopyCode(currentRoom.classCode)} className="h-6 w-6">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
           <NavLink
              to="/trading/login"
              onClick={handleNavLinkClick}
              className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary text-muted-foreground"
            >
              <UserCircle className="h-5 w-5" />
              <span>{t('login.button')}</span>
            </NavLink>
        )}
        
        {user && (
          <Button
            variant="ghost"
            className="w-full flex items-center space-x-3 justify-start p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>{t('navigation.logout')}</span>
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;