
import { useToast } from "@/components/ui/use-toast";

export const useAuthManager = ({ allUsers, setAllUsers, setCurrentUserEmail, saveCurrentUserEmail, toast, generateClassCode }) => {
  const login = (loginData) => {
    const userExists = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    if (userExists) {
      setCurrentUserEmail(userExists.email);
      saveCurrentUserEmail(userExists.email);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, ${userExists.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Correo electrónico o contraseña incorrectos.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = () => {
    setCurrentUserEmail(null);
    saveCurrentUserEmail(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };
  
  const register = (userData) => {
    const userExists = allUsers.find(u => u.email === userData.email);
    if (userExists) {
      toast({
        title: "Error de registro",
        description: "Este correo electrónico ya está registrado.",
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
      balance: 10000, // Initial balance in USD
      positions: [],
      transactions: [],
      classCode: userData.role === 'teacher' ? generateClassCode() : null,
      joinedClassCode: userData.role === 'student' ? userData.joinedClassCode || null : null,
      leverage: userData.role === 'teacher' ? userData.leverage : '1:1', // Store leverage
    };

    if (userData.role === 'student' && userData.joinedClassCode) {
      const teacherExists = allUsers.find(u => u.role === 'teacher' && u.classCode === userData.joinedClassCode);
      if (!teacherExists) {
        toast({
          title: "Código de Sala Inválido",
          description: "El código de sala ingresado no existe. Puedes registrarte sin código.",
          variant: "destructive",
        });
        newUser.joinedClassCode = null; 
      }
    }
    
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setCurrentUserEmail(newUser.email);
    saveCurrentUserEmail(newUser.email);
    
    toast({
      title: "Registro exitoso",
      description: `Bienvenido, ${newUser.name}! Tu cuenta ha sido creada. ${newUser.classCode ? `Tu código de sala es: ${newUser.classCode}` : ''}`,
    });
    return newUser;
  };

  return { login, logout, register };
};
