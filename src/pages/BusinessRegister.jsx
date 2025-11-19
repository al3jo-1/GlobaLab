import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
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
import { Building2 } from 'lucide-react';

const BusinessRegister = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register } = useBusinessContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', 
    plan: 'starter',
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
      plan: value === 'teacher' ? prev.plan : 'starter',
    }));
  };

  const handlePlanChange = (value) => {
    setFormData(prev => ({ ...prev, plan: value }));
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
      plan: formData.role === 'teacher' ? formData.plan : null,
    });
    
    if (registeredUser) {
      navigate('/business/rooms');
    } else {
      setErrors({ email: true, password: true, name: false, confirmPassword: false });
      toast({
        title: t('common.error'),
        description: t('register.error_email'),
        variant: "destructive",
      });
    }
  };
  
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
            <div className="flex items-center justify-center space-x-2">
              <Building2 className="h-8 w-8 text-violet-500" />
              <h1 className="text-3xl font-bold">
                <span className="text-violet-500">GlobalBusiness</span>
                <span className="text-violet-500/70"> Lab</span>
              </h1>
            </div>
            <CardDescription>
              {t('register.title')} <span className="font-semibold text-violet-500">GlobalBusiness Lab</span>
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
                    type="text"
                    placeholder={t('register.name')}
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
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
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
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
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('register.confirm_password')}</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-violet-500"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t('register.role')}</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="focus:ring-violet-500">
                      <SelectValue placeholder={t('register.select_role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t('register.student')}</SelectItem>
                      <SelectItem value="teacher">{t('register.teacher')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="plan">{t('register.plan')}</Label>
                    <Select value={formData.plan} onValueChange={handlePlanChange}>
                      <SelectTrigger className="focus:ring-violet-500">
                        <SelectValue placeholder={t('register.select_plan')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">
                          {t('landing.plans.starter.name', { defaultValue: 'Plan Inicial' })} - $10/mes
                        </SelectItem>
                        <SelectItem value="professional">
                          {t('landing.plans.professional.name', { defaultValue: 'Plan Profesional' })} - $19/mes
                        </SelectItem>
                        <SelectItem value="enterprise">
                          {t('landing.plans.enterprise.name', { defaultValue: 'Plan Empresarial' })} - $29/mes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {t('register.button')}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {t('register.already_account')} {' '}
              <a
                onClick={() => navigate('/business/login')}
                className="text-violet-500 hover:underline cursor-pointer"
              >
                {t('register.login')}
              </a>
            </div>
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
              >
                ← {t('common.back_home', { defaultValue: 'Volver al inicio' })}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessRegister;
