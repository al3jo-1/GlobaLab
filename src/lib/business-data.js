export const COMPANY_TYPES = [
  { value: 'LLC', label: 'LLC (Limited Liability Company)', description: 'Sociedad de Responsabilidad Limitada' },
  { value: 'SA', label: 'S.A. (Sociedad Anónima)', description: 'Corporación con acciones' },
  { value: 'SAS', label: 'S.A.S. (Sociedad por Acciones Simplificada)', description: 'Estructura simplificada' },
  { value: 'SC', label: 'S.C. (Sociedad Colectiva)', description: 'Sociedad de personas' },
];

export const INDUSTRIES = [
  { value: 'technology', label: 'Tecnología', growth: 0.08, volatility: 0.15 },
  { value: 'retail', label: 'Comercio Minorista', growth: 0.03, volatility: 0.08 },
  { value: 'manufacturing', label: 'Manufactura', growth: 0.04, volatility: 0.10 },
  { value: 'services', label: 'Servicios', growth: 0.05, volatility: 0.07 },
  { value: 'food', label: 'Alimentos y Bebidas', growth: 0.04, volatility: 0.06 },
  { value: 'healthcare', label: 'Salud', growth: 0.06, volatility: 0.05 },
  { value: 'finance', label: 'Finanzas', growth: 0.05, volatility: 0.12 },
  { value: 'education', label: 'Educación', growth: 0.04, volatility: 0.04 },
  { value: 'construction', label: 'Construcción', growth: 0.03, volatility: 0.14 },
  { value: 'entertainment', label: 'Entretenimiento', growth: 0.07, volatility: 0.16 },
];

export const DEPARTMENTS = [
  { value: 'executive', label: 'Ejecutivo', color: '#8b5cf6' },
  { value: 'finance', label: 'Finanzas', color: '#10b981' },
  { value: 'operations', label: 'Operaciones', color: '#3b82f6' },
  { value: 'sales', label: 'Ventas', color: '#f59e0b' },
  { value: 'marketing', label: 'Marketing', color: '#ec4899' },
  { value: 'hr', label: 'Recursos Humanos', color: '#6366f1' },
  { value: 'it', label: 'Tecnología', color: '#14b8a6' },
  { value: 'legal', label: 'Legal', color: '#64748b' },
  { value: 'customer_service', label: 'Servicio al Cliente', color: '#f97316' },
];

export const JOB_POSITIONS = [
  { department: 'executive', position: 'CEO', level: 'executive', baseSalary: 150000 },
  { department: 'executive', position: 'CFO', level: 'executive', baseSalary: 130000 },
  { department: 'executive', position: 'COO', level: 'executive', baseSalary: 125000 },
  { department: 'executive', position: 'CMO', level: 'executive', baseSalary: 120000 },
  { department: 'finance', position: 'Contador', level: 'manager', baseSalary: 65000 },
  { department: 'finance', position: 'Analista Financiero', level: 'staff', baseSalary: 50000 },
  { department: 'finance', position: 'Auditor', level: 'staff', baseSalary: 55000 },
  { department: 'operations', position: 'Gerente de Operaciones', level: 'manager', baseSalary: 70000 },
  { department: 'operations', position: 'Supervisor de Producción', level: 'staff', baseSalary: 45000 },
  { department: 'operations', position: 'Operario', level: 'staff', baseSalary: 30000 },
  { department: 'sales', position: 'Gerente de Ventas', level: 'manager', baseSalary: 75000 },
  { department: 'sales', position: 'Ejecutivo de Ventas', level: 'staff', baseSalary: 40000 },
  { department: 'marketing', position: 'Gerente de Marketing', level: 'manager', baseSalary: 70000 },
  { department: 'marketing', position: 'Especialista en Marketing Digital', level: 'staff', baseSalary: 45000 },
  { department: 'marketing', position: 'Diseñador Gráfico', level: 'staff', baseSalary: 40000 },
  { department: 'hr', position: 'Gerente de RRHH', level: 'manager', baseSalary: 65000 },
  { department: 'hr', position: 'Reclutador', level: 'staff', baseSalary: 42000 },
  { department: 'it', position: 'CTO', level: 'executive', baseSalary: 135000 },
  { department: 'it', position: 'Desarrollador Senior', level: 'manager', baseSalary: 80000 },
  { department: 'it', position: 'Desarrollador Junior', level: 'staff', baseSalary: 45000 },
  { department: 'it', position: 'Soporte Técnico', level: 'staff', baseSalary: 35000 },
  { department: 'legal', position: 'Abogado Corporativo', level: 'manager', baseSalary: 85000 },
  { department: 'customer_service', position: 'Gerente de Servicio al Cliente', level: 'manager', baseSalary: 60000 },
  { department: 'customer_service', position: 'Representante de Servicio', level: 'staff', baseSalary: 32000 },
];

