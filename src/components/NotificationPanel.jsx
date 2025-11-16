import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellOff, Check, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/market-data';

const NotificationPanel = () => {
  const { notifications, markNotificationRead, user } = useTradingContext();
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);

  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student_trade':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'order_executed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'alarm_triggered':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleMarkRead = (notificationId, e) => {
    e.stopPropagation();
    markNotificationRead(notificationId);
  };

  const markAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(n => {
      markNotificationRead(n.id);
    });
  };

  if (!user) return null;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            Notificaciones
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {showUnreadOnly ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-2">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`p-3 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                            {notification.message}
                          </p>
                          {notification.tradeData && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-semibold">
                                {notification.tradeData.symbol}
                              </span>
                              {' - '}
                              {notification.tradeData.amount?.toFixed(2)} USD
                              {notification.tradeData.profitOrLoss !== undefined && (
                                <span className={notification.tradeData.profitOrLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                                  {' (P/L: '}
                                  {notification.tradeData.profitOrLoss >= 0 ? '+' : ''}
                                  {notification.tradeData.profitOrLoss.toFixed(2)} USD)
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleMarkRead(notification.id, e)}
                          className="ml-2"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
