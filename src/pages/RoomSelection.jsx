import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Users, LogOut, TrendingUp, Trash2, AlertCircle } from 'lucide-react';
import { useTradingContext } from '@/contexts/TradingContext';
import { useToast } from '@/components/ui/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

const RoomSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, createRoom, joinRoom, deleteRoom, selectRoom, logout, getUserPlan } = useTradingContext();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');

  const userPlan = getUserPlan ? getUserPlan() : { maxRooms: user?.role === 'teacher' ? 1 : 999 };
  const userRooms = user?.rooms || [];

  const handleCreateRoom = () => {
    if (user?.role !== 'teacher') {
      toast({
        title: t('common.error'),
        description: t('rooms.error_teacher_only', { defaultValue: 'Solo los profesores pueden crear salas' }),
        variant: 'destructive',
      });
      return;
    }

    if (userRooms.length >= userPlan.maxRooms) {
      toast({
        title: t('rooms.limit_reached', { defaultValue: 'Límite alcanzado' }),
        description: t('rooms.upgrade_plan', { 
          defaultValue: `Tu plan permite máximo ${userPlan.maxRooms} salas. Actualiza tu plan para crear más.`,
          maxRooms: userPlan.maxRooms 
        }),
        variant: 'destructive',
      });
      return;
    }

    if (!roomName.trim()) {
      toast({
        title: t('common.error'),
        description: t('rooms.error_name', { defaultValue: 'Ingresa un nombre para la sala' }),
        variant: 'destructive',
      });
      return;
    }

    const success = createRoom(roomName.trim());
    if (success) {
      setRoomName('');
      setIsCreateModalOpen(false);
      toast({
        title: t('common.success'),
        description: t('rooms.created', { defaultValue: 'Sala creada exitosamente' }),
      });
    }
  };

  const handleJoinRoom = () => {
    if (user?.role !== 'student') {
      toast({
        title: t('common.error'),
        description: t('rooms.error_student_only', { defaultValue: 'Solo los estudiantes pueden unirse a salas' }),
        variant: 'destructive',
      });
      return;
    }

    if (!roomCode.trim()) {
      toast({
        title: t('common.error'),
        description: t('rooms.error_code', { defaultValue: 'Ingresa un código de sala' }),
        variant: 'destructive',
      });
      return;
    }

    const success = joinRoom(roomCode.trim().toUpperCase());
    if (success) {
      setRoomCode('');
      setIsJoinModalOpen(false);
      toast({
        title: t('common.success'),
        description: t('rooms.joined', { defaultValue: 'Te has unido a la sala exitosamente' }),
      });
      navigate('/');
    }
  };

  const handleSelectRoom = (room) => {
    selectRoom(room.id);
    navigate('/');
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm(t('rooms.confirm_delete', { defaultValue: '¿Estás seguro de eliminar esta sala?' }))) {
      const success = deleteRoom(roomId);
      if (success) {
        toast({
          title: t('common.success'),
          description: t('rooms.deleted', { defaultValue: 'Sala eliminada' }),
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              <span className="text-primary">GlobalTrade</span>
              <span className="text-primary/70">Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('navigation.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Title and User Info */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">
              {t('rooms.title', { defaultValue: 'Salas' })}
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              {t('rooms.subtitle', { 
                defaultValue: user?.role === 'teacher' 
                  ? 'Gestiona tus salas de clase' 
                  : 'Selecciona una sala para acceder' 
              })}
            </p>
            {user?.role === 'teacher' && (
              <p className="text-sm text-muted-foreground">
                {t('rooms.plan_info', { 
                  defaultValue: `Salas activas: ${userRooms.length} / ${userPlan.maxRooms}`,
                  current: userRooms.length,
                  max: userPlan.maxRooms
                })}
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            {user?.role === 'teacher' ? (
              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                {t('rooms.create', { defaultValue: 'Crear Nueva Sala' })}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setIsJoinModalOpen(true)}
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                {t('rooms.join', { defaultValue: 'Nuevo Código de Sala' })}
              </Button>
            )}
          </div>

          {/* Rooms Grid */}
          {userRooms.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {t('rooms.no_rooms', { defaultValue: 'No hay salas disponibles' })}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {user?.role === 'teacher'
                    ? t('rooms.create_first', { defaultValue: 'Crea tu primera sala para comenzar' })
                    : t('rooms.join_first', { defaultValue: 'Únete a una sala para comenzar' })}
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {userRooms.map((room) => (
                <motion.div key={room.id} variants={itemVariants}>
                  <Card 
                    className="glass-card hover:border-primary/50 transition-all cursor-pointer group relative"
                    onClick={() => handleSelectRoom(room)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{room.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {user?.role === 'teacher' ? (
                              <span>
                                {room.studentCount || 0} {t('rooms.students', { defaultValue: 'estudiantes' })}
                              </span>
                            ) : (
                              <span>{t('rooms.student_view', { defaultValue: 'Sala de clase' })}</span>
                            )}
                          </CardDescription>
                        </div>
                        {user?.role === 'teacher' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoom(room.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {user?.role === 'teacher' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t('teacher.class_code')}:
                            </span>
                            <span className="font-mono font-bold text-primary">
                              {room.classCode}
                            </span>
                          </div>
                        </div>
                      )}
                      <Button className="w-full mt-4" variant="outline">
                        {t('rooms.enter', { defaultValue: 'Entrar' })}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Room Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rooms.create_modal.title', { defaultValue: 'Crear Nueva Sala' })}</DialogTitle>
            <DialogDescription>
              {t('rooms.create_modal.description', { defaultValue: 'Ingresa un nombre para tu nueva sala de clase' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">
                {t('rooms.create_modal.name_label', { defaultValue: 'Nombre de la Sala' })}
              </Label>
              <Input
                id="roomName"
                placeholder={t('rooms.create_modal.name_placeholder', { defaultValue: 'Ej: Clase de Trading 2025' })}
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
            </div>
            <Button onClick={handleCreateRoom} className="w-full">
              {t('rooms.create_modal.button', { defaultValue: 'Crear Sala' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Room Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rooms.join_modal.title', { defaultValue: 'Unirse a una Sala' })}</DialogTitle>
            <DialogDescription>
              {t('rooms.join_modal.description', { defaultValue: 'Ingresa el código de la sala proporcionado por tu profesor' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomCode">
                {t('rooms.join_modal.code_label', { defaultValue: 'Código de Sala' })}
              </Label>
              <Input
                id="roomCode"
                placeholder={t('rooms.join_modal.code_placeholder', { defaultValue: 'Ej: ABC123' })}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                className="font-mono text-lg"
              />
            </div>
            <Button onClick={handleJoinRoom} className="w-full">
              {t('rooms.join_modal.button', { defaultValue: 'Unirse' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomSelection;