export const EXPENSE_CATEGORIES = [
  { id: 'payroll', label: 'Nómina', description: 'Salarios y beneficios de empleados', baseAmount: 0 },
  { id: 'rent', label: 'Arriendo', description: 'Alquiler de oficinas y espacios comerciales', baseAmount: 5000 },
  { id: 'services', label: 'Servicios', description: 'Servicios públicos, internet, teléfono', baseAmount: 1200 },
  { id: 'taxes', label: 'Impuestos', description: 'IVA, impuesto sobre la renta, impuestos de nómina', baseAmount: 0 },
  { id: 'marketing', label: 'Marketing', description: 'Publicidad y promoción', baseAmount: 2000 },
  { id: 'operations', label: 'Operaciones', description: 'Costos operacionales', baseAmount: 3000 },
  { id: 'supplies', label: 'Suministros', description: 'Material de oficina y otros suministros', baseAmount: 800 },
];

export const DECISION_SCENARIOS = [
  {
    id: 'expansion_opportunity',
    title: 'Oportunidad de Expansión',
    category: 'opportunity',
    difficulty: 'medium',
    description: 'Una empresa competidora está en venta. Tienes la oportunidad de adquirirla para expandir tu participación de mercado.',
    context: 'El precio de compra es de $250,000. La empresa genera $50,000 anuales de ingresos netos.',
    options: [
      {
        id: 'acquire',
        label: 'Adquirir la empresa',
        effects: {
          cash: -250000,
          monthlyRevenue: 4167,
          marketShare: 0.15,
          description: 'Adquieres la empresa, expandiendo tu participación de mercado pero reduciendo tu efectivo.',
        },
      },
      {
        id: 'pass',
        label: 'No adquirir',
        effects: {
          description: 'Decides no adquirir la empresa y mantener tu posición actual.',
        },
      },
      {
        id: 'negotiate',
        label: 'Negociar precio',
        effects: {
          cash: -200000,
          monthlyRevenue: 3500,
          marketShare: 0.12,
          description: 'Negocias un mejor precio pero la empresa pierde algunos clientes durante la transición.',
        },
      },
    ],
  },
  {
    id: 'economic_downturn',
    title: 'Crisis Económica',
    category: 'crisis',
    difficulty: 'hard',
    description: 'La economía entra en recesión. Las ventas están cayendo y los costos están aumentando.',
    context: 'Tus ingresos mensuales han caído un 30%. Debes tomar medidas para mantener la empresa a flote.',
    options: [
      {
        id: 'layoffs',
        label: 'Reducir personal (20%)',
        effects: {
          monthlyExpenses: -8000,
          employeeMorale: -30,
          description: 'Reduces costos laborales pero afectas la moral del equipo.',
        },
      },
      {
        id: 'salary_cut',
        label: 'Reducir salarios (15%)',
        effects: {
          monthlyExpenses: -6000,
          employeeMorale: -20,
          description: 'Reduces salarios temporalmente para todos los empleados.',
        },
      },
      {
        id: 'take_loan',
        label: 'Solicitar préstamo de emergencia',
        effects: {
          cash: 100000,
          debt: 100000,
          description: 'Obtienes liquidez inmediata pero aumentas tu deuda.',
        },
      },
      {
        id: 'diversify',
        label: 'Diversificar productos',
        effects: {
          cash: -30000,
          monthlyRevenue: 5000,
          description: 'Inviertes en nuevos productos que pueden generar ingresos adicionales.',
        },
      },
    ],
  },
  {
    id: 'talent_retention',
    title: 'Retención de Talento',
    category: 'challenge',
    difficulty: 'medium',
    description: 'Tu mejor empleado recibió una oferta de la competencia por 30% más de salario.',
    context: 'Este empleado es clave para tu operación y su salida podría afectar significativamente el negocio.',
    options: [
      {
        id: 'match_offer',
        label: 'Igualar la oferta',
        effects: {
          monthlyExpenses: 2000,
          employeeMorale: 10,
          description: 'Retienes al empleado pero aumentas tus costos laborales.',
        },
      },
      {
        id: 'counteroffer',
        label: 'Contraoferta con beneficios',
        effects: {
          monthlyExpenses: 1000,
          employeeMorale: 5,
          description: 'Ofreces beneficios adicionales en lugar de solo salario.',
        },
      },
      {
        id: 'let_go',
        label: 'Dejar ir al empleado',
        effects: {
          monthlyRevenue: -3000,
          employeeMorale: -10,
          description: 'Pierdes al empleado y sufres una caída temporal en productividad.',
        },
      },
    ],
  },
  {
    id: 'technology_investment',
    title: 'Inversión en Tecnología',
    category: 'opportunity',
    difficulty: 'easy',
    description: 'Una nueva tecnología podría automatizar el 40% de tus procesos operativos.',
    context: 'La implementación cuesta $80,000 pero reduciría costos operativos en $3,000 mensuales.',
    options: [
      {
        id: 'invest_full',
        label: 'Invertir completamente',
        effects: {
          cash: -80000,
          monthlyExpenses: -3000,
          efficiency: 0.4,
          description: 'Implementas la tecnología completamente, mejorando la eficiencia.',
        },
      },
      {
        id: 'invest_partial',
        label: 'Implementación gradual',
        effects: {
          cash: -40000,
          monthlyExpenses: -1500,
          efficiency: 0.2,
          description: 'Implementas la tecnología gradualmente con menor riesgo.',
        },
      },
      {
        id: 'postpone',
        label: 'Postponer inversión',
        effects: {
          description: 'Decides esperar y evaluar más opciones.',
        },
      },
    ],
  },
  {
    id: 'supplier_issue',
    title: 'Problema con Proveedor',
    category: 'crisis',
    difficulty: 'medium',
    description: 'Tu proveedor principal aumentó precios un 25% sin previo aviso.',
    context: 'Esto impactará directamente tus márgenes de ganancia. Debes encontrar una solución rápida.',
    options: [
      {
        id: 'accept_increase',
        label: 'Aceptar aumento y subir precios',
        effects: {
          monthlyExpenses: 5000,
          monthlyRevenue: 4000,
          customerSatisfaction: -10,
          description: 'Transfieres el costo a tus clientes pero algunos pueden irse.',
        },
      },
      {
        id: 'find_alternative',
        label: 'Buscar proveedor alternativo',
        effects: {
          cash: -10000,
          monthlyExpenses: 2000,
          description: 'Cambias de proveedor con costos de transición pero menores costos a largo plazo.',
        },
      },
      {
        id: 'negotiate',
        label: 'Negociar con proveedor',
        effects: {
          monthlyExpenses: 3000,
          description: 'Negocias un aumento menor del 15% manteniendo la relación.',
        },
      },
    ],
  },
  {
    id: 'market_expansion',
    title: 'Expansión de Mercado',
    category: 'opportunity',
    difficulty: 'hard',
    description: 'Se abre la oportunidad de expandirse a un nuevo mercado geográfico.',
    context: 'Requiere inversión inicial de $150,000 y podría generar $8,000 mensuales después de 6 meses.',
    options: [
      {
        id: 'expand_aggressive',
        label: 'Expansión agresiva',
        effects: {
          cash: -150000,
          monthlyRevenue: 8000,
          marketShare: 0.20,
          description: 'Te expandes completamente con alto potencial pero alto riesgo.',
        },
      },
      {
        id: 'pilot_test',
        label: 'Prueba piloto',
        effects: {
          cash: -50000,
          monthlyRevenue: 3000,
          marketShare: 0.08,
          description: 'Realizas una prueba piloto con menor inversión y riesgo.',
        },
      },
      {
        id: 'stay_focused',
        label: 'Mantener foco actual',
        effects: {
          description: 'Decides fortalecer tu posición en el mercado actual.',
        },
      },
    ],
  },
  {
    id: 'quality_vs_cost',
    title: 'Calidad vs. Costo',
    category: 'challenge',
    difficulty: 'medium',
    description: 'Puedes reducir costos usando materiales más baratos pero de menor calidad.',
    context: 'Esto reduciría costos en $4,000 mensuales pero podría afectar la satisfacción del cliente.',
    options: [
      {
        id: 'reduce_cost',
        label: 'Reducir costos',
        effects: {
          monthlyExpenses: -4000,
          customerSatisfaction: -20,
          monthlyRevenue: -2000,
          description: 'Reduces costos pero algunos clientes notan la diferencia.',
        },
      },
      {
        id: 'maintain_quality',
        label: 'Mantener calidad',
        effects: {
          customerSatisfaction: 10,
          description: 'Mantienes la calidad y fortaleces la lealtad de clientes.',
        },
      },
      {
        id: 'premium_option',
        label: 'Crear línea premium',
        effects: {
          cash: -20000,
          monthlyRevenue: 3000,
          description: 'Creas una línea premium manteniendo la original.',
        },
      },
    ],
  },
  {
    id: 'cybersecurity_threat',
    title: 'Amenaza de Ciberseguridad',
    category: 'crisis',
    difficulty: 'hard',
    description: 'Tu empresa sufrió un intento de hackeo. Los sistemas están comprometidos y necesitas tomar medidas urgentes.',
    context: 'El ataque podría haber expuesto datos de clientes. Necesitas actuar rápido para proteger la información y mantener la confianza.',
    options: [
      {
        id: 'hire_experts',
        label: 'Contratar expertos en ciberseguridad',
        effects: {
          cash: -60000,
          monthlyExpenses: 5000,
          customerSatisfaction: 15,
          description: 'Contratas expertos que fortalecen tu seguridad y recuperan la confianza de clientes.',
        },
      },
      {
        id: 'internal_solution',
        label: 'Solución interna con IT',
        effects: {
          cash: -20000,
          employeeMorale: -15,
          description: 'Tu equipo interno maneja la crisis pero están sobrecargados.',
        },
      },
      {
        id: 'insurance_claim',
        label: 'Reclamar seguro cibernético',
        effects: {
          cash: 40000,
          customerSatisfaction: -10,
          description: 'El seguro cubre parte del daño pero el proceso es lento.',
        },
      },
    ],
  },
  {
    id: 'sustainability_initiative',
    title: 'Iniciativa de Sostenibilidad',
    category: 'opportunity',
    difficulty: 'medium',
    description: 'Los consumidores demandan prácticas sostenibles. Puedes implementar un programa verde.',
    context: 'Invertir en sostenibilidad mejorará tu imagen de marca y podría atraer nuevos clientes conscientes.',
    options: [
      {
        id: 'full_green',
        label: 'Programa completo de sostenibilidad',
        effects: {
          cash: -100000,
          monthlyRevenue: 6000,
          customerSatisfaction: 25,
          description: 'Implementas energía renovable y prácticas verdes completamente.',
        },
      },
      {
        id: 'partial_green',
        label: 'Iniciativas verdes graduales',
        effects: {
          cash: -40000,
          monthlyRevenue: 2500,
          customerSatisfaction: 10,
          description: 'Implementas cambios graduales hacia sostenibilidad.',
        },
      },
      {
        id: 'marketing_only',
        label: 'Solo marketing verde',
        effects: {
          cash: -15000,
          monthlyRevenue: 1000,
          customerSatisfaction: -5,
          description: 'Promocionas iniciativas verdes sin cambios reales (greenwashing).',
        },
      },
    ],
  },
  {
    id: 'employee_wellness',
    title: 'Programa de Bienestar Laboral',
    category: 'challenge',
    difficulty: 'easy',
    description: 'Los empleados reportan estrés y agotamiento. Un programa de bienestar podría mejorar productividad.',
    context: 'Invertir en el bienestar de empleados puede reducir rotación y aumentar moral, pero tiene costos.',
    options: [
      {
        id: 'comprehensive_program',
        label: 'Programa integral de bienestar',
        effects: {
          cash: -50000,
          monthlyExpenses: 4000,
          employeeMorale: 30,
          description: 'Gimnasio, consejería, horarios flexibles y beneficios de salud.',
        },
      },
      {
        id: 'basic_benefits',
        label: 'Beneficios básicos',
        effects: {
          cash: -20000,
          monthlyExpenses: 1500,
          employeeMorale: 15,
          description: 'Seguro médico mejorado y días de salud mental.',
        },
      },
      {
        id: 'skip',
        label: 'Posponer iniciativa',
        effects: {
          employeeMorale: -10,
          description: 'Decides no invertir ahora, algunos empleados están decepcionados.',
        },
      },
    ],
  },
  {
    id: 'product_recall',
    title: 'Retiro de Producto',
    category: 'crisis',
    difficulty: 'hard',
    description: 'Se detectó un defecto en tu producto principal. Debes decidir cómo manejar la situación.',
    context: 'Un defecto podría causar daño a clientes. La respuesta que des afectará tu reputación y finanzas.',
    options: [
      {
        id: 'full_recall',
        label: 'Retiro completo voluntario',
        effects: {
          cash: -200000,
          monthlyRevenue: -8000,
          customerSatisfaction: 20,
          description: 'Retiras todo el producto y ofreces reembolsos completos.',
        },
      },
      {
        id: 'partial_recall',
        label: 'Retiro de lotes afectados',
        effects: {
          cash: -80000,
          monthlyRevenue: -3000,
          customerSatisfaction: 5,
          description: 'Solo retiras los lotes identificados como defectuosos.',
        },
      },
      {
        id: 'fix_quietly',
        label: 'Reparar silenciosamente',
        effects: {
          cash: -30000,
          customerSatisfaction: -25,
          description: 'Intentas arreglar el problema sin publicidad, arriesgando tu reputación.',
        },
      },
    ],
  },
  {
    id: 'strategic_partnership',
    title: 'Alianza Estratégica',
    category: 'opportunity',
    difficulty: 'medium',
    description: 'Una empresa líder te ofrece una alianza estratégica que podría expandir tu alcance.',
    context: 'La alianza te daría acceso a nuevos mercados, pero perderías parte de tu independencia operativa.',
    options: [
      {
        id: 'accept_partnership',
        label: 'Aceptar alianza completa',
        effects: {
          cash: 150000,
          monthlyRevenue: 10000,
          marketShare: 0.25,
          description: 'Formas una alianza fuerte con beneficios mutuos.',
        },
      },
      {
        id: 'limited_partnership',
        label: 'Colaboración limitada',
        effects: {
          cash: 50000,
          monthlyRevenue: 4000,
          marketShare: 0.10,
          description: 'Colaboras en proyectos específicos manteniendo independencia.',
        },
      },
      {
        id: 'decline',
        label: 'Rechazar oferta',
        effects: {
          description: 'Mantienes completa independencia pero pierdes oportunidad de crecimiento.',
        },
      },
    ],
  },
  {
    id: 'remote_work_policy',
    title: 'Política de Trabajo Remoto',
    category: 'challenge',
    difficulty: 'medium',
    description: 'Los empleados piden más flexibilidad para trabajo remoto. Debes definir una política.',
    context: 'El trabajo remoto puede reducir costos de oficina pero también afectar colaboración y cultura.',
    options: [
      {
        id: 'full_remote',
        label: 'Trabajo remoto completo',
        effects: {
          monthlyExpenses: -12000,
          employeeMorale: 20,
          efficiency: -0.10,
          description: 'Cierras la oficina y todos trabajan desde casa.',
        },
      },
      {
        id: 'hybrid_model',
        label: 'Modelo híbrido',
        effects: {
          monthlyExpenses: -6000,
          employeeMorale: 15,
          efficiency: -0.05,
          description: 'Los empleados vienen 2-3 días por semana.',
        },
      },
      {
        id: 'office_only',
        label: 'Solo presencial',
        effects: {
          employeeMorale: -15,
          description: 'Requieres presencia completa en la oficina.',
        },
      },
    ],
  },
];

