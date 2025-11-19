export const sampleCases = [
  {
    id: 'case_001',
    companyName: 'TechVenture S.A.',
    industry: 'Tecnología',
    year: 2024,
    description: 'Empresa de desarrollo de software con crecimiento acelerado',
    balanceSheet: {
      assets: {
        current: {
          cash: 450000,
          accountsReceivable: 320000,
          inventory: 180000,
          prepaidExpenses: 50000,
        },
        nonCurrent: {
          propertyPlantEquipment: 1200000,
          intangibleAssets: 800000,
          longTermInvestments: 300000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 280000,
          shortTermDebt: 150000,
          accruedExpenses: 120000,
        },
        nonCurrent: {
          longTermDebt: 900000,
          deferredTaxLiabilities: 100000,
        }
      },
      equity: {
        commonStock: 500000,
        retainedEarnings: 1250000,
      }
    },
    incomeStatement: {
      revenue: 2500000,
      costOfGoodsSold: 1000000,
      operatingExpenses: {
        selling: 350000,
        administrative: 280000,
        researchDevelopment: 200000,
      },
      otherIncome: 50000,
      interestExpense: 80000,
      taxExpense: 128000,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 512000,
        depreciation: 150000,
        changeInAccountsReceivable: -80000,
        changeInInventory: -40000,
        changeInAccountsPayable: 60000,
      },
      investing: {
        purchaseOfPPE: -300000,
        purchaseOfInvestments: -100000,
      },
      financing: {
        proceedsFromDebt: 200000,
        dividendsPaid: -150000,
      }
    }
  },
  {
    id: 'case_002',
    companyName: 'Comercial Andina Ltda.',
    industry: 'Comercio Minorista',
    year: 2024,
    description: 'Cadena de tiendas de retail con presencia nacional',
    balanceSheet: {
      assets: {
        current: {
          cash: 320000,
          accountsReceivable: 450000,
          inventory: 680000,
          prepaidExpenses: 40000,
        },
        nonCurrent: {
          propertyPlantEquipment: 2100000,
          intangibleAssets: 200000,
          longTermInvestments: 150000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 520000,
          shortTermDebt: 280000,
          accruedExpenses: 160000,
        },
        nonCurrent: {
          longTermDebt: 1300000,
          deferredTaxLiabilities: 80000,
        }
      },
      equity: {
        commonStock: 600000,
        retainedEarnings: 1000000,
      }
    },
    incomeStatement: {
      revenue: 3200000,
      costOfGoodsSold: 1920000,
      operatingExpenses: {
        selling: 480000,
        administrative: 320000,
        researchDevelopment: 0,
      },
      otherIncome: 30000,
      interestExpense: 120000,
      taxExpense: 78000,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 312000,
        depreciation: 210000,
        changeInAccountsReceivable: -100000,
        changeInInventory: -120000,
        changeInAccountsPayable: 80000,
      },
      investing: {
        purchaseOfPPE: -450000,
        purchaseOfInvestments: -50000,
      },
      financing: {
        proceedsFromDebt: 300000,
        dividendsPaid: -100000,
      }
    }
  },
  {
    id: 'case_003',
    companyName: 'Industrial del Pacífico S.A.',
    industry: 'Manufactura',
    year: 2024,
    description: 'Empresa manufacturera de productos industriales',
    balanceSheet: {
      assets: {
        current: {
          cash: 280000,
          accountsReceivable: 540000,
          inventory: 820000,
          prepaidExpenses: 60000,
        },
        nonCurrent: {
          propertyPlantEquipment: 3500000,
          intangibleAssets: 300000,
          longTermInvestments: 200000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 620000,
          shortTermDebt: 350000,
          accruedExpenses: 180000,
        },
        nonCurrent: {
          longTermDebt: 2200000,
          deferredTaxLiabilities: 150000,
        }
      },
      equity: {
        commonStock: 800000,
        retainedEarnings: 1400000,
      }
    },
    incomeStatement: {
      revenue: 4500000,
      costOfGoodsSold: 2700000,
      operatingExpenses: {
        selling: 540000,
        administrative: 450000,
        researchDevelopment: 180000,
      },
      otherIncome: 40000,
      interestExpense: 200000,
      taxExpense: 94000,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 376000,
        depreciation: 350000,
        changeInAccountsReceivable: -120000,
        changeInInventory: -150000,
        changeInAccountsPayable: 100000,
      },
      investing: {
        purchaseOfPPE: -600000,
        purchaseOfInvestments: -80000,
      },
      financing: {
        proceedsFromDebt: 400000,
        dividendsPaid: -120000,
      }
    }
  },
  {
    id: 'case_004',
    companyName: 'Clínica Salud Total S.A.',
    industry: 'Salud',
    year: 2024,
    description: 'Clínica médica con servicios especializados de atención primaria',
    balanceSheet: {
      assets: {
        current: {
          cash: 380000,
          accountsReceivable: 520000,
          inventory: 240000,
          prepaidExpenses: 70000,
        },
        nonCurrent: {
          propertyPlantEquipment: 2800000,
          intangibleAssets: 450000,
          longTermInvestments: 220000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 340000,
          shortTermDebt: 200000,
          accruedExpenses: 150000,
        },
        nonCurrent: {
          longTermDebt: 1600000,
          deferredTaxLiabilities: 120000,
        }
      },
      equity: {
        commonStock: 700000,
        retainedEarnings: 1520000,
      }
    },
    incomeStatement: {
      revenue: 3800000,
      costOfGoodsSold: 1520000,
      operatingExpenses: {
        selling: 380000,
        administrative: 456000,
        researchDevelopment: 114000,
      },
      otherIncome: 76000,
      interestExpense: 152000,
      taxExpense: 150800,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 603200,
        depreciation: 280000,
        changeInAccountsReceivable: -140000,
        changeInInventory: -60000,
        changeInAccountsPayable: 90000,
      },
      investing: {
        purchaseOfPPE: -520000,
        purchaseOfInvestments: -90000,
      },
      financing: {
        proceedsFromDebt: 350000,
        dividendsPaid: -180000,
      }
    }
  },
  {
    id: 'case_005',
    companyName: 'EduTech Academy',
    industry: 'Educación',
    year: 2024,
    description: 'Instituto educativo especializado en tecnología y programación',
    balanceSheet: {
      assets: {
        current: {
          cash: 290000,
          accountsReceivable: 180000,
          inventory: 60000,
          prepaidExpenses: 40000,
        },
        nonCurrent: {
          propertyPlantEquipment: 1100000,
          intangibleAssets: 550000,
          longTermInvestments: 180000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 140000,
          shortTermDebt: 100000,
          accruedExpenses: 90000,
        },
        nonCurrent: {
          longTermDebt: 650000,
          deferredTaxLiabilities: 70000,
        }
      },
      equity: {
        commonStock: 400000,
        retainedEarnings: 960000,
      }
    },
    incomeStatement: {
      revenue: 1800000,
      costOfGoodsSold: 540000,
      operatingExpenses: {
        selling: 270000,
        administrative: 360000,
        researchDevelopment: 180000,
      },
      otherIncome: 45000,
      interestExpense: 65000,
      taxExpense: 86000,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 344000,
        depreciation: 110000,
        changeInAccountsReceivable: -50000,
        changeInInventory: -15000,
        changeInAccountsPayable: 35000,
      },
      investing: {
        purchaseOfPPE: -220000,
        purchaseOfInvestments: -60000,
      },
      financing: {
        proceedsFromDebt: 150000,
        dividendsPaid: -100000,
      }
    }
  },
  {
    id: 'case_006',
    companyName: 'Banco del Futuro S.A.',
    industry: 'Finanzas',
    year: 2024,
    description: 'Entidad financiera enfocada en microcréditos y servicios digitales',
    balanceSheet: {
      assets: {
        current: {
          cash: 1200000,
          accountsReceivable: 2800000,
          inventory: 0,
          prepaidExpenses: 120000,
        },
        nonCurrent: {
          propertyPlantEquipment: 1500000,
          intangibleAssets: 900000,
          longTermInvestments: 3500000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 400000,
          shortTermDebt: 1800000,
          accruedExpenses: 320000,
        },
        nonCurrent: {
          longTermDebt: 5200000,
          deferredTaxLiabilities: 280000,
        }
      },
      equity: {
        commonStock: 1500000,
        retainedEarnings: 2020000,
      }
    },
    incomeStatement: {
      revenue: 5600000,
      costOfGoodsSold: 1680000,
      operatingExpenses: {
        selling: 840000,
        administrative: 1120000,
        researchDevelopment: 280000,
      },
      otherIncome: 280000,
      interestExpense: 520000,
      taxExpense: 288000,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 1152000,
        depreciation: 150000,
        changeInAccountsReceivable: -380000,
        changeInInventory: 0,
        changeInAccountsPayable: 120000,
      },
      investing: {
        purchaseOfPPE: -350000,
        purchaseOfInvestments: -700000,
      },
      financing: {
        proceedsFromDebt: 800000,
        dividendsPaid: -350000,
      }
    }
  },
  {
    id: 'case_007',
    companyName: 'Constructora Edificar Ltda.',
    industry: 'Construcción',
    year: 2024,
    description: 'Empresa constructora especializada en proyectos residenciales y comerciales',
    balanceSheet: {
      assets: {
        current: {
          cash: 420000,
          accountsReceivable: 780000,
          inventory: 1200000,
          prepaidExpenses: 100000,
        },
        nonCurrent: {
          propertyPlantEquipment: 2600000,
          intangibleAssets: 180000,
          longTermInvestments: 250000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 860000,
          shortTermDebt: 450000,
          accruedExpenses: 240000,
        },
        nonCurrent: {
          longTermDebt: 2100000,
          deferredTaxLiabilities: 180000,
        }
      },
      equity: {
        commonStock: 900000,
        retainedEarnings: 800000,
      }
    },
    incomeStatement: {
      revenue: 5200000,
      costOfGoodsSold: 3380000,
      operatingExpenses: {
        selling: 520000,
        administrative: 624000,
        researchDevelopment: 104000,
      },
      otherIncome: 52000,
      interestExpense: 210000,
      taxExpense: 82800,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 331200,
        depreciation: 260000,
        changeInAccountsReceivable: -180000,
        changeInInventory: -280000,
        changeInAccountsPayable: 160000,
      },
      investing: {
        purchaseOfPPE: -480000,
        purchaseOfInvestments: -100000,
      },
      financing: {
        proceedsFromDebt: 500000,
        dividendsPaid: -140000,
      }
    }
  },
  {
    id: 'case_008',
    companyName: 'Entretenimiento Global S.A.S.',
    industry: 'Entretenimiento',
    year: 2024,
    description: 'Empresa de producción de eventos, conciertos y experiencias digitales',
    balanceSheet: {
      assets: {
        current: {
          cash: 350000,
          accountsReceivable: 420000,
          inventory: 150000,
          prepaidExpenses: 80000,
        },
        nonCurrent: {
          propertyPlantEquipment: 1800000,
          intangibleAssets: 1200000,
          longTermInvestments: 280000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 380000,
          shortTermDebt: 220000,
          accruedExpenses: 160000,
        },
        nonCurrent: {
          longTermDebt: 1400000,
          deferredTaxLiabilities: 140000,
        }
      },
      equity: {
        commonStock: 650000,
        retainedEarnings: 1330000,
      }
    },
    incomeStatement: {
      revenue: 3400000,
      costOfGoodsSold: 1360000,
      operatingExpenses: {
        selling: 680000,
        administrative: 510000,
        researchDevelopment: 340000,
      },
      otherIncome: 102000,
      interestExpense: 140000,
      taxExpense: 97200,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 388800,
        depreciation: 180000,
        changeInAccountsReceivable: -110000,
        changeInInventory: -40000,
        changeInAccountsPayable: 85000,
      },
      investing: {
        purchaseOfPPE: -380000,
        purchaseOfInvestments: -120000,
      },
      financing: {
        proceedsFromDebt: 280000,
        dividendsPaid: -160000,
      }
    }
  }
];

