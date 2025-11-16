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