export const SAMPLE_COMPANIES = [
  {
    name: 'TechStart Inc.',
    type: 'SAS',
    industry: 'technology',
    initialCapital: 150000,
    description: 'Startup tecnológica enfocada en desarrollo de software',
  },
  {
    name: 'GreenMarket S.A.',
    type: 'SA',
    industry: 'retail',
    initialCapital: 200000,
    description: 'Cadena de tiendas de productos orgánicos',
  },
  {
    name: 'ProManufacturing LLC',
    type: 'LLC',
    industry: 'manufacturing',
    initialCapital: 300000,
    description: 'Empresa manufacturera de componentes industriales',
  },
  {
    name: 'ConsultPro Services',
    type: 'SAS',
    industry: 'services',
    initialCapital: 100000,
    description: 'Firma de consultoría empresarial',
  },
  {
    name: 'HealthCare Plus',
    type: 'SA',
    industry: 'healthcare',
    initialCapital: 250000,
    description: 'Clínica de atención médica integral',
  },
];

export const calculateMonthlyPayroll = (employees) => {
  return employees.reduce((total, emp) => total + (emp.salary || 0), 0);
};

export const calculateLoanAmortization = (principal, annualRate, termMonths) => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  const schedule = [];
  let balance = principal;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }
  
  return {
    monthlyPayment,
    totalPayment: monthlyPayment * termMonths,
    totalInterest: (monthlyPayment * termMonths) - principal,
    schedule,
  };
};

export const calculateCompanyKPIs = (company) => {
  if (!company) return null;

  const monthlyPayroll = calculateMonthlyPayroll(company.employees || []);
  const totalDebt = (company.loans || []).reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const activeLoanPayments = (company.loans || [])
    .filter(l => l.status === 'active')
    .reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const lastMonthRevenue = company.revenue?.slice(-1)[0]?.amount || 0;
  const lastMonthExpenses = (company.expenses?.slice(-1)[0]?.amount || 0) + monthlyPayroll + activeLoanPayments;
  
  return {
    cash: company.cash || 0,
    monthlyRevenue: lastMonthRevenue,
    monthlyExpenses: lastMonthExpenses,
    netProfit: lastMonthRevenue - lastMonthExpenses,
    profitMargin: lastMonthRevenue > 0 ? ((lastMonthRevenue - lastMonthExpenses) / lastMonthRevenue) * 100 : 0,
    employeeCount: company.employees?.length || 0,
    totalDebt: totalDebt,
    debtToEquity: company.cash > 0 ? (totalDebt / company.cash) * 100 : 0,
    cashFlow: lastMonthRevenue - lastMonthExpenses,
    monthlyPayroll: monthlyPayroll,
    activeLoanPayments: activeLoanPayments,
  };
};
