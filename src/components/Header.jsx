import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTradingContext } from '@/contexts/TradingContext';
import { Sun, Moon, Menu, Bell, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/market-data';

const Header = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { user, logout, theme, toggleTheme, balance } = useTradingContext(); // Added balance
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };


  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="lg:hidden mr-2 text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {user && (
            <div className="hidden sm:flex items-center space-x-2 p-2 rounded-md bg-secondary/50">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(balance, 'USD')}
              </span>
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="text-foreground relative">
            <Bell className="h-5 w-5" />
            {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" /> */}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={user.avatarUrl || ""} alt={user.name || "Usuario"} /> */}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem className="sm:hidden"> {/* Show balance in dropdown for small screens */}
                  <div className="flex items-center w-full">
                    <Wallet className="mr-2 h-4 w-4 text-primary" />
                    <span>{formatCurrency(balance, 'USD')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  {t('navigation.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  {t('navigation.help')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  {t('navigation.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;