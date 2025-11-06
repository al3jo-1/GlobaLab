
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTradingContext } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register } = useTradingContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', 
    joinedClassCode: '',
    leverage: '1:1', // Default leverage
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value, 
      joinedClassCode: value === 'student' ? prev.joinedClassCode : '',
      leverage: value === 'teacher' ? prev.leverage : '1:1' // Reset leverage if not teacher
    }));
  };

  const handleLeverageChange = (value) => {
    setFormData(prev => ({ ...prev, leverage: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: !formData.name || formData.name.length < 2,
      email: !formData.email || !formData.email.includes('@'),
      password: !formData.password || formData.password.length < 6,
      confirmPassword: !formData.confirmPassword || formData.password !== formData.confirmPassword,
    };
    
    setErrors(newErrors);
    
    if (newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t('common.error'),
          description: t('register.error_password'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('common.error'),
          description: t('register.error_email'),
          variant: "destructive",
        });
      }
      return;
    }
    
    const registeredUser = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      joinedClassCode: formData.role === 'student' ? formData.joinedClassCode : null,
      leverage: formData.role === 'teacher' ? formData.leverage : '1:1',
    });
    
    if (registeredUser) {
      if (registeredUser.role === 'teacher' && registeredUser.classCode) {
        toast({
          title: "¡Código de Sala Generado!",
          description: `Tu código de sala es: ${registeredUser.classCode}. Compártelo con tus estudiantes.`,
          duration: 10000, 
        });
      }
      navigate('/');
    } else {
      setErrors({ email: true, password: true, name: false, confirmPassword: false });
    }
  };

  const leverageOptions = ["1:1", "1:2", "1:10", "1:100", "1:1000"];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-none">
          <CardHeader className="space-y-4 text-center">
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">GlobalTrade</span>
                <span className="text-primary/70">Lab</span>
              </h1>
            </div>
          <CardDescription>
              {t('register.title')} GlobalTradeLab
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('register.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t('register.name')}
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('register.email')}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('register.password')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('register.role')}</Label>
                  <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder={t('register.role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t('register.student')}</SelectItem>
                      <SelectItem value="teacher">{t('register.teacher')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="joinedClassCode">{t('teacher.class_code')}</Label>
                    <Input
                      id="joinedClassCode"
                      name="joinedClassCode"
                      placeholder={t('teacher.class_code')}
                      value={formData.joinedClassCode}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {formData.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="leverage">Leverage</Label>
                    <Select onValueChange={handleLeverageChange} defaultValue={formData.leverage}>
                      <SelectTrigger id="leverage">
                        <SelectValue placeholder="Leverage" />
                      </SelectTrigger>
                      <SelectContent>
                        {leverageOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {t('register.button')}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">{t('register.have_account')} </span>
              <a href="/login" className="text-primary hover:underline">
                {t('register.login')}
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-4">
              {t('login.terms_accept')}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
