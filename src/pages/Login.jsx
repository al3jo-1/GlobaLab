import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTradingContext } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useTradingContext();
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
      navigate('/');
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
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">GlobalTrade</span>
                <span className="text-primary/70">Lab</span>
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
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
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
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t('login.button')}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">{t('login.no_account')} </span>
              <a href="/register" className="text-primary hover:underline">
                {t('login.register')}
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

export default Login;