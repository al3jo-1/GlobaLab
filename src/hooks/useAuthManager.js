
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
    };
    
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
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