export const calculateRatios = (caseData) => {
  const { balanceSheet, incomeStatement } = caseData;
  
  const currentAssets = Object.values(balanceSheet.assets.current).reduce((a, b) => a + b, 0);
  const currentLiabilities = Object.values(balanceSheet.liabilities.current).reduce((a, b) => a + b, 0);
  const totalAssets = currentAssets + Object.values(balanceSheet.assets.nonCurrent).reduce((a, b) => a + b, 0);
  const totalLiabilities = currentLiabilities + Object.values(balanceSheet.liabilities.nonCurrent).reduce((a, b) => a + b, 0);
  const totalEquity = Object.values(balanceSheet.equity).reduce((a, b) => a + b, 0);
  
  const grossProfit = incomeStatement.revenue - incomeStatement.costOfGoodsSold;
  const operatingExpenses = Object.values(incomeStatement.operatingExpenses).reduce((a, b) => a + b, 0);
  const ebit = grossProfit - operatingExpenses + incomeStatement.otherIncome;
  const netIncome = ebit - incomeStatement.interestExpense - incomeStatement.taxExpense;
  
  const quickAssets = balanceSheet.assets.current.cash + balanceSheet.assets.current.accountsReceivable;
  
  return {
    liquidity: {
      currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
      quickRatio: currentLiabilities > 0 ? quickAssets / currentLiabilities : 0,
      cashRatio: currentLiabilities > 0 ? balanceSheet.assets.current.cash / currentLiabilities : 0,
    },
    profitability: {
      grossMargin: incomeStatement.revenue > 0 ? (grossProfit / incomeStatement.revenue) * 100 : 0,
      operatingMargin: incomeStatement.revenue > 0 ? (ebit / incomeStatement.revenue) * 100 : 0,
      netMargin: incomeStatement.revenue > 0 ? (netIncome / incomeStatement.revenue) * 100 : 0,
      roa: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
      roe: totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0,
    },
    leverage: {
      debtToEquity: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
      debtToAssets: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
      equityMultiplier: totalEquity > 0 ? totalAssets / totalEquity : 0,
      interestCoverage: incomeStatement.interestExpense > 0 ? ebit / incomeStatement.interestExpense : 0,
    },
    efficiency: {
      assetTurnover: totalAssets > 0 ? incomeStatement.revenue / totalAssets : 0,
      inventoryTurnover: balanceSheet.assets.current.inventory > 0 ? incomeStatement.costOfGoodsSold / balanceSheet.assets.current.inventory : 0,
      receivablesTurnover: balanceSheet.assets.current.accountsReceivable > 0 ? incomeStatement.revenue / balanceSheet.assets.current.accountsReceivable : 0,
    }
  };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatRatio = (value, decimals = 2) => {
  return value.toFixed(decimals);
};

export const incompleteCases = [
  {
    id: 'incomplete_001',
    companyName: 'StartUp Innovadora S.A.S.',
    industry: 'Tecnología',
    year: 2024,
    description: 'Startup con datos incompletos - calcula los ratios faltantes',
    difficulty: 'easy',
    missingRatios: ['currentRatio', 'quickRatio'],
    balanceSheet: {
      assets: {
        current: {
          cash: 120000,
          accountsReceivable: 80000,
          inventory: 45000,
          prepaidExpenses: 15000,
        },
        nonCurrent: {
          propertyPlantEquipment: 350000,
          intangibleAssets: 180000,
          longTermInvestments: 70000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 95000,
          shortTermDebt: 50000,
          accruedExpenses: 35000,
        },
        nonCurrent: {
          longTermDebt: 280000,
          deferredTaxLiabilities: 40000,
        }
      },
      equity: {
        commonStock: 200000,
        retainedEarnings: 160000,
      }
    },
    incomeStatement: {
      revenue: 850000,
      costOfGoodsSold: 340000,
      operatingExpenses: {
        selling: 127500,
        administrative: 102000,
        researchDevelopment: 68000,
      },
      otherIncome: 17000,
      interestExpense: 28000,
      taxExpense: 40300,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 161200,
        depreciation: 35000,
        changeInAccountsReceivable: -22000,
        changeInInventory: -13000,
        changeInAccountsPayable: 18000,
      },
      investing: {
        purchaseOfPPE: -85000,
        purchaseOfInvestments: -25000,
      },
      financing: {
        proceedsFromDebt: 70000,
        dividendsPaid: -45000,
      }
    }
  },
  {
    id: 'incomplete_002',
    companyName: 'Comercio Express Ltda.',
    industry: 'Comercio',
    year: 2024,
    description: 'Empresa comercial con ratios de rentabilidad faltantes',
    difficulty: 'medium',
    missingRatios: ['grossMargin', 'netMargin', 'roa', 'roe'],
    balanceSheet: {
      assets: {
        current: {
          cash: 180000,
          accountsReceivable: 220000,
          inventory: 310000,
          prepaidExpenses: 28000,
        },
        nonCurrent: {
          propertyPlantEquipment: 920000,
          intangibleAssets: 145000,
          longTermInvestments: 95000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 240000,
          shortTermDebt: 120000,
          accruedExpenses: 85000,
        },
        nonCurrent: {
          longTermDebt: 580000,
          deferredTaxLiabilities: 65000,
        }
      },
      equity: {
        commonStock: 350000,
        retainedEarnings: 458000,
      }
    },
    incomeStatement: {
      revenue: 1650000,
      costOfGoodsSold: 990000,
      operatingExpenses: {
        selling: 247500,
        administrative: 198000,
        researchDevelopment: 0,
      },
      otherIncome: 24750,
      interestExpense: 58000,
      taxExpense: 36250,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 145000,
        depreciation: 92000,
        changeInAccountsReceivable: -48000,
        changeInInventory: -62000,
        changeInAccountsPayable: 42000,
      },
      investing: {
        purchaseOfPPE: -185000,
        purchaseOfInvestments: -38000,
      },
      financing: {
        proceedsFromDebt: 140000,
        dividendsPaid: -52000,
      }
    }
  },
  {
    id: 'incomplete_003',
    companyName: 'Industrias Modernas S.A.',
    industry: 'Manufactura',
    year: 2024,
    description: 'Manufacturera con ratios de endeudamiento incompletos',
    difficulty: 'hard',
    missingRatios: ['debtToEquity', 'debtToAssets', 'interestCoverage', 'assetTurnover'],
    balanceSheet: {
      assets: {
        current: {
          cash: 265000,
          accountsReceivable: 385000,
          inventory: 520000,
          prepaidExpenses: 48000,
        },
        nonCurrent: {
          propertyPlantEquipment: 1850000,
          intangibleAssets: 280000,
          longTermInvestments: 165000,
        }
      },
      liabilities: {
        current: {
          accountsPayable: 425000,
          shortTermDebt: 195000,
          accruedExpenses: 128000,
        },
        nonCurrent: {
          longTermDebt: 1150000,
          deferredTaxLiabilities: 98000,
        }
      },
      equity: {
        commonStock: 580000,
        retainedEarnings: 937000,
      }
    },
    incomeStatement: {
      revenue: 2850000,
      costOfGoodsSold: 1710000,
      operatingExpenses: {
        selling: 342000,
        administrative: 285000,
        researchDevelopment: 142500,
      },
      otherIncome: 42750,
      interestExpense: 115000,
      taxExpense: 59750,
    },
    cashFlowStatement: {
      operating: {
        netIncome: 239000,
        depreciation: 185000,
        changeInAccountsReceivable: -82000,
        changeInInventory: -96000,
        changeInAccountsPayable: 68000,
      },
      investing: {
        purchaseOfPPE: -325000,
        purchaseOfInvestments: -72000,
      },
      financing: {
        proceedsFromDebt: 245000,
        dividendsPaid: -85000,
      }
    }
  }
];
