import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { DEPARTMENTS, JOB_POSITIONS, calculateMonthlyPayroll } from '@/lib/business-data';
import { Users, Plus, Pencil, Trash2, ArrowLeft, DollarSign, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const WorkforceManager = () => {
  const { user, addEmployee, updateEmployee, removeEmployee } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'operations',
    salary: 0,
  });

  if (!user?.company) {
    navigate('/business/dashboard');
    return null;
  }

  const employees = user.company.employees || [];
  const monthlyPayroll = calculateMonthlyPayroll(employees);

  const handleAdd = () => {
    if (formData.name && formData.position && formData.salary > 0) {
      addEmployee(formData);
      setShowAddDialog(false);
      resetForm();
    }
  };

  const handleEdit = () => {
    if (selectedEmployee && formData.name && formData.position && formData.salary > 0) {
      updateEmployee(selectedEmployee.id, formData);
      setShowEditDialog(false);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      removeEmployee(selectedEmployee.id);
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: 'operations',
      salary: 0,
    });
    setSelectedEmployee(null);
  };

  const openEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const loadJobTemplate = (jobPosition) => {
    setFormData({
      ...formData,
      position: jobPosition.position,
      department: jobPosition.department,
      salary: jobPosition.baseSalary,
    });
  };

  const employeesByDepartment = DEPARTMENTS.map(dept => ({
    ...dept,
    employees: employees.filter(emp => emp.department === dept.value),
  }));

  return (
    <div className="min-h-screen business-bg">
      <header className="sticky top-0 z-50 business-header-bg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business/dashboard')}
              className="business-ghost-btn"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 business-text-muted" />
              <h1 className="text-xl font-bold business-heading">
                {t('business.workforce_management', { defaultValue: 'Gestión de Personal' })}
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="business-btn"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('business.add_employee', { defaultValue: 'Agregar Empleado' })}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card className="business-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium business-text-tertiary">
                {t('business.total_employees', { defaultValue: 'Total Empleados' })}
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold business-heading">{employees.length}</div>
            </CardContent>
          </Card>

          <Card className="business-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium business-text-tertiary">
                {t('business.monthly_payroll', { defaultValue: 'Nómina Mensual' })}
              </CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold business-heading">${monthlyPayroll.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="business-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium business-text-tertiary">
                {t('business.departments', { defaultValue: 'Departamentos' })}
              </CardTitle>
              <Briefcase className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold business-heading">
                {employeesByDepartment.filter(d => d.employees.length > 0).length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {employeesByDepartment.filter(dept => dept.employees.length > 0).map((dept, index) => (
            <motion.div
              key={dept.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="business-card">
                <CardHeader>
                  <CardTitle className="business-heading flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: dept.color }}
                    />
                    {dept.label} ({dept.employees.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="business-table-header">
                          <th className="text-left py-3 px-4 font-medium">
                            {t('business.name', { defaultValue: 'Nombre' })}
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            {t('business.position', { defaultValue: 'Cargo' })}
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            {t('business.salary', { defaultValue: 'Salario' })}
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            {t('business.actions', { defaultValue: 'Acciones' })}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.employees.map((emp) => (
                          <tr key={emp.id} className="business-table-row">
                            <td className="py-3 px-4 business-heading">{emp.name}</td>
                            <td className="py-3 px-4 business-text-secondary">{emp.position}</td>
                            <td className="py-3 px-4 text-emerald-500">${emp.salary.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(emp)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteDialog(emp)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {employees.length === 0 && (
            <Card className="business-card">
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 business-text-tertiary mx-auto mb-4" />
                <p className="business-text-tertiary text-lg mb-4">
                  {t('business.no_employees', { defaultValue: 'No hay empleados contratados aún' })}
                </p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="business-btn"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {t('business.hire_first_employee', { defaultValue: 'Contratar Primer Empleado' })}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="business-dialog max-w-2xl">
          <DialogHeader>
            <DialogTitle className="business-heading">
              {t('business.add_employee', { defaultValue: 'Agregar Empleado' })}
            </DialogTitle>
            <DialogDescription className="business-text-tertiary">
              {t('business.add_employee_description', { defaultValue: 'Completa los datos del nuevo empleado' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {JOB_POSITIONS.slice(0, 6).map((job) => (
                <Button
                  key={job.position}
                  variant="outline"
                  size="sm"
                  onClick={() => loadJobTemplate(job)}
                  className="text-xs"
                >
                  {job.position}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  {t('business.name', { defaultValue: 'Nombre' })} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="business-input"
                />
              </div>

              <div>
                <Label htmlFor="position" className="text-foreground">
                  {t('business.position', { defaultValue: 'Cargo' })} *
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="business-input"
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-foreground">
                  {t('business.department', { defaultValue: 'Departamento' })} *
                </Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="business-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="business-select">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salary" className="text-foreground">
                  {t('business.annual_salary', { defaultValue: 'Salario Anual' })} *
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button onClick={handleAdd} className="bg-violet-600 hover:bg-violet-700">
                {t('common.add', { defaultValue: 'Agregar' })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('business.edit_employee', { defaultValue: 'Editar Empleado' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-foreground">
                  {t('business.name', { defaultValue: 'Nombre' })} *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="edit-position" className="text-foreground">
                  {t('business.position', { defaultValue: 'Cargo' })} *
                </Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="edit-department" className="text-foreground">
                  {t('business.department', { defaultValue: 'Departamento' })} *
                </Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-violet-500/20">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value} className="text-white">
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-salary" className="text-foreground">
                  {t('business.annual_salary', { defaultValue: 'Salario Anual' })} *
                </Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button onClick={handleEdit} className="bg-violet-600 hover:bg-violet-700">
                {t('common.save', { defaultValue: 'Guardar' })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-violet-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {t('business.confirm_delete', { defaultValue: '¿Eliminar empleado?' })}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              {t('business.delete_employee_warning', { 
                defaultValue: 'Esta acción no se puede deshacer. El empleado será removido permanentemente.' 
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
              {t('common.cancel', { defaultValue: 'Cancelar' })}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('common.delete', { defaultValue: 'Eliminar' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkforceManager;
