
import { useToast } from "@/components/ui/use-toast";

export const useAuthManager = ({ allUsers, setAllUsers, setCurrentUserEmail, saveCurrentUserEmail, toast, generateClassCode, t }) => {
  const login = (loginData) => {
    const userExists = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    if (userExists) {
      setCurrentUserEmail(userExists.email);
      saveCurrentUserEmail(userExists.email);
      toast({
        title: t('auth.login_success'),
        description: t('auth.login_success_message', { name: userExists.name }),
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
      description: t('auth.logout_success_message'),
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
      leverage: userData.role === 'teacher' ? (userData.leverage || '1:1') : '1:1',
      balance: 10000,
      positions: [],
      transactions: [],
    };
    
    setAllUsers(prevUsers => {
      if (!Array.isArray(prevUsers)) {
        console.error('register: prevUsers is not an array, starting fresh with new user');
        return [newUser];
      }
      
      const existingCheck = prevUsers.find(u => u.email === userData.email);
      if (existingCheck) {
        console.warn('register: User already exists in callback, skipping add');
        return prevUsers;
      }
      
      const updatedUsers = [...prevUsers, newUser];
      
      if (updatedUsers.length !== prevUsers.length + 1) {
        console.error('register: User count mismatch after registration');
        return prevUsers;
      }
      
      const allPreviousUsersPreserved = prevUsers.every(prevUser =>
        updatedUsers.some(u => u.id === prevUser.id)
      );
      
      if (!allPreviousUsersPreserved) {
        console.error('register: Some users were lost during registration, aborting');
        return prevUsers;
      }
      
      return updatedUsers;
    });
    
    setCurrentUserEmail(newUser.email);
    saveCurrentUserEmail(newUser.email);
    
    toast({
      title: t('auth.register_success'),
      description: t('auth.register_success_message', { name: newUser.name }),
    });
    return newUser;
  };

  return { login, logout, register };
};
