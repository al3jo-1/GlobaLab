import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Calculator } from 'lucide-react';

const AccountingLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAccountingContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      email: !formData.email || !formData.email.includes('@'),
      password: !formData.password || formData.password.length < 6,
    };
    
    setErrors(newErrors);
    
    if (newErrors.email || newErrors.password) {
      toast({
        title: t('common.error'),
        description: t('login.error_password'),
        variant: "destructive",
      });
      return;
    }
    
    const success = login({
      email: formData.email,
      password: formData.password,
    });
    
    if (!success) {
      setErrors({ email: true, password: true });
      toast({
        title: t('common.error'),
        description: t('login.error_password'),
        variant: "destructive",
      });
    } else {
      navigate('/accounting/rooms');
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
              <Calculator className="h-8 w-8 text-emerald-500" />
              <h1 className="text-3xl font-bold">
                <span className="text-emerald-500">GlobalAccounting</span>
                <span className="text-emerald-500/70"> Lab</span>
              </h1>
            </div>
            <CardDescription>
              {t('login.title')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('login.email')}
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <a href="#" className="text-sm text-emerald-500 hover:underline">
                      {t('login.forgot_password')}
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-emerald-500"}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {t('login.button')}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {t('login.no_account')} {' '}
              <a
                onClick={() => navigate('/accounting/register')}
                className="text-emerald-500 hover:underline cursor-pointer font-semibold"
              >
                {t('login.register')}
              </a>
            </div>
            <div className="text-center">
              <a
                onClick={() => navigate('/globallab')}
                className="text-sm text-muted-foreground hover:text-emerald-500 cursor-pointer"
              >
                ← {t('coming_soon.back_button', { defaultValue: 'Volver a GlobalLab' })}
              </a>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t('login.terms_accept')}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccountingLogin;
