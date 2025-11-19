import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const BusinessContext = createContext({});

export const useBusinessContext = () => useContext(BusinessContext);

const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const BusinessProvider = ({ children }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [allUsers, setAllUsers, saveAllUsers] = useLocalStorage('business_allUsers', []);
  const [currentUserEmail, setCurrentUserEmail, saveCurrentUserEmail] = useLocalStorage('business_currentUserEmail', null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [theme, setThemeState] = useLocalStorage('business_theme', 'dark');

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
      company: null,
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
      scenarios: [],
      marketConditions: {
        interestRate: 5.0,
        economicGrowth: 2.5,
        inflationRate: 3.0,
        marketDemand: 'normal',
      },
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

  const createCompany = (companyData) => {
    if (!currentUser || currentUser.role !== 'student') return false;

    const newCompany = {
      id: `company_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...companyData,
      cash: companyData.initialCapital || 100000,
      employees: [],
      loans: [],
      revenue: [],
      expenses: [],
      decisions: [],
      kpis: {
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        netProfit: 0,
        employeeCount: 0,
        totalDebt: 0,
        cashFlow: 0,
      },
      createdAt: Date.now(),
    };

    const updatedUser = {
      ...currentUser,
      company: newCompany,
    };

    updateUserInList(updatedUser);
    
    toast({
      title: t('business.company_created', { defaultValue: 'Empresa creada' }),
      description: t('business.company_created_message', { 
        defaultValue: `¡${companyData.name} ha sido creada exitosamente!`,
        name: companyData.name 
      }),
    });

    return true;
  };

  const updateCompany = (updates) => {
    if (!currentUser || !currentUser.company) return false;

    const updatedUser = {
      ...currentUser,
      company: {
        ...currentUser.company,
        ...updates,
      },
    };

    updateUserInList(updatedUser);
    return true;
  };

  const addEmployee = (employeeData) => {
    if (!currentUser || !currentUser.company) return false;

    const newEmployee = {
      id: `employee_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...employeeData,
      hiredAt: Date.now(),
    };

    const updatedCompany = {
      ...currentUser.company,
      employees: [...currentUser.company.employees, newEmployee],
    };

    updateCompany(updatedCompany);

    toast({
      title: t('business.employee_added', { defaultValue: 'Empleado contratado' }),
      description: `${employeeData.name} ha sido agregado al equipo`,
    });

    return true;
  };

  const updateEmployee = (employeeId, updates) => {
    if (!currentUser || !currentUser.company) return false;

    const updatedCompany = {
      ...currentUser.company,
      employees: currentUser.company.employees.map(emp =>
        emp.id === employeeId ? { ...emp, ...updates } : emp
      ),
    };

    updateCompany(updatedCompany);
    return true;
  };

  const removeEmployee = (employeeId) => {
    if (!currentUser || !currentUser.company) return false;

    const updatedCompany = {
      ...currentUser.company,
      employees: currentUser.company.employees.filter(emp => emp.id !== employeeId),
    };

    updateCompany(updatedCompany);

    toast({
      title: t('business.employee_removed', { defaultValue: 'Empleado removido' }),
      description: t('business.employee_removed_message', { defaultValue: 'El empleado ha sido removido de la empresa' }),
    });

    return true;
  };

  const requestLoan = (loanData) => {
    if (!currentUser || !currentUser.company) return false;

    const monthlyRate = loanData.interestRate / 100 / 12;
    const numPayments = loanData.term;
    const monthlyPayment = loanData.amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    const newLoan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...loanData,
      monthlyPayment: monthlyPayment,
      remainingBalance: loanData.amount,
      paymentsMade: 0,
      status: 'active',
      requestedAt: Date.now(),
    };

    const updatedCompany = {
      ...currentUser.company,
      loans: [...currentUser.company.loans, newLoan],
      cash: currentUser.company.cash + loanData.amount,
    };

    updateCompany(updatedCompany);

    toast({
      title: t('business.loan_approved', { defaultValue: 'Préstamo aprobado' }),
      description: `Préstamo de $${loanData.amount.toLocaleString()} aprobado`,
    });

    return true;
  };

  const makeLoanPayment = (loanId) => {
    if (!currentUser || !currentUser.company) return false;

    const loan = currentUser.company.loans.find(l => l.id === loanId);
    if (!loan) return false;

    if (currentUser.company.cash < loan.monthlyPayment) {
      toast({
        title: t('business.insufficient_funds', { defaultValue: 'Fondos insuficientes' }),
        description: t('business.insufficient_funds_message', { defaultValue: 'No hay suficiente efectivo para este pago' }),
        variant: "destructive",
      });
      return false;
    }

    const monthlyRate = loan.interestRate / 100 / 12;
    const interestPayment = loan.remainingBalance * monthlyRate;
    const principalPayment = loan.monthlyPayment - interestPayment;
    const newBalance = loan.remainingBalance - principalPayment;

    const updatedCompany = {
      ...currentUser.company,
      cash: currentUser.company.cash - loan.monthlyPayment,
      loans: currentUser.company.loans.map(l =>
        l.id === loanId
          ? {
              ...l,
              paymentsMade: l.paymentsMade + 1,
              remainingBalance: Math.max(0, newBalance),
              status: l.paymentsMade + 1 >= l.term ? 'paid' : 'active',
            }
          : l
      ),
    };

    updateCompany(updatedCompany);

    toast({
      title: t('business.payment_made', { defaultValue: 'Pago realizado' }),
      description: `Pago de $${loan.monthlyPayment.toLocaleString()} procesado`,
    });

    return true;
  };

  const recordDecision = (scenarioId, decisionData) => {
    if (!currentUser || !currentUser.company) return false;

    const decision = {
      id: `decision_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      scenarioId,
      ...decisionData,
      madeAt: Date.now(),
    };

    const updatedCompany = {
      ...currentUser.company,
      decisions: [...currentUser.company.decisions, decision],
    };

    updateCompany(updatedCompany);
    return true;
  };

  const addScenario = (scenarioData) => {
    if (!currentUser || currentUser.role !== 'teacher') return false;

    const currentRoom = currentUser.rooms?.find(r => r.id === currentUser.selectedRoomId);
    if (!currentRoom) return false;

    const newScenario = {
      id: `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...scenarioData,
      createdAt: Date.now(),
      createdBy: currentUser.id,
    };

    const updatedUser = {
      ...currentUser,
      rooms: currentUser.rooms.map(r =>
        r.id === currentUser.selectedRoomId
          ? { ...r, scenarios: [...(r.scenarios || []), newScenario] }
          : r
      ),
    };

    updateUserInList(updatedUser);

    toast({
      title: t('business.scenario_created', { defaultValue: 'Escenario creado' }),
      description: t('business.scenario_created_message', { defaultValue: 'El escenario ha sido creado exitosamente' }),
    });

    return true;
  };

  const updateMarketConditions = (conditions) => {
    if (!currentUser || currentUser.role !== 'teacher') return false;

    const updatedUser = {
      ...currentUser,
      rooms: currentUser.rooms.map(r =>
        r.id === currentUser.selectedRoomId
          ? { ...r, marketConditions: { ...r.marketConditions, ...conditions } }
          : r
      ),
    };

    updateUserInList(updatedUser);

    toast({
      title: t('business.conditions_updated', { defaultValue: 'Condiciones actualizadas' }),
      description: t('business.conditions_updated_message', { defaultValue: 'Las condiciones de mercado han sido actualizadas' }),
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
    createCompany,
    updateCompany,
    addEmployee,
    updateEmployee,
    removeEmployee,
    requestLoan,
    makeLoanPayment,
    recordDecision,
    addScenario,
    updateMarketConditions,
  };
  
  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
