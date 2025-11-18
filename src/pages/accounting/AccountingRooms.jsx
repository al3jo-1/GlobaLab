import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, Plus, Users, LogIn, Trash2, ArrowLeft, Moon, Sun } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountingRooms = () => {
  const { user, createRoom, joinRoom, deleteRoom, selectRoom, theme, toggleTheme } = useAccountingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [newRoomName, setNewRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const success = createRoom(newRoomName.trim());
      if (success) {
        setNewRoomName('');
        setShowCreateForm(false);
      }
    }
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      const success = joinRoom(joinCode.trim().toUpperCase());
      if (success) {
        setJoinCode('');
        setShowJoinForm(false);
      }
    }
  };

  const handleSelectRoom = (roomId) => {
    selectRoom(roomId);
    navigate('/accounting/dashboard');
  };

  const handleDeleteRoom = (roomId) => {
    deleteRoom(roomId);
  };

  React.useEffect(() => {
    if (!user) {
      navigate('/accounting');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-white">GlobalAccounting</span>
                <span className="text-emerald-400">Lab</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <section className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('accounting.welcome', { defaultValue: 'Bienvenido' })}, {user.name}
            </h2>
            <p className="text-xl text-slate-300">
              {user.role === 'teacher' 
                ? t('accounting.manage_rooms', { defaultValue: 'Gestiona tus salas de contabilidad' })
                : t('accounting.select_room', { defaultValue: 'Selecciona o únete a una sala' })
              }
            </p>
          </motion.div>

          {user.role === 'teacher' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {t('accounting.create_room', { defaultValue: 'Crear Nueva Sala' })}
                </Button>
              ) : (
                <Card className="bg-slate-800/50 border-emerald-500/20">
                  <CardHeader>
                    <CardTitle className="text-emerald-400">
                      {t('accounting.create_new_room', { defaultValue: 'Crear Nueva Sala' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="roomName" className="text-slate-200">
                        {t('accounting.room_name', { defaultValue: 'Nombre de la Sala' })}
                      </Label>
                      <Input
                        id="roomName"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder={t('accounting.room_name_placeholder', { defaultValue: 'Ej: Contabilidad 101' })}
                        className="bg-slate-900/50 border-emerald-500/20 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleCreateRoom} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        {t('common.create', { defaultValue: 'Crear' })}
                      </Button>
                      <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1">
                        {t('common.cancel', { defaultValue: 'Cancelar' })}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {user.role === 'student' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              {!showJoinForm ? (
                <Button
                  onClick={() => setShowJoinForm(true)}
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {t('accounting.join_room', { defaultValue: 'Unirse a una Sala' })}
                </Button>
              ) : (
                <Card className="bg-slate-800/50 border-emerald-500/20">
                  <CardHeader>
                    <CardTitle className="text-emerald-400">
                      {t('accounting.join_room', { defaultValue: 'Unirse a una Sala' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="joinCode" className="text-slate-200">
                        {t('accounting.room_code', { defaultValue: 'Código de la Sala' })}
                      </Label>
                      <Input
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="ABC123"
                        className="bg-slate-900/50 border-emerald-500/20 text-white uppercase"
                        maxLength={6}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleJoinRoom} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        {t('common.join', { defaultValue: 'Unirse' })}
                      </Button>
                      <Button onClick={() => setShowJoinForm(false)} variant="outline" className="flex-1">
                        {t('common.cancel', { defaultValue: 'Cancelar' })}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user.rooms || []).map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-100">{room.name}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {t('accounting.code', { defaultValue: 'Código' })}: {room.classCode}
                        </CardDescription>
                      </div>
                      {user.role === 'teacher' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-800 border-emerald-500/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                {t('common.confirm_delete', { defaultValue: '¿Eliminar sala?' })}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-300">
                                {t('accounting.delete_room_warning', { 
                                  defaultValue: 'Esta acción no se puede deshacer. Se eliminará la sala permanentemente.' 
                                })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
                                {t('common.cancel', { defaultValue: 'Cancelar' })}
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRoom(room.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('common.delete', { defaultValue: 'Eliminar' })}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.role === 'teacher' && (
                      <div className="flex items-center text-sm text-slate-400">
                        <Users className="h-4 w-4 mr-2" />
                        {room.studentCount || 0} {t('accounting.students', { defaultValue: 'estudiantes' })}
                      </div>
                    )}
                    <Button 
                      onClick={() => handleSelectRoom(room.id)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      {t('accounting.enter_room', { defaultValue: 'Entrar a la Sala' })}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {(!user.rooms || user.rooms.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-12"
            >
              <p className="text-slate-400 text-lg">
                {user.role === 'teacher' 
                  ? t('accounting.no_rooms_teacher', { defaultValue: 'No tienes salas creadas. Crea tu primera sala para comenzar.' })
                  : t('accounting.no_rooms_student', { defaultValue: 'No estás en ninguna sala. Únete a una sala usando el código proporcionado por tu profesor.' })
                }
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccountingRooms;
