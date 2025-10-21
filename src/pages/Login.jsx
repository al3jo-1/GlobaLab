import React, { useState } from 'react';
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
  const { login } = useTradingContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, ingresa tu correo y contraseña.",
        variant: "destructive",
      });
      return;
    }
    
    const success = login({
      email: formData.email,
      password: formData.password,
    });
    
    if (success) {
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
              Inicia sesión en tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">¿No tienes una cuenta? </span>
              <a href="/register" className="text-primary hover:underline">
                Regístrate
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center text-muted-foreground mt-4">
              Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;