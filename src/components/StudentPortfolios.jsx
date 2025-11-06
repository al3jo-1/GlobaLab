import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/market-data';
import { Users, Briefcase, DollarSign } from 'lucide-react';

const StudentPortfolios = ({ students }) => {
  const { t } = useTranslation();
  if (!students || students.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            {t('teacher.students')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('teacher.no_students', { defaultValue: 'No students yet in your room.' })}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          {t('teacher.students')} ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {students.map((student) => (
            <div key={student.id} className="border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <p className="text-muted-foreground">{t('dashboard.cash_balance')}:</p>
                    <p className="font-medium text-foreground">{formatCurrency(student.balance, 'USD')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground">{t('trading.positions')}:</p>
                    <p className="font-medium text-foreground">{student.positions?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPortfolios;