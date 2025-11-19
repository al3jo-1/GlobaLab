import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { sampleCases } from '@/lib/accounting-data';

const AccountingContext = createContext({});

export const useAccountingContext = () => useContext(AccountingContext);

const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const AccountingProvider = ({ children }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [allUsers, setAllUsers, saveAllUsers] = useLocalStorage('accounting_allUsers', []);
  const [currentUserEmail, setCurrentUserEmail, saveCurrentUserEmail] = useLocalStorage('accounting_currentUserEmail', null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [theme, setThemeState] = useLocalStorage('accounting_theme', 'dark');

  const currentUser = allUsers.find(u => u.email === currentUserEmail) || null;

  useEffect(() => {
    setIsLoadingAuth(false);
  }, [currentUserEmail]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateUserInList = (updatedUser) => {
    setAllUsers(prevUsers => {
      const newUsers = prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      saveAllUsers(newUsers);
      return newUsers;
    });
  };

  const login = (loginData) => {
    const user = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (user) {
      setCurrentUserEmail(loginData.email);
      saveCurrentUserEmail(loginData.email);
      toast({
        title: t('auth.login_success'),
        description: t('auth.login_success_message', { name: user.name }),
      });
      return true;
    } else {
      toast({
        title: t('auth.login_error'),
        description: t('auth.login_error_message'),
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUserEmail(null);
    saveCurrentUserEmail(null);
    toast({
      title: t('auth.logout_success'),
      description: t('auth.goodbye'),
    });
  };

  const register = (userData) => {
    const userExists = allUsers.find(u => u.email === userData.email);
    if (userExists) {
      toast({
        title: t('auth.register_error'),
        description: t('auth.register_error_duplicate'),
        variant: "destructive",
      });
      return null;
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      plan: userData.role === 'teacher' ? (userData.plan || 'starter') : null,
      rooms: [],
      selectedRoomId: null,
      analyses: [],
      assignedCases: [],
      createdAt: Date.now(),
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    saveAllUsers(updatedUsers);
    setCurrentUserEmail(newUser.email);
    saveCurrentUserEmail(newUser.email);
    
    toast({
      title: t('auth.register_success'),
      description: t('auth.register_success_message', { name: newUser.name }),
    });
    
    return newUser;
  };

  const PLAN_LIMITS = {
    starter: { maxRooms: 1, maxStudents: 10 },
    professional: { maxRooms: 2, maxStudents: 15 },
    enterprise: { maxRooms: 3, maxStudents: 20 },
  };

  const getUserPlan = () => {
    if (!currentUser || currentUser.role !== 'teacher') {
      return { maxRooms: 999, maxStudents: 999 };
    }
    return PLAN_LIMITS[currentUser.plan || 'starter'];
  };

  const createRoom = (roomName) => {
    if (!currentUser || currentUser.role !== 'teacher') {
      toast({
        title: t('common.error'),
        description: t('auth.error_teacher_only'),
        variant: "destructive",
      });
      return false;
    }

    const plan = getUserPlan();
    if ((currentUser.rooms || []).length >= plan.maxRooms) {
      toast({
        title: t('auth.limit_reached'),
        description: t('auth.limit_reached_message', { max: plan.maxRooms }),
        variant: "destructive",
      });
      return false;
    }

    const roomCode = generateClassCode();
    const newRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: roomName,
      classCode: roomCode,
      createdAt: Date.now(),
      ownerId: currentUser.id,
      studentCount: 0,
      cases: [],
    };

    const updatedUser = {
      ...currentUser,
      rooms: [...(currentUser.rooms || []), newRoom],
    };

    if (!updatedUser.selectedRoomId) {
      updatedUser.selectedRoomId = newRoom.id;
    }

    updateUserInList(updatedUser);
    return true;
  };

  const joinRoom = (roomCode) => {
    if (!currentUser || currentUser.role !== 'student') {
      toast({
        title: t('common.error'),
        description: t('auth.error_student_only'),
        variant: "destructive",
      });
      return false;
    }

    const teacher = allUsers.find(u => u.role === 'teacher' && (u.rooms || []).some(r => r.classCode === roomCode));
    if (!teacher) {
      toast({
        title: t('auth.invalid_code'),
        description: t('auth.invalid_code_message'),
        variant: "destructive",
      });
      return false;
    }

    const teacherRoom = teacher.rooms.find(r => r.classCode === roomCode);
    const teacherPlan = PLAN_LIMITS[teacher.plan || 'starter'];
    const currentStudentCount = teacherRoom.studentCount || 0;

    if (currentStudentCount >= teacherPlan.maxStudents) {
      toast({
        title: t('auth.room_full'),
        description: t('auth.room_full_message', { 
          maxStudents: teacherPlan.maxStudents,
          plan: teacher.plan || 'starter'
        }),
        variant: "destructive",
      });
      return false;
    }

    const alreadyJoined = (currentUser.rooms || []).some(r => r.classCode === roomCode);

    if (alreadyJoined) {
      toast({
        title: t('auth.already_joined'),
        description: t('auth.already_joined_message'),
        variant: "destructive",
      });
      return false;
    }

    const joinedRoom = {
      id: teacherRoom.id,
      name: teacherRoom.name,
      classCode: teacherRoom.classCode,
      ownerId: teacher.id,
      joinedAt: Date.now(),
    };

    const updatedStudent = {
      ...currentUser,
      rooms: [...(currentUser.rooms || []), joinedRoom],
      selectedRoomId: joinedRoom.id,
    };

    const updatedTeacher = {
      ...teacher,
      rooms: teacher.rooms.map(r => 
        r.id === teacherRoom.id 
          ? { ...r, studentCount: (r.studentCount || 0) + 1 }
          : r
      ),
    };

    setAllUsers(prevUsers => {
      const newUsers = prevUsers.map(u => {
        if (u.id === updatedStudent.id) return updatedStudent;
        if (u.id === updatedTeacher.id) return updatedTeacher;
        return u;
      });
      saveAllUsers(newUsers);
      return newUsers;
    });

    return true;
  };

  const deleteRoom = (roomId) => {
    if (!currentUser) return false;

    const updatedRooms = (currentUser.rooms || []).filter(r => r.id !== roomId);
    const updatedUser = {
      ...currentUser,
      rooms: updatedRooms,
      selectedRoomId: currentUser.selectedRoomId === roomId 
        ? (updatedRooms.length > 0 ? updatedRooms[0].id : null)
        : currentUser.selectedRoomId,
    };
    updateUserInList(updatedUser);
    return true;
  };

  const selectRoom = (roomId) => {
    if (!currentUser) return false;

    const roomExists = (currentUser.rooms || []).some(r => r.id === roomId);
    if (!roomExists) {
      toast({
        title: "Error",
        description: "La sala no existe",
        variant: "destructive",
      });
      return false;
    }

    const updatedUser = {
      ...currentUser,
      selectedRoomId: roomId,
    };
    updateUserInList(updatedUser);
    return true;
  };

  const assignCase = (caseId, studentIds) => {
    if (!currentUser || currentUser.role !== 'teacher') return false;

    const selectedCase = sampleCases.find(c => c.id === caseId);
    if (!selectedCase) return false;

    const updatedUsers = allUsers.map(user => {
      if (studentIds.includes(user.id)) {
        const existingCase = (user.assignedCases || []).find(c => c.id === caseId);
        if (!existingCase) {
          return {
            ...user,
            assignedCases: [...(user.assignedCases || []), {
              ...selectedCase,
              assignedAt: Date.now(),
              assignedBy: currentUser.id,
              status: 'pending',
            }]
          };
        }
      }
      return user;
    });

    setAllUsers(updatedUsers);
    saveAllUsers(updatedUsers);

    toast({
      title: t('accounting.case_assigned'),
      description: t('accounting.case_assigned_message', { count: studentIds.length }),
    });

    return true;
  };

  const saveAnalysis = (caseId, analysisData) => {
    if (!currentUser || currentUser.role !== 'student') return false;

    const newAnalysis = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      caseId,
      ...analysisData,
      createdAt: Date.now(),
    };

    const updatedUser = {
      ...currentUser,
      analyses: [...(currentUser.analyses || []), newAnalysis],
      assignedCases: (currentUser.assignedCases || []).map(c => 
        c.id === caseId ? { ...c, status: 'completed' } : c
      ),
    };

    updateUserInList(updatedUser);

    toast({
      title: t('accounting.analysis_saved'),
      description: t('accounting.analysis_saved_message'),
    });

    return true;
  };

  const currentRoom = currentUser?.rooms?.find(r => r.id === currentUser.selectedRoomId);

  const studentsInClass = currentUser?.role === 'teacher' && currentRoom
    ? allUsers.filter(u => 
        u.role === 'student' && 
        (u.rooms || []).some(r => r.classCode === currentRoom.classCode)
      ) 
    : [];

  const value = {
    user: currentUser,
    allUsers,
    studentsInClass,
    isLoading: isLoadingAuth,
    login,
    logout,
    register,
    theme,
    toggleTheme,
    createRoom,
    joinRoom,
    deleteRoom,
    selectRoom,
    getUserPlan,
    currentRoom,
    sampleCases,
    assignCase,
    saveAnalysis,
  };
  
  return (
    <AccountingContext.Provider value={value}>
      {children}
    </AccountingContext.Provider>
  );
};
