import React, { useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/market-data';
import { Users, DollarSign, TrendingUp, TrendingDown, Activity, Eye, ChevronDown, ChevronUp, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const StudentTransactionDetails = ({ student, isOpen, onClose }) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] glass-card">
        <DialogHeader>
          <DialogTitle>Transacciones de {student.name}</DialogTitle>
          <DialogDescription>
            Detalle de todas las operaciones realizadas por {student.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-1">
          {student.transactions && student.transactions.length > 0 ? (
            <div className="space-y-3">
              {student.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((tx) => (
                <div key={tx.id} className="p-3 border rounded-md bg-background/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm">
                      {tx.type.includes('OPEN') ? 'ABRIR' : 'CERRAR'} {tx.symbol} ({tx.type.includes('BUY') ? 'COMPRA' : 'VENTA'})
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                  </div>
                  <p className="text-xs">Monto: {formatCurrency(tx.amount, tx.currency || 'USD')}</p>
                  <p className="text-xs">Precio: {formatCurrency(tx.price, tx.currency || 'USD')}</p>
                  {tx.type.includes('CLOSE') && (
                    <p className={`text-xs font-medium ${tx.profitOrLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      P/L: {formatCurrency(tx.profitOrLoss, tx.currency || 'USD')}
                    </p>
                  )}
                  {tx.justification && (
                    <div className="mt-1.5 pt-1.5 border-t border-border/50">
                      <p className="text-xs flex items-center"><FileText className="h-3 w-3 mr-1 text-primary/70" /> Justificación:</p>
                      <p className="text-xs italic text-muted-foreground ml-1">{tx.justification}</p>
                    </div>
                  )}
                  {tx.attachmentName && (
                     <p className="text-xs mt-1 flex items-center"><ImageIcon className="h-3 w-3 mr-1 text-primary/70" /> Adjunto: {tx.attachmentName}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Este estudiante aún no tiene transacciones.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const TeacherPortfolio = () => {
  const { studentsInClass, getCurrentPrice } = useTradingContext();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculatePortfolioValue = (student) => {
    let positionsValue = 0;
    if (student.positions) {
      student.positions.forEach(position => {
        const currentPrice = getCurrentPrice(position.symbol);
        const entryPrice = position.entryPrice || 0;
        const priceDiff = position.type === 'BUY' 
          ? currentPrice - entryPrice
          : entryPrice - currentPrice;
        
        let profit = 0;
        if (entryPrice !== 0) {
          profit = position.amount * (priceDiff / entryPrice);
        }
        positionsValue += position.amount + profit;
      });
    }
    return (student.balance || 0) + positionsValue;
  };

  const calculatePortfolioChange = (student) => {
    const initialBalance = student.initialBalance || 10000; 
    const currentValue = calculatePortfolioValue(student);
    if (initialBalance === 0) return 0;
    return ((currentValue - initialBalance) / initialBalance); 
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (!studentsInClass || studentsInClass.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Portafolios de Estudiantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aún no hay estudiantes en tu sala o no tienen actividad registrada.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            Rendimiento de Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Supervisa el valor y rendimiento de los portafolios de tus estudiantes. Haz clic en "Ver Detalles" para ver sus transacciones.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="text-right">Valor del Portafolio</TableHead>
                  <TableHead className="text-right">Variación Total</TableHead>
                  <TableHead className="text-right">Saldo Disponible</TableHead>
                  <TableHead className="text-center">Posiciones</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInClass.map((student) => {
                  const portfolioValue = calculatePortfolioValue(student);
                  const portfolioChange = calculatePortfolioChange(student);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(portfolioValue, 'USD')}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <div className="flex items-center justify-end">
                          {portfolioChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {formatPercentage(portfolioChange * 100)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(student.balance, 'USD')}
                      </TableCell>
                      <TableCell className="text-center">{student.positions?.length || 0}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(student)}>
                          <Eye className="h-4 w-4 mr-1" /> Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <StudentTransactionDetails student={selectedStudent} isOpen={isModalOpen} onClose={handleCloseModal} />
    </motion.div>
  );
};

export default TeacherPortfolio;