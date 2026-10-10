/**
 * US Financial & Legal Compliance Configuration Store
 * Version 2025.1.0
 * 
 * JURISDICTION: United States (Federal & 50 States + DC)
 * All monetary units: USD ($).
 * All dates: MM/DD/YYYY convention.
 * 
 * CORE COMPLIANCE SOURCES:
 * - Internal Revenue Code (IRC) Title 26
 * - IRS Rev. Proc. 2023-34 (Tax Year 2024 Inflation Adjustments)
 * - IRS Rev. Proc. 2024-40 (Tax Year 2025 Inflation Adjustments)
 * - SSA Social Security Administration OASDI Fact Sheets 2024 & 2025
 * - Truth in Lending Act (TILA), Regulation Z (12 CFR Part 1026, Appendix J - Actuarial APR)
 * - Real Estate Escrow Principles (Tax and insurance allocations)
 * - Homeowners Protection Act of 1998 (12 U.S.C. § 4901 - PMI Termination)
 * - Truth in Savings Act (TISA), Regulation DD (12 CFR Part 1030 - APY)
 * - SECURE 2.0 Act of 2022 (P.L. 117-328) / IRC § 402(g), § 414(v)
 */

export interface LegalParam<T> {
  value: T;
  effectiveDate: string; // MM/DD/YYYY
  sourceUrl: string;
  notes?: string;
  needsVerification?: boolean;
}

export type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

export interface TaxBracket {
  rate: number;
  threshold: number;
}

export interface StateTaxConfig {
  stateCode: string;
  stateName: string;
  hasIncomeTax: boolean;
  type: 'none' | 'flat' | 'progressive';
  flatRate?: number;
  standardDeduction: Record<FilingStatus, number>;
  brackets?: Record<FilingStatus, TaxBracket[]>;
  baseSalesTaxRate: number; // State baseline sales tax %
  sourceUrl: string;
  effectiveDate: string;
  isEstimated?: boolean;
  warning?: string;
}

export interface YearTaxConfig {
  year: number;
  effectiveDate: string;
  sourceUrl: string;
  
  // Standard Deductions per Filing Status
  standardDeduction: Record<FilingStatus, LegalParam<number>>;
  
  // Federal Ordinary Income Tax Brackets
  brackets: Record<FilingStatus, LegalParam<TaxBracket[]>>;
  
  // FICA / Social Security (OASDI)
  socialSecurity: {
    taxRate: LegalParam<number>; // 0.062 (6.2%)
    wageBaseCap: LegalParam<number>; // $168,600 (2024), $176,100 (2025)
  };
  
  // Medicare
  medicare: {
    taxRate: LegalParam<number>; // 0.0145 (1.45%)
    additionalTaxRate: LegalParam<number>; // 0.009 (0.9%)
    additionalThreshold: Record<FilingStatus, LegalParam<number>>;
  };
  
  // Section 125 & Retirement Limits
  retirementLimits: {
    elective401kLimit: LegalParam<number>; // IRC § 402(g)
    catchUp401kAge50: LegalParam<number>; // IRC § 414(v)
    catchUp401kSpecialAge60_63: LegalParam<number>; // SECURE 2.0
    iraContributionLimit: LegalParam<number>;
    iraCatchUpAge50: LegalParam<number>;
    hsaSingleLimit: LegalParam<number>;
    hsaFamilyLimit: LegalParam<number>;
    healthcareFsaLimit: LegalParam<number>;
  };
  taxProvisions?: {
    seniorEnhancementDeduction: Record<FilingStatus, LegalParam<number>>;
    tipDeductionLimit: LegalParam<number>;
    overtimeDeductionLimit: LegalParam<number>;
    phaseoutThresholds: Record<FilingStatus, number>;
    saltCap: LegalParam<number>;
  };
}

export interface LendingRegulationConfig {
  regulationZ: {
    method: 'Actuarial' | 'US_Rule';
    toleranceFinanceChargeDollars: LegalParam<number>; // $100 for closed-end credit secured by real property
    sourceUrl: string;
    effectiveDate: string;
  };
  homeownersProtectionAct: {
    borrowerRequestedPmiDropoffLtv: LegalParam<number>; // 0.80 (80% LTV)
    automaticPmiDropoffLtv: LegalParam<number>; // 0.78 (78% LTV)
    sourceUrl: string;
    effectiveDate: string;
  };
  regulationDD: {
    daysInYear: LegalParam<number>; // 365 days
    sourceUrl: string;
    effectiveDate: string;
  };
  fireTrinityStudy: {
    standardSafeWithdrawalRate: LegalParam<number>; // 4.0%
    sourceUrl: string;
    effectiveDate: string;
  };
}

export class CalculationError extends Error {
  readonly code: string;
  constructor(code: string, message: string = code) {
    super(message);
    this.name = "CalculationError";
    this.code = code;
  }
}

/**
 * Supported Individual Income Tax Years.
 * Per statutory policy, WowCalc supports Tax Year 2026 ONLY.
 * Historical years (2024, 2025) and unfinalized future years (2027+) are strictly unsupported.
 */
export const SUPPORTED_TAX_YEARS = [2026] as const;
export const DEFAULT_TAX_YEAR = 2026;
export const HISTORICAL_UNVERIFIED_TAX_YEARS = [2024, 2025] as const;

/**
 * Historical unverified tax configurations (preserved for archival purposes only).
 * These must NOT be used for active calculations.
 */
export const HISTORICAL_UNVERIFIED_TAX_CONFIG_BY_YEAR: Record<number, YearTaxConfig> = {
  2024: {
    year: 2024,
    effectiveDate: '01/01/2024',
    sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf',
    standardDeduction: {
      single: {
        value: 14600,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf'
      },
      mfj: {
        value: 29200,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf'
      },
      mfs: {
        value: 14600,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf'
      },
      hoh: {
        value: 21900,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf'
      }
    },
    brackets: {
      single: {
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 11600, rate: 0.12 },
          { threshold: 47150, rate: 0.22 },
          { threshold: 100525, rate: 0.24 },
          { threshold: 191950, rate: 0.32 },
          { threshold: 243725, rate: 0.35 },
          { threshold: 609350, rate: 0.37 },
        ]
      },
      mfj: {
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 23200, rate: 0.12 },
          { threshold: 94300, rate: 0.22 },
          { threshold: 201050, rate: 0.24 },
          { threshold: 383900, rate: 0.32 },
          { threshold: 487450, rate: 0.35 },
          { threshold: 731200, rate: 0.37 },
        ]
      },
      mfs: {
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 11600, rate: 0.12 },
          { threshold: 47150, rate: 0.22 },
          { threshold: 100525, rate: 0.24 },
          { threshold: 191950, rate: 0.32 },
          { threshold: 243725, rate: 0.35 },
          { threshold: 365600, rate: 0.37 },
        ]
      },
      hoh: {
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 16550, rate: 0.12 },
          { threshold: 63100, rate: 0.22 },
          { threshold: 100500, rate: 0.24 },
          { threshold: 191950, rate: 0.32 },
          { threshold: 243700, rate: 0.35 },
          { threshold: 609350, rate: 0.37 },
        ]
      }
    },
    socialSecurity: {
      taxRate: {
        value: 0.062,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.ssa.gov/news/press/factsheets/colafacts2024.pdf'
      },
      wageBaseCap: {
        value: 168600,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.ssa.gov/news/press/factsheets/colafacts2024.pdf'
      }
    },
    medicare: {
      taxRate: {
        value: 0.0145,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/taxtopics/tc751'
      },
      additionalTaxRate: {
        value: 0.009,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
      },
      additionalThreshold: {
        single: {
          value: 200000,
          effectiveDate: '01/01/2024',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfj: {
          value: 250000,
          effectiveDate: '01/01/2024',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfs: {
          value: 125000,
          effectiveDate: '01/01/2024',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        hoh: {
          value: 200000,
          effectiveDate: '01/01/2024',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        }
      }
    },
    retirementLimits: {
      elective401kLimit: {
        value: 23000,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-23-75.pdf'
      },
      catchUp401kAge50: {
        value: 7500,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-23-75.pdf'
      },
      catchUp401kSpecialAge60_63: {
        value: 7500, // Prior to 2025 effective date
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-23-75.pdf'
      },
      iraContributionLimit: {
        value: 7000,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-23-75.pdf'
      },
      iraCatchUpAge50: {
        value: 1000,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits'
      },
      hsaSingleLimit: {
        value: 4150,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-23.pdf'
      },
      hsaFamilyLimit: {
        value: 8300,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-23.pdf'
      },
      healthcareFsaLimit: {
        value: 3200,
        effectiveDate: '01/01/2024',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-23-34.pdf'
      }
    }
  },
  2025: {
    year: 2025,
    effectiveDate: '01/01/2025',
    sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
    standardDeduction: {
      single: {
        value: 15750,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf'
      },
      mfj: {
        value: 31500,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf'
      },
      mfs: {
        value: 15750,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf'
      },
      hoh: {
        value: 23625,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf'
      }
    },
    brackets: {
      single: {
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 11925, rate: 0.12 },
          { threshold: 48475, rate: 0.22 },
          { threshold: 103350, rate: 0.24 },
          { threshold: 197300, rate: 0.32 },
          { threshold: 250525, rate: 0.35 },
          { threshold: 626350, rate: 0.37 },
        ]
      },
      mfj: {
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 23850, rate: 0.12 },
          { threshold: 96950, rate: 0.22 },
          { threshold: 206700, rate: 0.24 },
          { threshold: 394600, rate: 0.32 },
          { threshold: 501050, rate: 0.35 },
          { threshold: 751600, rate: 0.37 },
        ]
      },
      mfs: {
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 11925, rate: 0.12 },
          { threshold: 48475, rate: 0.22 },
          { threshold: 103350, rate: 0.24 },
          { threshold: 197300, rate: 0.32 },
          { threshold: 250525, rate: 0.35 },
          { threshold: 375800, rate: 0.37 },
        ]
      },
      hoh: {
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 17000, rate: 0.12 },
          { threshold: 64850, rate: 0.22 },
          { threshold: 103350, rate: 0.24 },
          { threshold: 197300, rate: 0.32 },
          { threshold: 250500, rate: 0.35 },
          { threshold: 626350, rate: 0.37 },
        ]
      }
    },
    socialSecurity: {
      taxRate: {
        value: 0.062,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf'
      },
      wageBaseCap: {
        value: 176100,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf'
      }
    },
    medicare: {
      taxRate: {
        value: 0.0145,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/taxtopics/tc751'
      },
      additionalTaxRate: {
        value: 0.009,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
      },
      additionalThreshold: {
        single: {
          value: 200000,
          effectiveDate: '01/01/2025',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfj: {
          value: 250000,
          effectiveDate: '01/01/2025',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfs: {
          value: 125000,
          effectiveDate: '01/01/2025',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        hoh: {
          value: 200000,
          effectiveDate: '01/01/2025',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        }
      }
    },
    retirementLimits: {
      elective401kLimit: {
        value: 23500,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf'
      },
      catchUp401kAge50: {
        value: 7500,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf'
      },
      catchUp401kSpecialAge60_63: {
        value: 11250, // SECURE 2.0 increased catch-up for age 60, 61, 62, 63
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf'
      },
      iraContributionLimit: {
        value: 7000,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf'
      },
      iraCatchUpAge50: {
        value: 1000,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf'
      },
      hsaSingleLimit: {
        value: 4300,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-25.pdf'
      },
      hsaFamilyLimit: {
        value: 8550,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-25.pdf'
      },
      healthcareFsaLimit: {
        value: 3300,
        effectiveDate: '01/01/2025',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf'
      }
    }
  }
};

/**
 * Verified Supported Tax Configuration (Tax Year 2026 Only).
 * Revenue Procedure 2025-32 & IRS Notice 2025-67.
 */
export const US_TAX_CONFIG_BY_YEAR: Record<number, YearTaxConfig> = {
  2026: {
    year: 2026,
    effectiveDate: '01/01/2026',
    sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
    standardDeduction: {
      single: {
        value: 16100,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      },
      mfj: {
        value: 32200,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      },
      mfs: {
        value: 16100,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      },
      hoh: {
        value: 24150,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      }
    },
    brackets: {
      single: {
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false,
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 12400, rate: 0.12 },
          { threshold: 50400, rate: 0.22 },
          { threshold: 105700, rate: 0.24 },
          { threshold: 201775, rate: 0.32 },
          { threshold: 256225, rate: 0.35 },
          { threshold: 640600, rate: 0.37 },
        ]
      },
      mfj: {
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false,
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 24800, rate: 0.12 },
          { threshold: 100800, rate: 0.22 },
          { threshold: 211400, rate: 0.24 },
          { threshold: 403550, rate: 0.32 },
          { threshold: 512450, rate: 0.35 },
          { threshold: 768700, rate: 0.37 },
        ]
      },
      mfs: {
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false,
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 12400, rate: 0.12 },
          { threshold: 50400, rate: 0.22 },
          { threshold: 105700, rate: 0.24 },
          { threshold: 201775, rate: 0.32 },
          { threshold: 256225, rate: 0.35 },
          { threshold: 384350, rate: 0.37 },
        ]
      },
      hoh: {
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false,
        value: [
          { threshold: 0, rate: 0.10 },
          { threshold: 17700, rate: 0.12 },
          { threshold: 67450, rate: 0.22 },
          { threshold: 105700, rate: 0.24 },
          { threshold: 201750, rate: 0.32 },
          { threshold: 256200, rate: 0.35 },
          { threshold: 640600, rate: 0.37 },
        ]
      }
    },
    socialSecurity: {
      taxRate: {
        value: 0.062,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.ssa.gov/oact/cola/cbb.html'
      },
      wageBaseCap: {
        value: 184500,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.ssa.gov/oact/cola/cbb.html',
        needsVerification: false
      }
    },
    medicare: {
      taxRate: {
        value: 0.0145,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/taxtopics/tc751'
      },
      additionalTaxRate: {
        value: 0.009,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
      },
      additionalThreshold: {
        single: {
          value: 200000,
          effectiveDate: '01/01/2026',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfj: {
          value: 250000,
          effectiveDate: '01/01/2026',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        mfs: {
          value: 125000,
          effectiveDate: '01/01/2026',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        },
        hoh: {
          value: 200000,
          effectiveDate: '01/01/2026',
          sourceUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax'
        }
      }
    },
    retirementLimits: {
      elective401kLimit: {
        value: 24500,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf',
        needsVerification: false
      },
      catchUp401kAge50: {
        value: 8000,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf',
        needsVerification: false
      },
      catchUp401kSpecialAge60_63: {
        value: 11250,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf',
        needsVerification: false
      },
      iraContributionLimit: {
        value: 7500,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf',
        needsVerification: false
      },
      iraCatchUpAge50: {
        value: 1100,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-67.pdf',
        needsVerification: false
      },
      hsaSingleLimit: {
        value: 4400,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      },
      hsaFamilyLimit: {
        value: 8750,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        needsVerification: false
      },
      healthcareFsaLimit: {
        value: 3400,
        effectiveDate: '01/01/2026',
        sourceUrl: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
        notes: 'IRS Revenue Procedure 2025-32, § 3.18 - IRC § 125(i) Health FSA limit ($3,400)',
        needsVerification: false
      }
    },
    taxProvisions: {
      seniorEnhancementDeduction: {
        single: { value: 6000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' },
        mfj: { value: 12000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' },
        mfs: { value: 6000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' },
        hoh: { value: 6000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' }
      },
      tipDeductionLimit: { value: 10000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' },
      overtimeDeductionLimit: { value: 10000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' },
      phaseoutThresholds: {
        single: 75000,
        mfj: 150000,
        mfs: 75000,
        hoh: 112500
      },
      saltCap: { value: 40000, effectiveDate: '01/01/2026', sourceUrl: 'https://www.irs.gov/' }
    }
  }
};

/* ============================================================================
 * LENDING & BANKING REGULATIONS
 * ========================================================================== */

export const US_LENDING_CONFIG: LendingRegulationConfig = {
  regulationZ: {
    method: 'Actuarial',
    toleranceFinanceChargeDollars: {
      value: 100,
      effectiveDate: '01/01/2024',
      sourceUrl: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/22/'
    },
    sourceUrl: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/appendix-j/',
    effectiveDate: '10/01/2023'
  },
  homeownersProtectionAct: {
    borrowerRequestedPmiDropoffLtv: {
      value: 0.80, // 80% LTV
      effectiveDate: '07/29/1999',
      sourceUrl: 'https://www.fdic.gov/resources/supervision-and-examinations/consumer-compliance-examination-manual/documents/5/v-5-1.pdf'
    },
    automaticPmiDropoffLtv: {
      value: 0.78, // 78% LTV
      effectiveDate: '07/29/1999',
      sourceUrl: 'https://www.fdic.gov/resources/supervision-and-examinations/consumer-compliance-examination-manual/documents/5/v-5-1.pdf'
    },
    sourceUrl: 'https://www.consumerfinance.gov/compliance/compliance-resources/truth-in-lending-act-resources/',
    effectiveDate: '07/29/1999'
  },
  regulationDD: {
    daysInYear: {
      value: 365,
      effectiveDate: '01/01/1993',
      sourceUrl: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/appendix-a/'
    },
    sourceUrl: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/',
    effectiveDate: '01/01/1993'
  },
  fireTrinityStudy: {
    standardSafeWithdrawalRate: {
      value: 4.0,
      effectiveDate: '01/01/1998',
      sourceUrl: 'https://www.aaii.com/journal/199802/feature.pdf'
    },
    sourceUrl: 'https://www.aaii.com/journal/199802/feature.pdf',
    effectiveDate: '01/01/1998'
  }
};

/* ============================================================================
 * STATE-SPECIFIC TAX CONFIGURATIONS (ALL 50 STATES + DC)
 * ========================================================================== */

export const US_STATE_TAX_CONFIGS: Record<string, StateTaxConfig> = {
  // --- Zero State Income Tax Jurisdictions ---
  AK: {
    stateCode: 'AK',
    stateName: 'Alaska',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://tax.alaska.gov/',
    effectiveDate: '01/01/2026'
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://floridarevenue.com/taxes/taxesfees/Pages/sales_tax.aspx',
    effectiveDate: '01/01/2026'
  },
  NV: {
    stateCode: 'NV',
    stateName: 'Nevada',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 6.85,
    sourceUrl: 'https://tax.nv.gov/',
    effectiveDate: '01/01/2026'
  },
  NH: {
    stateCode: 'NH',
    stateName: 'New Hampshire',
    hasIncomeTax: false, // Phased out wage income tax; interest & dividends only
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://www.revenue.nh.gov/',
    effectiveDate: '01/01/2026'
  },
  SD: {
    stateCode: 'SD',
    stateName: 'South Dakota',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 4.2,
    sourceUrl: 'https://dor.sd.gov/',
    effectiveDate: '01/01/2026'
  },
  TN: {
    stateCode: 'TN',
    stateName: 'Tennessee',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 7.0,
    sourceUrl: 'https://www.tn.gov/revenue/taxes/sales-and-use-tax.html',
    effectiveDate: '01/01/2026'
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 6.25,
    sourceUrl: 'https://comptroller.texas.gov/taxes/sales/',
    effectiveDate: '01/01/2026'
  },
  WA: {
    stateCode: 'WA',
    stateName: 'Washington',
    hasIncomeTax: false, // No personal earned wage income tax (7% excise on high LTCG above $262k)
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 6.5,
    sourceUrl: 'https://dor.wa.gov/',
    effectiveDate: '01/01/2026'
  },
  WY: {
    stateCode: 'WY',
    stateName: 'Wyoming',
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 4.0,
    sourceUrl: 'https://revenue.wyo.gov/',
    effectiveDate: '01/01/2026'
  },

  // --- Flat Tax States (Verified 2026) ---
  CO: {
    stateCode: 'CO',
    stateName: 'Colorado',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.044, // 4.40% (Colo. Rev. Stat. § 39-22-104)
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 }, // Conforms to federal
    baseSalesTaxRate: 2.9,
    sourceUrl: 'https://tax.colorado.gov/individual-income-tax-guide',
    effectiveDate: '01/01/2026'
  },
  GA: {
    stateCode: 'GA',
    stateName: 'Georgia',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0499, // 4.99% flat rate for 2026 (HB 463 / O.C.G.A. § 48-7-20)
    standardDeduction: { single: 15000, mfj: 30000, mfs: 15000, hoh: 15000 },
    baseSalesTaxRate: 4.0,
    sourceUrl: 'https://dor.georgia.gov/taxes/individual-taxes',
    effectiveDate: '01/01/2026'
  },
  IL: {
    stateCode: 'IL',
    stateName: 'Illinois',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0495, // 4.95% flat rate (35 ILCS 5/201)
    standardDeduction: { single: 2925, mfj: 5850, mfs: 2925, hoh: 2925 }, // Basic personal exemption per Illinois Department of Revenue (35 ILCS 5/204)
    baseSalesTaxRate: 6.25,
    sourceUrl: 'https://tax.illinois.gov/research/taxrates/income.html',
    effectiveDate: '01/01/2026'
  },
  IN: {
    stateCode: 'IN',
    stateName: 'Indiana',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0295, // 2.95% effective Jan 1, 2026 (HEA 1001 / Ind. Code § 6-3-2-1)
    standardDeduction: { single: 1000, mfj: 2000, mfs: 1000, hoh: 1000 }, // Personal exemptions classified per Indiana Department of Revenue (Ind. Code § 6-3-2-1.5)
    baseSalesTaxRate: 7.0,
    sourceUrl: 'https://www.in.gov/dor/individual-income-taxes/',
    effectiveDate: '01/01/2026'
  },
  MI: {
    stateCode: 'MI',
    stateName: 'Michigan',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0425, // 4.25% (MCL § 206.51)
    standardDeduction: { single: 5600, mfj: 11200, mfs: 5600, hoh: 5600 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://www.michigan.gov/taxes',
    effectiveDate: '01/01/2026'
  },
  NC: {
    stateCode: 'NC',
    stateName: 'North Carolina',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0399, // 3.99% effective Jan 1, 2026 (SB 105 / N.C. Gen. Stat. § 105-153.7)
    standardDeduction: { single: 12750, mfj: 25500, mfs: 12750, hoh: 19125 },
    baseSalesTaxRate: 4.75,
    sourceUrl: 'https://www.ncdor.gov/taxes-forms/individual-income-tax',
    effectiveDate: '01/01/2026'
  },
  PA: {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0307, // 3.07% (72 P.S. § 7302)
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 }, // PA has no standard deduction
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://www.revenue.pa.gov/FormsandPublications/FormsforIndividuals/PIT/Pages/default.aspx',
    effectiveDate: '01/01/2026'
  },
  UT: {
    stateCode: 'UT',
    stateName: 'Utah',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.0445, // 4.45% effective Jan 1, 2026 (SB 60 / Utah Code Ann. § 59-10-104)
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 }, // Conforms to federal credit basis
    baseSalesTaxRate: 6.1,
    sourceUrl: 'https://tax.utah.gov/',
    effectiveDate: '01/01/2026'
  },

  // --- Progressive Income Tax States ---
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 5706, mfj: 11412, mfs: 5706, hoh: 11412 }, // Updated to 2026 FTB values (Cal. Rev. & Tax. Code § 17053.5)
    baseSalesTaxRate: 7.25,
    sourceUrl: 'https://www.ftb.ca.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.01 },
        { threshold: 10756, rate: 0.02 },
        { threshold: 25499, rate: 0.04 },
        { threshold: 40245, rate: 0.06 },
        { threshold: 55866, rate: 0.08 },
        { threshold: 70606, rate: 0.093 },
        { threshold: 360659, rate: 0.103 },
        { threshold: 432787, rate: 0.113 },
        { threshold: 721314, rate: 0.123 },
      ],
      mfj: [
        { threshold: 0, rate: 0.01 },
        { threshold: 21512, rate: 0.02 },
        { threshold: 50998, rate: 0.04 },
        { threshold: 80490, rate: 0.06 },
        { threshold: 111732, rate: 0.08 },
        { threshold: 141212, rate: 0.093 },
        { threshold: 721318, rate: 0.103 },
        { threshold: 865574, rate: 0.113 },
        { threshold: 1442628, rate: 0.123 },
      ],
      mfs: [
        { threshold: 0, rate: 0.01 },
        { threshold: 10756, rate: 0.02 },
        { threshold: 25499, rate: 0.04 },
        { threshold: 40245, rate: 0.06 },
        { threshold: 55866, rate: 0.08 },
        { threshold: 70606, rate: 0.093 },
        { threshold: 360659, rate: 0.103 },
        { threshold: 432787, rate: 0.113 },
        { threshold: 721314, rate: 0.123 },
      ],
      hoh: [
        { threshold: 0, rate: 0.01 },
        { threshold: 21512, rate: 0.02 },
        { threshold: 36255, rate: 0.04 },
        { threshold: 50999, rate: 0.06 },
        { threshold: 66620, rate: 0.08 },
        { threshold: 81362, rate: 0.093 },
        { threshold: 415392, rate: 0.103 },
        { threshold: 498471, rate: 0.113 },
        { threshold: 830784, rate: 0.123 },
      ]
    }
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 8000, mfj: 16050, mfs: 8000, hoh: 11200 },
    baseSalesTaxRate: 4.0,
    sourceUrl: 'https://www.tax.ny.gov/pit/file/tax_tables.htm',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.04 },
        { threshold: 8500, rate: 0.045 },
        { threshold: 11700, rate: 0.0525 },
        { threshold: 13900, rate: 0.055 },
        { threshold: 80650, rate: 0.06 },
        { threshold: 215400, rate: 0.0685 },
        { threshold: 1077550, rate: 0.0965 },
        { threshold: 5000000, rate: 0.103 },
        { threshold: 25000000, rate: 0.109 },
      ],
      mfj: [
        { threshold: 0, rate: 0.04 },
        { threshold: 17150, rate: 0.045 },
        { threshold: 23600, rate: 0.0525 },
        { threshold: 27900, rate: 0.055 },
        { threshold: 161550, rate: 0.06 },
        { threshold: 323200, rate: 0.0685 },
        { threshold: 2155350, rate: 0.0965 },
        { threshold: 5000000, rate: 0.103 },
        { threshold: 25000000, rate: 0.109 },
      ],
      mfs: [
        { threshold: 0, rate: 0.04 },
        { threshold: 8500, rate: 0.045 },
        { threshold: 11700, rate: 0.0525 },
        { threshold: 13900, rate: 0.055 },
        { threshold: 80650, rate: 0.06 },
        { threshold: 161600, rate: 0.0685 },
        { threshold: 1077550, rate: 0.0965 },
        { threshold: 5000000, rate: 0.103 },
        { threshold: 25000000, rate: 0.109 },
      ],
      hoh: [
        { threshold: 0, rate: 0.04 },
        { threshold: 12800, rate: 0.045 },
        { threshold: 17650, rate: 0.0525 },
        { threshold: 20900, rate: 0.055 },
        { threshold: 107750, rate: 0.06 },
        { threshold: 269300, rate: 0.0685 },
        { threshold: 1616450, rate: 0.0965 },
        { threshold: 5000000, rate: 0.103 },
        { threshold: 25000000, rate: 0.109 },
      ]
    }
  },
  NJ: {
    stateCode: 'NJ',
    stateName: 'New Jersey',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 1000, mfj: 2000, mfs: 1000, hoh: 1000 }, // NJ personal exemptions
    baseSalesTaxRate: 6.625,
    sourceUrl: 'https://www.state.nj.us/treasury/taxation/rate-archive.shtml',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.014 },
        { threshold: 20000, rate: 0.0175 },
        { threshold: 35000, rate: 0.035 },
        { threshold: 40000, rate: 0.05525 },
        { threshold: 75000, rate: 0.0637 },
        { threshold: 500000, rate: 0.0897 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      mfj: [
        { threshold: 0, rate: 0.014 },
        { threshold: 20000, rate: 0.0175 },
        { threshold: 50000, rate: 0.0245 },
        { threshold: 70000, rate: 0.035 },
        { threshold: 80000, rate: 0.05525 },
        { threshold: 150000, rate: 0.0637 },
        { threshold: 500000, rate: 0.0897 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      mfs: [
        { threshold: 0, rate: 0.014 },
        { threshold: 20000, rate: 0.0175 },
        { threshold: 35000, rate: 0.035 },
        { threshold: 40000, rate: 0.05525 },
        { threshold: 75000, rate: 0.0637 },
        { threshold: 500000, rate: 0.0897 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      hoh: [
        { threshold: 0, rate: 0.014 },
        { threshold: 20000, rate: 0.0175 },
        { threshold: 50000, rate: 0.0245 },
        { threshold: 70000, rate: 0.035 },
        { threshold: 80000, rate: 0.05525 },
        { threshold: 150000, rate: 0.0637 },
        { threshold: 500000, rate: 0.0897 },
        { threshold: 1000000, rate: 0.1075 }
      ]
    }
  },

  VA: {
    stateCode: 'VA',
    stateName: 'Virginia',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 8500, mfj: 17000, mfs: 8500, hoh: 8500 },
    baseSalesTaxRate: 5.3,
    sourceUrl: 'https://www.tax.virginia.gov/individual-income-tax',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.02 },
        { threshold: 3000, rate: 0.03 },
        { threshold: 5000, rate: 0.05 },
        { threshold: 17000, rate: 0.0575 }
      ],
      mfj: [
        { threshold: 0, rate: 0.02 },
        { threshold: 3000, rate: 0.03 },
        { threshold: 5000, rate: 0.05 },
        { threshold: 17000, rate: 0.0575 }
      ],
      mfs: [
        { threshold: 0, rate: 0.02 },
        { threshold: 3000, rate: 0.03 },
        { threshold: 5000, rate: 0.05 },
        { threshold: 17000, rate: 0.0575 }
      ],
      hoh: [
        { threshold: 0, rate: 0.02 },
        { threshold: 3000, rate: 0.03 },
        { threshold: 5000, rate: 0.05 },
        { threshold: 17000, rate: 0.0575 }
      ]
    }
  },
  MA: {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    hasIncomeTax: true,
    type: 'progressive', // 5% flat base + 4% surtax on taxable income over $1,083,150 per Massachusetts Department of Revenue (Fair Share Amendment / M.G.L. c. 62, § 4(B))
    standardDeduction: { single: 4400, mfj: 8800, mfs: 4400, hoh: 6800 },
    baseSalesTaxRate: 6.25,
    sourceUrl: 'https://www.mass.gov/info-details/massachusetts-personal-income-tax-rates',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.05 },
        { threshold: 1083150, rate: 0.09 }
      ],
      mfj: [
        { threshold: 0, rate: 0.05 },
        { threshold: 1083150, rate: 0.09 }
      ],
      mfs: [
        { threshold: 0, rate: 0.05 },
        { threshold: 1083150, rate: 0.09 }
      ],
      hoh: [
        { threshold: 0, rate: 0.05 },
        { threshold: 1083150, rate: 0.09 }
      ]
    }
  },
  OH: {
    stateCode: 'OH',
    stateName: 'Ohio',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 2400, mfj: 4800, mfs: 2400, hoh: 2400 },
    baseSalesTaxRate: 5.75,
    sourceUrl: 'https://tax.ohio.gov/individual',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 26050, rate: 0.0275 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 26050, rate: 0.0275 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 26050, rate: 0.0275 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 26050, rate: 0.0275 }
      ]
    }
  },
  AZ: {
    stateCode: 'AZ',
    stateName: 'Arizona',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.025, // 2.5% flat tax (A.R.S. § 43-1011)
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 }, // Conforms to federal
    baseSalesTaxRate: 5.6,
    sourceUrl: 'https://azdor.gov/individual-income-tax-information',
    effectiveDate: '01/01/2026'
  },
  DC: {
    stateCode: 'DC',
    stateName: 'District of Columbia',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 }, // Conforms to federal
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://otr.cfo.dc.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.04 },
        { threshold: 10000, rate: 0.06 },
        { threshold: 40000, rate: 0.065 },
        { threshold: 60000, rate: 0.085 },
        { threshold: 250000, rate: 0.0925 },
        { threshold: 500000, rate: 0.0975 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      mfj: [
        { threshold: 0, rate: 0.04 },
        { threshold: 10000, rate: 0.06 },
        { threshold: 40000, rate: 0.065 },
        { threshold: 60000, rate: 0.085 },
        { threshold: 250000, rate: 0.0925 },
        { threshold: 500000, rate: 0.0975 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      mfs: [
        { threshold: 0, rate: 0.04 },
        { threshold: 10000, rate: 0.06 },
        { threshold: 40000, rate: 0.065 },
        { threshold: 60000, rate: 0.085 },
        { threshold: 250000, rate: 0.0925 },
        { threshold: 500000, rate: 0.0975 },
        { threshold: 1000000, rate: 0.1075 }
      ],
      hoh: [
        { threshold: 0, rate: 0.04 },
        { threshold: 10000, rate: 0.06 },
        { threshold: 40000, rate: 0.065 },
        { threshold: 60000, rate: 0.085 },
        { threshold: 250000, rate: 0.0925 },
        { threshold: 500000, rate: 0.0975 },
        { threshold: 1000000, rate: 0.1075 }
      ]
    }
  },
  // --- Additional Verified State Tax Configs ---
  AL: {
    stateCode: 'AL',
    stateName: 'Alabama',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 3000, mfj: 8500, mfs: 3000, hoh: 5200 },
    baseSalesTaxRate: 4.0,
    sourceUrl: 'https://revenue.alabama.gov/individual-corporate/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.02 },
        { threshold: 500, rate: 0.04 },
        { threshold: 3000, rate: 0.05 }
      ],
      mfj: [
        { threshold: 0, rate: 0.02 },
        { threshold: 1000, rate: 0.04 },
        { threshold: 6000, rate: 0.05 }
      ],
      mfs: [
        { threshold: 0, rate: 0.02 },
        { threshold: 500, rate: 0.04 },
        { threshold: 3000, rate: 0.05 }
      ],
      hoh: [
        { threshold: 0, rate: 0.02 },
        { threshold: 500, rate: 0.04 },
        { threshold: 3000, rate: 0.05 }
      ]
    }
  },
  AR: {
    stateCode: 'AR',
    stateName: 'Arkansas',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 2470, mfj: 4940, mfs: 2470, hoh: 2470 },
    baseSalesTaxRate: 6.5,
    sourceUrl: 'https://www.dfa.arkansas.gov/income-tax/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 5500, rate: 0.02 },
        { threshold: 10900, rate: 0.03 },
        { threshold: 15400, rate: 0.034 },
        { threshold: 25700, rate: 0.037 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 5500, rate: 0.02 },
        { threshold: 10900, rate: 0.03 },
        { threshold: 15400, rate: 0.034 },
        { threshold: 25700, rate: 0.037 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 5500, rate: 0.02 },
        { threshold: 10900, rate: 0.03 },
        { threshold: 15400, rate: 0.034 },
        { threshold: 25700, rate: 0.037 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 5500, rate: 0.02 },
        { threshold: 10900, rate: 0.03 },
        { threshold: 15400, rate: 0.034 },
        { threshold: 25700, rate: 0.037 }
      ]
    }
  },
  CT: {
    stateCode: 'CT',
    stateName: 'Connecticut',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 15000, mfj: 24000, mfs: 0, hoh: 19000 },
    baseSalesTaxRate: 6.35,
    sourceUrl: 'https://portal.ct.gov/drs',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.02 },
        { threshold: 10000, rate: 0.045 },
        { threshold: 50000, rate: 0.055 },
        { threshold: 100000, rate: 0.06 },
        { threshold: 200000, rate: 0.065 },
        { threshold: 250000, rate: 0.069 },
        { threshold: 500000, rate: 0.0699 }
      ],
      mfj: [
        { threshold: 0, rate: 0.02 },
        { threshold: 20000, rate: 0.045 },
        { threshold: 100000, rate: 0.055 },
        { threshold: 200000, rate: 0.06 },
        { threshold: 400000, rate: 0.065 },
        { threshold: 500000, rate: 0.069 },
        { threshold: 1000000, rate: 0.0699 }
      ],
      mfs: [
        { threshold: 0, rate: 0.02 },
        { threshold: 10000, rate: 0.045 },
        { threshold: 50000, rate: 0.055 },
        { threshold: 100000, rate: 0.06 },
        { threshold: 200000, rate: 0.065 },
        { threshold: 250000, rate: 0.069 },
        { threshold: 500000, rate: 0.0699 }
      ],
      hoh: [
        { threshold: 0, rate: 0.02 },
        { threshold: 16000, rate: 0.045 },
        { threshold: 80000, rate: 0.055 },
        { threshold: 160000, rate: 0.06 },
        { threshold: 320000, rate: 0.065 },
        { threshold: 400000, rate: 0.069 },
        { threshold: 800000, rate: 0.0699 }
      ]
    }
  },
  DE: {
    stateCode: 'DE',
    stateName: 'Delaware',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 3250, mfj: 6500, mfs: 3250, hoh: 3250 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://revenue.delaware.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 2000, rate: 0.022 },
        { threshold: 5000, rate: 0.039 },
        { threshold: 10000, rate: 0.048 },
        { threshold: 20000, rate: 0.052 },
        { threshold: 25000, rate: 0.0555 },
        { threshold: 60000, rate: 0.066 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 2000, rate: 0.022 },
        { threshold: 5000, rate: 0.039 },
        { threshold: 10000, rate: 0.048 },
        { threshold: 20000, rate: 0.052 },
        { threshold: 25000, rate: 0.0555 },
        { threshold: 60000, rate: 0.066 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 2000, rate: 0.022 },
        { threshold: 5000, rate: 0.039 },
        { threshold: 10000, rate: 0.048 },
        { threshold: 20000, rate: 0.052 },
        { threshold: 25000, rate: 0.0555 },
        { threshold: 60000, rate: 0.066 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 2000, rate: 0.022 },
        { threshold: 5000, rate: 0.039 },
        { threshold: 10000, rate: 0.048 },
        { threshold: 20000, rate: 0.052 },
        { threshold: 25000, rate: 0.0555 },
        { threshold: 60000, rate: 0.066 }
      ]
    }
  },
  HI: {
    stateCode: 'HI',
    stateName: 'Hawaii',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 8000, mfj: 16000, mfs: 8000, hoh: 12000 }, // Standard deduction / HOH deduction per Hawaii Department of Taxation (Haw. Rev. Stat. § 235-51)
    baseSalesTaxRate: 4.0,
    sourceUrl: 'https://tax.hawaii.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.014 },
        { threshold: 9600, rate: 0.032 },
        { threshold: 14400, rate: 0.055 },
        { threshold: 19200, rate: 0.064 },
        { threshold: 24000, rate: 0.068 },
        { threshold: 36000, rate: 0.072 },
        { threshold: 48000, rate: 0.076 },
        { threshold: 125000, rate: 0.079 },
        { threshold: 175000, rate: 0.0825 },
        { threshold: 225000, rate: 0.09 },
        { threshold: 275000, rate: 0.10 },
        { threshold: 325000, rate: 0.11 }
      ],
      mfj: [
        { threshold: 0, rate: 0.014 },
        { threshold: 19200, rate: 0.032 },
        { threshold: 28800, rate: 0.055 },
        { threshold: 38400, rate: 0.064 },
        { threshold: 48000, rate: 0.068 },
        { threshold: 72000, rate: 0.072 },
        { threshold: 96000, rate: 0.076 },
        { threshold: 250000, rate: 0.079 },
        { threshold: 350000, rate: 0.0825 },
        { threshold: 450000, rate: 0.09 },
        { threshold: 550000, rate: 0.10 },
        { threshold: 650000, rate: 0.11 }
      ],
      mfs: [
        { threshold: 0, rate: 0.014 },
        { threshold: 9600, rate: 0.032 },
        { threshold: 14400, rate: 0.055 },
        { threshold: 19200, rate: 0.064 },
        { threshold: 24000, rate: 0.068 },
        { threshold: 36000, rate: 0.072 },
        { threshold: 48000, rate: 0.076 },
        { threshold: 125000, rate: 0.079 },
        { threshold: 175000, rate: 0.0825 },
        { threshold: 225000, rate: 0.09 },
        { threshold: 275000, rate: 0.10 },
        { threshold: 325000, rate: 0.11 }
      ],
      hoh: [
        { threshold: 0, rate: 0.014 },
        { threshold: 14400, rate: 0.032 },
        { threshold: 21600, rate: 0.055 },
        { threshold: 28800, rate: 0.064 },
        { threshold: 36000, rate: 0.068 },
        { threshold: 54000, rate: 0.072 },
        { threshold: 72000, rate: 0.076 },
        { threshold: 187500, rate: 0.079 },
        { threshold: 262500, rate: 0.0825 },
        { threshold: 337500, rate: 0.09 },
        { threshold: 412500, rate: 0.10 },
        { threshold: 487500, rate: 0.11 }
      ]
    }
  },
  ID: {
    stateCode: 'ID',
    stateName: 'Idaho',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.053, // 5.30% flat tax
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://tax.idaho.gov/',
    effectiveDate: '01/01/2026'
  },
  IA: {
    stateCode: 'IA',
    stateName: 'Iowa',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.038, // 3.80% flat tax
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://tax.iowa.gov/',
    effectiveDate: '01/01/2026'
  },
  KS: {
    stateCode: 'KS',
    stateName: 'Kansas',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 3605, mfj: 8240, mfs: 4120, hoh: 6180 },
    baseSalesTaxRate: 6.5,
    sourceUrl: 'https://www.ksrevenue.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.052 },
        { threshold: 23000, rate: 0.0558 }
      ],
      mfj: [
        { threshold: 0, rate: 0.052 },
        { threshold: 46000, rate: 0.0558 }
      ],
      mfs: [
        { threshold: 0, rate: 0.052 },
        { threshold: 23000, rate: 0.0558 }
      ],
      hoh: [
        { threshold: 0, rate: 0.052 },
        { threshold: 23000, rate: 0.0558 }
      ]
    }
  },
  KY: {
    stateCode: 'KY',
    stateName: 'Kentucky',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.035, // 3.50% in 2026 (4.0% in 2024-2025)
    standardDeduction: { single: 3360, mfj: 3360, mfs: 3360, hoh: 3360 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://revenue.ky.gov/',
    effectiveDate: '01/01/2026'
  },
  LA: {
    stateCode: 'LA',
    stateName: 'Louisiana',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.03, // 3.00% flat tax per Louisiana Department of Revenue (Act 1 / La. R.S. 47:293)
    standardDeduction: { single: 12875, mfj: 25750, mfs: 12875, hoh: 25750 }, // Inflation-adjusted deduction values per Louisiana Department of Revenue (Act 1 / La. R.S. 47:294)
    baseSalesTaxRate: 4.45,
    sourceUrl: 'https://revenue.louisiana.gov/',
    effectiveDate: '01/01/2026'
  },
  ME: {
    stateCode: 'ME',
    stateName: 'Maine',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 15700, mfj: 31400, mfs: 15700, hoh: 23550 }, // Standard deduction per Maine Revenue Services (36 M.R.S. § 5124-C)
    baseSalesTaxRate: 5.5,
    sourceUrl: 'https://www.maine.gov/revenue/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.058 },
        { threshold: 27400, rate: 0.0675 },
        { threshold: 64850, rate: 0.0715 },
        { threshold: 1000000, rate: 0.0915 }
      ],
      mfj: [
        { threshold: 0, rate: 0.058 },
        { threshold: 54800, rate: 0.0675 },
        { threshold: 129700, rate: 0.0715 },
        { threshold: 1500000, rate: 0.0915 }
      ],
      mfs: [
        { threshold: 0, rate: 0.058 },
        { threshold: 27400, rate: 0.0675 },
        { threshold: 64850, rate: 0.0715 },
        { threshold: 1000000, rate: 0.0915 }
      ],
      hoh: [
        { threshold: 0, rate: 0.058 },
        { threshold: 41100, rate: 0.0675 },
        { threshold: 97300, rate: 0.0715 },
        { threshold: 1000000, rate: 0.0915 }
      ]
    }
  },
  MD: {
    stateCode: 'MD',
    stateName: 'Maryland',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 3400, mfj: 6800, mfs: 3400, hoh: 6800 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://www.marylandtaxes.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.02 },
        { threshold: 1000, rate: 0.03 },
        { threshold: 2000, rate: 0.04 },
        { threshold: 3000, rate: 0.0475 },
        { threshold: 100000, rate: 0.05 },
        { threshold: 125000, rate: 0.0525 },
        { threshold: 150000, rate: 0.055 },
        { threshold: 250000, rate: 0.0575 },
        { threshold: 500000, rate: 0.0625 },
        { threshold: 1000000, rate: 0.065 }
      ],
      mfj: [
        { threshold: 0, rate: 0.02 },
        { threshold: 1000, rate: 0.03 },
        { threshold: 2000, rate: 0.04 },
        { threshold: 3000, rate: 0.0475 },
        { threshold: 150000, rate: 0.05 },
        { threshold: 175000, rate: 0.0525 },
        { threshold: 225000, rate: 0.055 },
        { threshold: 300000, rate: 0.0575 },
        { threshold: 600000, rate: 0.0625 },
        { threshold: 1200000, rate: 0.065 }
      ],
      mfs: [
        { threshold: 0, rate: 0.02 },
        { threshold: 1000, rate: 0.03 },
        { threshold: 2000, rate: 0.04 },
        { threshold: 3000, rate: 0.0475 },
        { threshold: 100000, rate: 0.05 },
        { threshold: 125000, rate: 0.0525 },
        { threshold: 150000, rate: 0.055 },
        { threshold: 250000, rate: 0.0575 },
        { threshold: 500000, rate: 0.0625 },
        { threshold: 1000000, rate: 0.065 }
      ],
      hoh: [
        { threshold: 0, rate: 0.02 },
        { threshold: 1000, rate: 0.03 },
        { threshold: 2000, rate: 0.04 },
        { threshold: 3000, rate: 0.0475 },
        { threshold: 150000, rate: 0.05 },
        { threshold: 175000, rate: 0.0525 },
        { threshold: 225000, rate: 0.055 },
        { threshold: 300000, rate: 0.0575 },
        { threshold: 600000, rate: 0.0625 },
        { threshold: 1200000, rate: 0.065 }
      ]
    }
  },
  MN: {
    stateCode: 'MN',
    stateName: 'Minnesota',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 15300, mfj: 30600, mfs: 15300, hoh: 23000 },
    baseSalesTaxRate: 6.875,
    sourceUrl: 'https://www.revenue.state.mn.us/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0535 },
        { threshold: 33310, rate: 0.068 },
        { threshold: 109430, rate: 0.0785 },
        { threshold: 203150, rate: 0.0985 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0535 },
        { threshold: 48700, rate: 0.068 },
        { threshold: 193480, rate: 0.0785 },
        { threshold: 337930, rate: 0.0985 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0535 },
        { threshold: 24350, rate: 0.068 },
        { threshold: 96740, rate: 0.0785 },
        { threshold: 168965, rate: 0.0985 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0535 },
        { threshold: 41010, rate: 0.068 },
        { threshold: 164800, rate: 0.0785 },
        { threshold: 270060, rate: 0.0985 }
      ]
    }
  },
  MS: {
    stateCode: 'MS',
    stateName: 'Mississippi',
    hasIncomeTax: true,
    type: 'flat',
    flatRate: 0.04, // 4.0% in 2026 on taxable income over $10k
    standardDeduction: { single: 2300, mfj: 4600, mfs: 2300, hoh: 3400 },
    baseSalesTaxRate: 7.0,
    sourceUrl: 'https://www.dor.ms.gov/',
    effectiveDate: '01/01/2026'
  },
  MO: {
    stateCode: 'MO',
    stateName: 'Missouri',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 4.225,
    sourceUrl: 'https://dor.mo.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 1313, rate: 0.02 },
        { threshold: 2626, rate: 0.025 },
        { threshold: 3939, rate: 0.03 },
        { threshold: 5252, rate: 0.035 },
        { threshold: 6565, rate: 0.04 },
        { threshold: 7878, rate: 0.045 },
        { threshold: 9191, rate: 0.047 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 1313, rate: 0.02 },
        { threshold: 2626, rate: 0.025 },
        { threshold: 3939, rate: 0.03 },
        { threshold: 5252, rate: 0.035 },
        { threshold: 6565, rate: 0.04 },
        { threshold: 7878, rate: 0.045 },
        { threshold: 9191, rate: 0.047 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 1313, rate: 0.02 },
        { threshold: 2626, rate: 0.025 },
        { threshold: 3939, rate: 0.03 },
        { threshold: 5252, rate: 0.035 },
        { threshold: 6565, rate: 0.04 },
        { threshold: 7878, rate: 0.045 },
        { threshold: 9191, rate: 0.047 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 1313, rate: 0.02 },
        { threshold: 2626, rate: 0.025 },
        { threshold: 3939, rate: 0.03 },
        { threshold: 5252, rate: 0.035 },
        { threshold: 6565, rate: 0.04 },
        { threshold: 7878, rate: 0.045 },
        { threshold: 9191, rate: 0.047 }
      ]
    }
  },
  MT: {
    stateCode: 'MT',
    stateName: 'Montana',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://mtrevenue.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.047 },
        { threshold: 47500, rate: 0.0565 }
      ],
      mfj: [
        { threshold: 0, rate: 0.047 },
        { threshold: 95000, rate: 0.0565 }
      ],
      mfs: [
        { threshold: 0, rate: 0.047 },
        { threshold: 47500, rate: 0.0565 }
      ],
      hoh: [
        { threshold: 0, rate: 0.047 },
        { threshold: 71250, rate: 0.0565 }
      ]
    }
  },
  NE: {
    stateCode: 'NE',
    stateName: 'Nebraska',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 8850, mfj: 17700, mfs: 8850, hoh: 12950 },
    baseSalesTaxRate: 5.5,
    sourceUrl: 'https://revenue.nebraska.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0246 },
        { threshold: 3700, rate: 0.0351 },
        { threshold: 22170, rate: 0.0455 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0246 },
        { threshold: 7390, rate: 0.0351 },
        { threshold: 44350, rate: 0.0455 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0246 },
        { threshold: 3700, rate: 0.0351 },
        { threshold: 22170, rate: 0.0455 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0246 },
        { threshold: 6910, rate: 0.0351 },
        { threshold: 35050, rate: 0.0455 }
      ]
    }
  },
  NM: {
    stateCode: 'NM',
    stateName: 'New Mexico',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 5.125,
    sourceUrl: 'https://www.tax.newmexico.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.015 },
        { threshold: 5500, rate: 0.032 },
        { threshold: 16500, rate: 0.043 },
        { threshold: 33500, rate: 0.047 },
        { threshold: 66500, rate: 0.049 },
        { threshold: 210000, rate: 0.059 }
      ],
      mfj: [
        { threshold: 0, rate: 0.015 },
        { threshold: 8000, rate: 0.032 },
        { threshold: 25000, rate: 0.043 },
        { threshold: 50000, rate: 0.047 },
        { threshold: 100000, rate: 0.049 },
        { threshold: 315000, rate: 0.059 }
      ],
      mfs: [
        { threshold: 0, rate: 0.015 },
        { threshold: 4000, rate: 0.032 },
        { threshold: 12500, rate: 0.043 },
        { threshold: 25000, rate: 0.047 },
        { threshold: 50000, rate: 0.049 },
        { threshold: 157500, rate: 0.059 }
      ],
      hoh: [
        { threshold: 0, rate: 0.015 },
        { threshold: 8000, rate: 0.032 },
        { threshold: 25000, rate: 0.043 },
        { threshold: 50000, rate: 0.047 },
        { threshold: 100000, rate: 0.049 },
        { threshold: 315000, rate: 0.059 }
      ]
    }
  },
  ND: {
    stateCode: 'ND',
    stateName: 'North Dakota',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },
    baseSalesTaxRate: 5.0,
    sourceUrl: 'https://www.tax.nd.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 49575, rate: 0.0195 },
        { threshold: 250400, rate: 0.025 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 82800, rate: 0.0195 },
        { threshold: 304800, rate: 0.025 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 41400, rate: 0.0195 },
        { threshold: 152400, rate: 0.025 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 66400, rate: 0.0195 },
        { threshold: 277600, rate: 0.025 }
      ]
    }
  },
  OK: {
    stateCode: 'OK',
    stateName: 'Oklahoma',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 6350, mfj: 12700, mfs: 6350, hoh: 9350 },
    baseSalesTaxRate: 4.5,
    sourceUrl: 'https://oklahoma.gov/tax.html',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0 },
        { threshold: 3750, rate: 0.025 },
        { threshold: 4900, rate: 0.035 },
        { threshold: 7200, rate: 0.045 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0 },
        { threshold: 7500, rate: 0.025 },
        { threshold: 9800, rate: 0.035 },
        { threshold: 14400, rate: 0.045 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0 },
        { threshold: 3750, rate: 0.025 },
        { threshold: 4900, rate: 0.035 },
        { threshold: 7200, rate: 0.045 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0 },
        { threshold: 7500, rate: 0.025 },
        { threshold: 9800, rate: 0.035 },
        { threshold: 14400, rate: 0.045 }
      ]
    }
  },
  OR: {
    stateCode: 'OR',
    stateName: 'Oregon',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 2910, mfj: 5820, mfs: 2910, hoh: 4685 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://www.oregon.gov/dor/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0475 },
        { threshold: 4550, rate: 0.0675 },
        { threshold: 11400, rate: 0.0875 },
        { threshold: 125000, rate: 0.099 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0475 },
        { threshold: 9100, rate: 0.0675 },
        { threshold: 22800, rate: 0.0875 },
        { threshold: 250000, rate: 0.099 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0475 },
        { threshold: 4550, rate: 0.0675 },
        { threshold: 11400, rate: 0.0875 },
        { threshold: 125000, rate: 0.099 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0475 },
        { threshold: 9100, rate: 0.0675 },
        { threshold: 22800, rate: 0.0875 },
        { threshold: 250000, rate: 0.099 }
      ]
    }
  },
  RI: {
    stateCode: 'RI',
    stateName: 'Rhode Island',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 11200, mfj: 22400, mfs: 11200, hoh: 16800 },
    baseSalesTaxRate: 7.0,
    sourceUrl: 'https://tax.ri.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0375 },
        { threshold: 82050, rate: 0.0475 },
        { threshold: 186450, rate: 0.0599 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0375 },
        { threshold: 82050, rate: 0.0475 },
        { threshold: 186450, rate: 0.0599 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0375 },
        { threshold: 82050, rate: 0.0475 },
        { threshold: 186450, rate: 0.0599 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0375 },
        { threshold: 82050, rate: 0.0475 },
        { threshold: 186450, rate: 0.0599 }
      ]
    }
  },
  SC: {
    stateCode: 'SC',
    stateName: 'South Carolina',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 15000, mfj: 30000, mfs: 15000, hoh: 22500 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://dor.sc.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0199 },
        { threshold: 30000, rate: 0.0521 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0199 },
        { threshold: 30000, rate: 0.0521 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0199 },
        { threshold: 30000, rate: 0.0521 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0199 },
        { threshold: 30000, rate: 0.0521 }
      ]
    }
  },
  VT: {
    stateCode: 'VT',
    stateName: 'Vermont',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 7650, mfj: 15300, mfs: 7650, hoh: 11450 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://tax.vermont.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0335 },
        { threshold: 49400, rate: 0.066 },
        { threshold: 75000, rate: 0.076 },
        { threshold: 119700, rate: 0.0875 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0335 },
        { threshold: 75000, rate: 0.066 },
        { threshold: 82500, rate: 0.076 },
        { threshold: 199450, rate: 0.0875 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0335 },
        { threshold: 41250, rate: 0.066 },
        { threshold: 75000, rate: 0.076 },
        { threshold: 99725, rate: 0.0875 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0335 },
        { threshold: 66200, rate: 0.066 },
        { threshold: 75000, rate: 0.076 },
        { threshold: 171000, rate: 0.0875 }
      ]
    }
  },
  WV: {
    stateCode: 'WV',
    stateName: 'West Virginia',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 10000, mfj: 20000, mfs: 10000, hoh: 10000 },
    baseSalesTaxRate: 6.0,
    sourceUrl: 'https://tax.wv.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.0211 },
        { threshold: 10000, rate: 0.0281 },
        { threshold: 25000, rate: 0.0316 },
        { threshold: 40000, rate: 0.0422 },
        { threshold: 60000, rate: 0.0458 }
      ],
      mfj: [
        { threshold: 0, rate: 0.0211 },
        { threshold: 10000, rate: 0.0281 },
        { threshold: 25000, rate: 0.0316 },
        { threshold: 40000, rate: 0.0422 },
        { threshold: 60000, rate: 0.0458 }
      ],
      mfs: [
        { threshold: 0, rate: 0.0211 },
        { threshold: 5000, rate: 0.0281 },
        { threshold: 12500, rate: 0.0316 },
        { threshold: 20000, rate: 0.0422 },
        { threshold: 30000, rate: 0.0458 }
      ],
      hoh: [
        { threshold: 0, rate: 0.0211 },
        { threshold: 10000, rate: 0.0281 },
        { threshold: 25000, rate: 0.0316 },
        { threshold: 40000, rate: 0.0422 },
        { threshold: 60000, rate: 0.0458 }
      ]
    }
  },
  WI: {
    stateCode: 'WI',
    stateName: 'Wisconsin',
    hasIncomeTax: true,
    type: 'progressive',
    standardDeduction: { single: 13960, mfj: 26510, mfs: 13960, hoh: 18000 },
    baseSalesTaxRate: 5.0,
    sourceUrl: 'https://www.revenue.wi.gov/',
    effectiveDate: '01/01/2026',
    brackets: {
      single: [
        { threshold: 0, rate: 0.035 },
        { threshold: 15110, rate: 0.044 },
        { threshold: 51950, rate: 0.053 },
        { threshold: 332720, rate: 0.0765 }
      ],
      mfj: [
        { threshold: 0, rate: 0.035 },
        { threshold: 19580, rate: 0.044 },
        { threshold: 67300, rate: 0.053 },
        { threshold: 431060, rate: 0.0765 }
      ],
      mfs: [
        { threshold: 0, rate: 0.035 },
        { threshold: 9790, rate: 0.044 },
        { threshold: 33650, rate: 0.053 },
        { threshold: 215530, rate: 0.0765 }
      ],
      hoh: [
        { threshold: 0, rate: 0.035 },
        { threshold: 15110, rate: 0.044 },
        { threshold: 51950, rate: 0.053 },
        { threshold: 332720, rate: 0.0765 }
      ]
    }
  }
};

// Year-specific overrides for states whose rates/deductions vary across 2024, 2025, 2026
export const US_STATE_TAX_CONFIGS_BY_YEAR: Record<number, Record<string, Partial<StateTaxConfig>>> = {
  2024: {
    CO: { flatRate: 0.0425, effectiveDate: '01/01/2024' },
    GA: { flatRate: 0.0539, standardDeduction: { single: 12000, mfj: 24000, mfs: 12000, hoh: 12000 }, effectiveDate: '01/01/2024' },
    IN: { flatRate: 0.0305, effectiveDate: '01/01/2024' },
    KY: { flatRate: 0.04, standardDeduction: { single: 3160, mfj: 3160, mfs: 3160, hoh: 3160 }, effectiveDate: '01/01/2024' },
    NC: { flatRate: 0.045, standardDeduction: { single: 12750, mfj: 25500, mfs: 12750, hoh: 19125 }, effectiveDate: '01/01/2024' },
    UT: { flatRate: 0.0465, effectiveDate: '01/01/2024' },
    OH: {
      type: 'progressive',
      brackets: {
        single: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.035 }
        ],
        mfj: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.035 }
        ],
        mfs: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.035 }
        ],
        hoh: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.035 }
        ]
      },
      effectiveDate: '01/01/2024'
    }
  },
  2025: {
    CO: { flatRate: 0.044, effectiveDate: '01/01/2025' },
    GA: { flatRate: 0.0519, standardDeduction: { single: 12000, mfj: 24000, mfs: 12000, hoh: 12000 }, effectiveDate: '01/01/2025' },
    IN: { flatRate: 0.03, effectiveDate: '01/01/2025' },
    KY: { flatRate: 0.04, standardDeduction: { single: 3270, mfj: 3270, mfs: 3270, hoh: 3270 }, effectiveDate: '01/01/2025' },
    NC: { flatRate: 0.0425, standardDeduction: { single: 12750, mfj: 25500, mfs: 12750, hoh: 19125 }, effectiveDate: '01/01/2025' },
    UT: { flatRate: 0.045, effectiveDate: '01/01/2025' },
    OH: {
      type: 'progressive',
      brackets: {
        single: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.03125 }
        ],
        mfj: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.03125 }
        ],
        mfs: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.03125 }
        ],
        hoh: [
          { threshold: 0, rate: 0.0 },
          { threshold: 26050, rate: 0.0275 },
          { threshold: 100000, rate: 0.03125 }
        ]
      },
      effectiveDate: '01/01/2025'
    }
  },
  2026: {
    CO: { flatRate: 0.044, effectiveDate: '01/01/2026' },
    GA: { flatRate: 0.0499, standardDeduction: { single: 15000, mfj: 30000, mfs: 15000, hoh: 15000 }, effectiveDate: '01/01/2026' },
    IN: { flatRate: 0.0295, effectiveDate: '01/01/2026' },
    KY: { flatRate: 0.035, standardDeduction: { single: 3360, mfj: 3360, mfs: 3360, hoh: 3360 }, effectiveDate: '01/01/2026' },
    NC: { flatRate: 0.0399, standardDeduction: { single: 12750, mfj: 25500, mfs: 12750, hoh: 19125 }, effectiveDate: '01/01/2026' },
    UT: { flatRate: 0.0445, effectiveDate: '01/01/2026' },
    OH: {
      type: 'flat',
      flatRate: 0.0275,
      brackets: undefined,
      effectiveDate: '01/01/2026'
    }
  }
};

// Generic fallback for any other state
export const DEFAULT_STATE_CODE = 'CA';

export function getStateConfig(stateCode: string, year: number = DEFAULT_TAX_YEAR): StateTaxConfig {
  if (year !== 2026) {
    throw new CalculationError(
      'UNSUPPORTED_YEAR',
      `Unsupported tax year: ${year}. WowCalc exclusively supports Tax Year 2026.`
    );
  }

  const code = (stateCode || 'CA').toUpperCase();
  const baseConfig = US_STATE_TAX_CONFIGS[code];
  if (baseConfig) {
    const config = JSON.parse(JSON.stringify(baseConfig));
    const yearOverride = US_STATE_TAX_CONFIGS_BY_YEAR[year]?.[code];
    if (yearOverride) {
      Object.assign(config, yearOverride);
    }
    return config;
  }

  // Never show a made-up state tax! If not supported, mark hasIncomeTax: false and isEstimated: true with clear warning.
  return {
    stateCode: code,
    stateName: code,
    hasIncomeTax: false,
    type: 'none',
    standardDeduction: { single: 0, mfj: 0, mfs: 0, hoh: 0 },
    baseSalesTaxRate: 0.0,
    sourceUrl: 'https://www.irs.gov/',
    effectiveDate: '01/01/2026',
    isEstimated: true,
    warning: `State income tax not modeled for ${code}`
  };
}

/**
 * 2026 Median Effective Property Tax Rates by State (Tax Foundation / US Census ACS).
 * Useful for real estate escrow and mortgage property tax rate benchmarking.
 */
export const US_STATE_PROPERTY_TAX_RATES: Record<string, number> = {
  AL: 0.40, AK: 1.04, AZ: 0.63, AR: 0.64, CA: 0.75, CO: 0.55, CT: 1.96, DE: 0.61,
  DC: 0.62, FL: 0.91, GA: 0.90, HI: 0.32, ID: 0.67, IL: 2.08, IN: 0.84, IA: 1.52,
  KS: 1.33, KY: 0.83, LA: 0.56, ME: 1.24, MD: 1.05, MA: 1.14, MI: 1.38, MN: 1.11,
  MS: 0.79, MO: 1.01, MT: 0.74, NE: 1.63, NV: 0.55, NH: 1.93, NJ: 2.23, NM: 0.73,
  NY: 1.73, NC: 0.82, ND: 0.98, OH: 1.59, OK: 0.89, OR: 0.93, PA: 1.49, RI: 1.53,
  SC: 0.57, SD: 1.14, TN: 0.56, TX: 1.68, UT: 0.57, VT: 1.83, VA: 0.87, WA: 0.87,
  WV: 0.57, WI: 1.61, WY: 0.56
};

export function getStatePropertyTaxRate(stateCode: string): number {
  const code = (stateCode || 'CA').toUpperCase();
  return US_STATE_PROPERTY_TAX_RATES[code] ?? 1.20;
}

export const US_STATE_LIST = [
  { code: 'AL', name: 'Alabama (Progressive 5.0%)' },
  { code: 'AK', name: 'Alaska (No Income Tax)' },
  { code: 'AZ', name: 'Arizona (2.50% Flat)' },
  { code: 'AR', name: 'Arkansas (Progressive 3.7%)' },
  { code: 'CA', name: 'California (Progressive 12.3%)' },
  { code: 'CO', name: 'Colorado (4.40% Flat)' },
  { code: 'CT', name: 'Connecticut (Progressive 6.99%)' },
  { code: 'DE', name: 'Delaware (Progressive 6.60%)' },
  { code: 'DC', name: 'District of Columbia (Progressive 10.75%)' },
  { code: 'FL', name: 'Florida (No Income Tax)' },
  { code: 'GA', name: 'Georgia (4.99% Flat)' },
  { code: 'HI', name: 'Hawaii (Progressive 11.0%)' },
  { code: 'ID', name: 'Idaho (5.30% Flat)' },
  { code: 'IL', name: 'Illinois (4.95% Flat)' },
  { code: 'IN', name: 'Indiana (2.95% Flat)' },
  { code: 'IA', name: 'Iowa (3.80% Flat)' },
  { code: 'KS', name: 'Kansas (Progressive 5.20% - 5.58%)' },
  { code: 'KY', name: 'Kentucky (3.50% Flat)' },
  { code: 'LA', name: 'Louisiana (3.00% Flat)' },
  { code: 'ME', name: 'Maine (Progressive 9.15%)' },
  { code: 'MD', name: 'Maryland (Progressive 6.50%)' },
  { code: 'MA', name: 'Massachusetts (5.00% Flat)' },
  { code: 'MI', name: 'Michigan (4.25% Flat)' },
  { code: 'MN', name: 'Minnesota (Progressive 9.85%)' },
  { code: 'MS', name: 'Mississippi (4.00% Flat)' },
  { code: 'MO', name: 'Missouri (Progressive 4.70%)' },
  { code: 'MT', name: 'Montana (Progressive 5.65%)' },
  { code: 'NE', name: 'Nebraska (Progressive 4.55%)' },
  { code: 'NV', name: 'Nevada (No Income Tax)' },
  { code: 'NH', name: 'New Hampshire (No Income Tax)' },
  { code: 'NJ', name: 'New Jersey (Progressive 10.75%)' },
  { code: 'NM', name: 'New Mexico (Progressive 5.90%)' },
  { code: 'NY', name: 'New York (Progressive 10.9%)' },
  { code: 'NC', name: 'North Carolina (3.99% Flat)' },
  { code: 'ND', name: 'North Dakota (2.50% Flat)' },
  { code: 'OH', name: 'Ohio (2.75% Flat)' },
  { code: 'OK', name: 'Oklahoma (Progressive 4.50%)' },
  { code: 'OR', name: 'Oregon (Progressive 9.90%)' },
  { code: 'PA', name: 'Pennsylvania (3.07% Flat)' },
  { code: 'RI', name: 'Rhode Island (Progressive 5.99%)' },
  { code: 'SC', name: 'South Carolina (Progressive 5.21%)' },
  { code: 'SD', name: 'South Dakota (No Income Tax)' },
  { code: 'TN', name: 'Tennessee (No Income Tax)' },
  { code: 'TX', name: 'Texas (No Income Tax)' },
  { code: 'UT', name: 'Utah (4.45% Flat)' },
  { code: 'VT', name: 'Vermont (Progressive 8.75%)' },
  { code: 'VA', name: 'Virginia (Progressive 5.75%)' },
  { code: 'WA', name: 'Washington (No Income Tax)' },
  { code: 'WV', name: 'West Virginia (Progressive 4.58%)' },
  { code: 'WI', name: 'Wisconsin (Progressive 7.65%)' },
  { code: 'WY', name: 'Wyoming (No Income Tax)' },
];

/* ============================================================================
 * MORTGAGE & LOAN REGULATORY CONFIGURATION (2026 STATUTORY LIMITS & PROGRAMS)
 * ========================================================================== */

export interface MortgageConfig {
  conformingLoanLimit: {
    baseline: number;
    highCostCeiling: number;
    sourceUrl: string;
    effectiveDate: string;
    needsVerification: boolean;
  };
  fhaLoanLimit: {
    floor: number;
    ceiling: number;
    sourceUrl: string;
    effectiveDate: string;
    needsVerification: boolean;
  };
  pmiConventionalDefaultRate: number; // 0.0075 (0.75%)
  fha: {
    upfrontMipRate: number; // 0.0175 (1.75%)
    sourceUrl: string;
    // Annual rates per HUD Mortgagee Letter 2023-05
    getAnnualMipRate: (ltv: number, termYears: number, baseLoanAmount: number) => number;
  };
  va: {
    sourceUrl: string;
    // VA funding fee rates (effective since April 7, 2023)
    getFundingFeeRate: (downPaymentPercent: number, isSubsequentUse: boolean, isExempt: boolean) => number;
  };
  usda: {
    upfrontGuaranteeFeeRate: number; // 0.01 (1.00%)
    annualFeeRate: number; // 0.0035 (0.35%)
    sourceUrl: string;
  };
  sampleRates: {
    isSample: boolean;
    label: string;
    fixed30: number;
    fixed15: number;
    fha30: number;
    va30: number;
    usda30: number;
  };
}

export const US_MORTGAGE_CONFIG_2026: MortgageConfig = {
  conformingLoanLimit: {
    baseline: 832750, // FHFA 2026 Conforming Loan Limit estimate for 1-unit properties
    highCostCeiling: 1249125,
    sourceUrl: 'https://www.fhfa.gov/data/conforming-loan-limits',
    effectiveDate: '01/01/2026',
    needsVerification: true // Marked unverified: 2026 FHFA limits are projected until official annual release
  },
  fhaLoanLimit: {
    floor: 541287, // HUD 2026 FHA floor estimate for 1-unit properties (65% of CLL)
    ceiling: 1249125,
    sourceUrl: 'https://www.hud.gov/program_offices/housing/sfh/lender/origination/mortgage_limits',
    effectiveDate: '01/01/2026',
    needsVerification: true // Marked unverified: 2026 HUD limits are projected until official Mortgagee Letter
  },
  pmiConventionalDefaultRate: 0.0075, // 0.75% annual default assumption for conventional loans
  fha: {
    upfrontMipRate: 0.0175, // 1.75% upfront MIP
    sourceUrl: 'https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-05hsgml.pdf',
    getAnnualMipRate: (ltv: number, termYears: number, baseLoanAmount: number): number => {
      const isOverConforming = baseLoanAmount > 832750;
      if (termYears > 15) {
        if (!isOverConforming) {
          return ltv > 95 ? 0.0055 : 0.0050; // 0.55% if LTV > 95%, else 0.50%
        } else {
          return ltv > 95 ? 0.0075 : 0.0070;
        }
      } else {
        // 15 years or less
        if (!isOverConforming) {
          return ltv > 90 ? 0.0040 : 0.0015;
        } else {
          return ltv > 90 ? 0.0065 : 0.0040;
        }
      }
    }
  },
  va: {
    sourceUrl: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/',
    getFundingFeeRate: (downPaymentPercent: number, isSubsequentUse: boolean, isExempt: boolean): number => {
      if (isExempt) return 0;
      if (!isSubsequentUse) {
        if (downPaymentPercent < 5) return 0.0215; // 2.15%
        if (downPaymentPercent < 10) return 0.0150; // 1.50%
        return 0.0125; // 1.25%
      } else {
        if (downPaymentPercent < 5) return 0.0330; // 3.30%
        if (downPaymentPercent < 10) return 0.0150; // 1.50%
        return 0.0125; // 1.25%
      }
    }
  },
  usda: {
    upfrontGuaranteeFeeRate: 0.010, // 1.00%
    annualFeeRate: 0.0035, // 0.35%
    sourceUrl: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-guaranteed-loan-program'
  },
  sampleRates: {
    isSample: true,
    label: 'Sample market rates (update regularly)',
    fixed30: 6.875,
    fixed15: 6.125,
    fha30: 6.500,
    va30: 6.375,
    usda30: 6.875
  }
};

/* ============================================================================
 * AUTO LOAN & VEHICLE SALES TAX REGULATORY CONFIGURATION (50 STATES + DC)
 * ========================================================================== */

export interface AutoStateTaxConfig {
  code: string;
  name: string;
  rate: number; // State baseline auto tax rate %
  tradeInTaxCredit: boolean | 'partial';
  maxTaxCap?: number; // Statutory dollar cap on sales tax / fee (e.g. SC $500 cap, NC $2000 cap)
  docFeeCap?: number; // Statutory cap on dealer documentation fees
  docFeeStatus: string;
  avgCombinedRate: string;
  notes?: string;
  source: string;
  sourceUrl: string;
  needsVerification?: boolean;
}

export const US_STATE_OVERTIME_RULES: Record<string, {
  hasDailyOvertime: boolean;
  ruleSummary: string;
  source: string;
  statute: string;
}> = {
  CA: {
    hasDailyOvertime: true,
    ruleSummary: 'California requires 1.5x pay for hours worked over 8 up to 12 in a workday and the first 8 hours on the 7th consecutive day of work in a workweek; 2.0x pay (double time) for hours worked over 12 in a workday and all hours over 8 on the 7th consecutive day. Standard 1.5x applies to hours over 40 in a workweek.',
    source: 'California Department of Industrial Relations (DIR)',
    statute: 'Cal. Lab. Code § 510; IWC Wage Orders'
  },
  AK: {
    hasDailyOvertime: true,
    ruleSummary: 'Alaska requires 1.5x pay for hours worked over 8 in a workday and for hours worked over 40 in a workweek for non-exempt employees.',
    source: 'Alaska Department of Labor and Workforce Development',
    statute: 'Alaska Stat. § 23.10.060'
  },
  NV: {
    hasDailyOvertime: true,
    ruleSummary: 'Nevada requires 1.5x pay for hours worked over 8 in a 24-hour period (or over 10 hours on an agreed 4x10 schedule) for non-exempt employees earning less than 1.5x state minimum wage. Employees earning 1.5x minimum wage or more are subject only to the standard 40-hour weekly rule.',
    source: 'Nevada Office of the Labor Commissioner',
    statute: 'Nev. Rev. Stat. § 608.018'
  },
  CO: {
    hasDailyOvertime: true,
    ruleSummary: 'Colorado requires 1.5x pay for hours worked in excess of 12 hours per workday, 12 consecutive hours without regard to day boundary, or 40 hours per workweek (whichever yields greater pay).',
    source: 'Colorado Department of Labor and Employment',
    statute: 'COMPS Order #39, 7 CCR 1103-1'
  }
};

export const US_AUTO_SALES_TAX_LIST: AutoStateTaxConfig[] = [
  { code: 'AL', name: 'Alabama', rate: 2.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $500 avg)', avgCombinedRate: '3.50% – 4.00%', source: 'Alabama Department of Revenue', sourceUrl: 'https://revenue.alabama.gov/' },
  { code: 'AK', name: 'Alaska', rate: 0.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $400 avg)', avgCombinedRate: '0.00% – 7.50% (Local)', source: 'Alaska Department of Revenue (No state sales tax)', sourceUrl: 'https://dor.alaska.gov/' },
  { code: 'AZ', name: 'Arizona', rate: 5.60, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $500 avg)', avgCombinedRate: '7.20% – 9.20%', source: 'Arizona Department of Revenue', sourceUrl: 'https://azdor.gov/' },
  { code: 'AR', name: 'Arkansas', rate: 6.50, tradeInTaxCredit: 'partial', notes: 'Trade-in value must exceed $4,000 to qualify for sales tax credit (Ark. Code § 26-52-510)', docFeeStatus: 'Uncapped ($150 – $300 avg)', avgCombinedRate: '7.50% – 10.00%', source: 'Arkansas Department of Finance and Administration', sourceUrl: 'https://www.dfa.arkansas.gov/' },
  { code: 'CA', name: 'California', rate: 7.25, tradeInTaxCredit: false, docFeeCap: 85, docFeeStatus: 'Capped at $85', avgCombinedRate: '7.25% – 10.75%', notes: 'Full vehicle purchase price is taxed. Trade-in credit is strictly prohibited under Cal. Rev. & Tax. Code § 6012.', source: 'California Department of Tax and Fee Administration (CDTFA)', sourceUrl: 'https://www.cdtfa.ca.gov/' },
  { code: 'CO', name: 'Colorado', rate: 2.90, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($500 – $700 avg)', avgCombinedRate: '6.00% – 9.50%', source: 'Colorado Department of Revenue', sourceUrl: 'https://tax.colorado.gov/' },
  { code: 'CT', name: 'Connecticut', rate: 6.35, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $600 avg)', avgCombinedRate: '6.35% – 7.75%', notes: '7.75% luxury vehicle tax rate on portion over $50,000', source: 'Connecticut Department of Revenue Services', sourceUrl: 'https://portal.ct.gov/drs' },
  { code: 'DE', name: 'Delaware', rate: 0.00, tradeInTaxCredit: false, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '4.25% (Doc Fee)', notes: 'No state sales tax, but 4.25% document fee is charged on gross purchase price without trade credit.', source: 'Delaware Division of Motor Vehicles', sourceUrl: 'https://dmv.de.gov/' },
  { code: 'DC', name: 'District of Columbia', rate: 6.00, tradeInTaxCredit: false, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '6.00% (Weight-based excise)', notes: 'Weight-based motor vehicle excise tax (1.0% to 10.1% based on vehicle curb weight and MPG per D.C. Code § 50-2201.03; ~6.0% passenger car baseline). No trade-in deduction.', source: 'District of Columbia DMV', sourceUrl: 'https://dmv.dc.gov/', needsVerification: true },
  { code: 'FL', name: 'Florida', rate: 6.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($800 – $1,000+ avg)', avgCombinedRate: '6.00% – 7.50%', source: 'Florida Department of Revenue', sourceUrl: 'https://floridarevenue.com/' },
  { code: 'GA', name: 'Georgia (TAVT)', rate: 7.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($500 – $700 avg)', avgCombinedRate: '7.00% (Flat TAVT)', notes: 'Title Ad Valorem Tax (TAVT) flat 7.00% based on Fair Market Value (FMV) per O.C.G.A. § 48-5C-1. Trade-in reduces taxable FMV.', source: 'Georgia Department of Revenue', sourceUrl: 'https://dor.georgia.gov/' },
  { code: 'HI', name: 'Hawaii', rate: 4.00, tradeInTaxCredit: false, docFeeStatus: 'Uncapped ($250 – $450 avg)', avgCombinedRate: '4.00% – 4.50%', notes: 'General Excise Tax (GET) 4.00% applies to gross retail price; no trade-in deduction allowed.', source: 'Hawaii Department of Taxation', sourceUrl: 'https://tax.hawaii.gov/' },
  { code: 'ID', name: 'Idaho', rate: 6.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $400 avg)', avgCombinedRate: '6.00%', source: 'Idaho State Tax Commission', sourceUrl: 'https://tax.idaho.gov/' },
  { code: 'IL', name: 'Illinois', rate: 6.25, tradeInTaxCredit: true, docFeeCap: 358, docFeeStatus: 'Capped at $358 (Adjusted yearly)', avgCombinedRate: '7.25% – 10.25%', notes: 'Trade-in sales tax credit cap was repealed Jan 1, 2022; full trade-in credit permitted.', source: 'Illinois Department of Revenue', sourceUrl: 'https://tax.illinois.gov/' },
  { code: 'IN', name: 'Indiana', rate: 7.00, tradeInTaxCredit: true, docFeeCap: 230, docFeeStatus: 'Capped at $230', avgCombinedRate: '7.00%', source: 'Indiana Department of Revenue', sourceUrl: 'https://www.in.gov/dor/' },
  { code: 'IA', name: 'Iowa', rate: 5.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($150 – $300 avg)', avgCombinedRate: '5.00%', source: 'Iowa Department of Revenue (One-time registration fee)', sourceUrl: 'https://tax.iowa.gov/' },
  { code: 'KS', name: 'Kansas', rate: 6.50, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $400 avg)', avgCombinedRate: '7.50% – 10.50%', source: 'Kansas Department of Revenue', sourceUrl: 'https://www.ksrevenue.gov/' },
  { code: 'KY', name: 'Kentucky (Usage Tax)', rate: 6.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '6.00%', notes: 'Motor Vehicle Usage Tax (6.00%) assessed on retail price less trade-in allowance', source: 'Kentucky Department of Revenue', sourceUrl: 'https://revenue.ky.gov/' },
  { code: 'LA', name: 'Louisiana', rate: 4.45, tradeInTaxCredit: true, docFeeCap: 200, docFeeStatus: 'Capped at $200', avgCombinedRate: '8.50% – 10.00%', source: 'Louisiana Department of Revenue', sourceUrl: 'https://revenue.louisiana.gov/' },
  { code: 'ME', name: 'Maine', rate: 5.50, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $500 avg)', avgCombinedRate: '5.50%', source: 'Maine Revenue Services', sourceUrl: 'https://www.maine.gov/revenue/' },
  { code: 'MD', name: 'Maryland', rate: 6.00, tradeInTaxCredit: true, docFeeCap: 500, docFeeStatus: 'Capped at $500', avgCombinedRate: '6.00%', notes: 'Motor vehicle excise tax 6.00% on fair market value minus trade-in allowance.', source: 'Maryland Motor Vehicle Administration', sourceUrl: 'https://mva.maryland.gov/' },
  { code: 'MA', name: 'Massachusetts', rate: 6.25, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $600 avg)', avgCombinedRate: '6.25%', source: 'Massachusetts Department of Revenue', sourceUrl: 'https://www.mass.gov/orgs/massachusetts-department-of-revenue' },
  { code: 'MI', name: 'Michigan', rate: 6.00, tradeInTaxCredit: 'partial', docFeeCap: 260, docFeeStatus: 'Capped at $260', avgCombinedRate: '6.00%', notes: 'Trade-in sales tax credit capped by statute ($10,000 for 2024, increases $1,000/yr per MCL 205.51).', source: 'Michigan Department of Treasury', sourceUrl: 'https://www.michigan.gov/treasury' },
  { code: 'MN', name: 'Minnesota', rate: 6.875, tradeInTaxCredit: true, docFeeCap: 275, docFeeStatus: 'Capped at $275 (2024)/$350 (2025)', avgCombinedRate: '6.875% – 8.00%', notes: 'Motor Vehicle Sales Tax 6.875% (Minn. Stat. § 297B.02). Trade-in reduces taxable amount.', source: 'Minnesota Department of Revenue', sourceUrl: 'https://www.revenue.state.mn.us/' },
  { code: 'MS', name: 'Mississippi', rate: 5.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '5.00%', source: 'Mississippi Department of Revenue', sourceUrl: 'https://www.dor.ms.gov/' },
  { code: 'MO', name: 'Missouri', rate: 4.225, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $500 avg)', avgCombinedRate: '6.00% – 9.00%', source: 'Missouri Department of Revenue', sourceUrl: 'https://dor.mo.gov/' },
  { code: 'MT', name: 'Montana', rate: 0.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $400 avg)', avgCombinedRate: '0.00% (1.5% over $150k)', source: 'Montana Motor Vehicle Division', sourceUrl: 'https://mvdmt.gov/' },
  { code: 'NE', name: 'Nebraska', rate: 5.50, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $400 avg)', avgCombinedRate: '5.50% – 7.50%', source: 'Nebraska Department of Revenue', sourceUrl: 'https://revenue.nebraska.gov/' },
  { code: 'NV', name: 'Nevada', rate: 4.60, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $600 avg)', avgCombinedRate: '8.10% – 8.38%', notes: 'State rate 4.60%; local county rates bring combined tax to 8.10% – 8.38% (NRS 372/374). Trade-in reduces tax base.', source: 'Nevada Department of Taxation', sourceUrl: 'https://tax.nv.gov/' },
  { code: 'NH', name: 'New Hampshire', rate: 0.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '0.00%', source: 'New Hampshire Department of Revenue Administration', sourceUrl: 'https://www.revenue.nh.gov/' },
  { code: 'NJ', name: 'New Jersey', rate: 6.625, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($400 – $600 avg)', avgCombinedRate: '6.625%', source: 'New Jersey Division of Taxation', sourceUrl: 'https://www.state.nj.us/treasury/taxation/' },
  { code: 'NM', name: 'New Mexico (Motor Vehicle)', rate: 4.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $400 avg)', avgCombinedRate: '4.00%', source: 'New Mexico Taxation and Revenue Department', sourceUrl: 'https://www.tax.newmexico.gov/' },
  { code: 'NY', name: 'New York', rate: 4.00, tradeInTaxCredit: true, docFeeCap: 175, docFeeStatus: 'Capped at $175', avgCombinedRate: '7.00% – 8.875%', source: 'New York Department of Taxation and Finance', sourceUrl: 'https://www.tax.ny.gov/' },
  { code: 'NC', name: 'North Carolina (HUT)', rate: 3.00, tradeInTaxCredit: true, maxTaxCap: 2000, docFeeStatus: 'Uncapped ($500 – $700 avg)', avgCombinedRate: '3.00% (Highway Use Tax)', notes: 'Highway Use Tax (HUT) 3.00% (N.C. Gen. Stat. § 105-187.3) with statutory cap of $2,000 for passenger vehicles. Trade-in credit applies before cap.', source: 'North Carolina Department of Revenue', sourceUrl: 'https://www.ncdor.gov/' },
  { code: 'ND', name: 'North Dakota', rate: 5.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($250 – $350 avg)', avgCombinedRate: '5.00%', source: 'North Dakota Office of State Tax Commissioner', sourceUrl: 'https://www.tax.nd.gov/' },
  { code: 'OH', name: 'Ohio', rate: 5.75, tradeInTaxCredit: true, docFeeCap: 250, docFeeStatus: 'Capped at $250 (or 10% of sale)', avgCombinedRate: '6.50% – 8.00%', source: 'Ohio Department of Taxation', sourceUrl: 'https://tax.ohio.gov/' },
  { code: 'OK', name: 'Oklahoma', rate: 3.25, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '3.25% – 4.50%', source: 'Oklahoma Tax Commission', sourceUrl: 'https://oklahoma.gov/tax.html' },
  { code: 'OR', name: 'Oregon (Privilege Tax)', rate: 0.50, tradeInTaxCredit: false, docFeeCap: 150, docFeeStatus: 'Capped at $150', avgCombinedRate: '0.50%', notes: 'Vehicle Privilege Tax (0.50%) on retail price without deduction for trade-in.', source: 'Oregon Department of Revenue', sourceUrl: 'https://www.oregon.gov/dor' },
  { code: 'PA', name: 'Pennsylvania', rate: 6.00, tradeInTaxCredit: true, docFeeCap: 463, docFeeStatus: 'Capped at $463 (Adjusted yearly)', avgCombinedRate: '6.00% (7% Allegheny / 8% Phila)', source: 'Pennsylvania Department of Revenue', sourceUrl: 'https://www.revenue.pa.gov/' },
  { code: 'RI', name: 'Rhode Island', rate: 7.00, tradeInTaxCredit: true, docFeeCap: 200, docFeeStatus: 'Capped at $200', avgCombinedRate: '7.00%', source: 'Rhode Island Division of Taxation', sourceUrl: 'https://tax.ri.gov/' },
  { code: 'SC', name: 'South Carolina', rate: 5.00, tradeInTaxCredit: true, maxTaxCap: 500, docFeeStatus: 'Uncapped ($400 – $600 avg)', avgCombinedRate: 'Max $500 (Infrastructure Maintenance Fee)', notes: 'Infrastructure Maintenance Fee (IMF) of 5.00% capped at a statutory maximum of $500 (S.C. Code § 56-3-627). Trade-in credit applies before cap.', source: 'South Carolina Department of Motor Vehicles', sourceUrl: 'https://www.scdmvonline.com/' },
  { code: 'SD', name: 'South Dakota', rate: 4.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($150 – $300 avg)', avgCombinedRate: '4.00%', source: 'South Dakota Department of Revenue', sourceUrl: 'https://dor.sd.gov/' },
  { code: 'TN', name: 'Tennessee', rate: 7.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($500 – $700 avg)', avgCombinedRate: '8.50% – 9.75%', source: 'Tennessee Department of Revenue', sourceUrl: 'https://www.tn.gov/revenue.html' },
  { code: 'TX', name: 'Texas', rate: 6.25, tradeInTaxCredit: true, docFeeCap: 150, docFeeStatus: 'Capped at $150', avgCombinedRate: '6.25%', notes: 'Motor Vehicle Sales Tax 6.25% (Tex. Tax Code § 152.002). Trade-in value directly reduces taxable sales price.', source: 'Texas Comptroller of Public Accounts', sourceUrl: 'https://comptroller.texas.gov/' },
  { code: 'UT', name: 'Utah', rate: 6.85, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $450 avg)', avgCombinedRate: '6.85% – 7.25%', source: 'Utah State Tax Commission', sourceUrl: 'https://tax.utah.gov/' },
  { code: 'VT', name: 'Vermont', rate: 6.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($300 – $500 avg)', avgCombinedRate: '6.00%', source: 'Vermont Department of Taxes', sourceUrl: 'https://tax.vermont.gov/' },
  { code: 'VA', name: 'Virginia (SUT)', rate: 4.15, tradeInTaxCredit: false, docFeeStatus: 'Uncapped ($500 – $800 avg)', avgCombinedRate: '4.15% (Sales and Use Tax)', notes: 'Motor Vehicle Sales and Use Tax (SUT) 4.15% levied on gross sales price; no trade-in deduction allowed (Va. Code § 58.1-2402).', source: 'Virginia Department of Motor Vehicles', sourceUrl: 'https://www.dmv.virginia.gov/' },
  { code: 'WA', name: 'Washington', rate: 6.50, tradeInTaxCredit: true, docFeeCap: 200, docFeeStatus: 'Capped at $200', avgCombinedRate: '8.00% – 10.60%', notes: 'State rate 6.50% (+0.3% motor vehicle tax). Trade-in credit allowed.', source: 'Washington Department of Revenue', sourceUrl: 'https://dor.wa.gov/' },
  { code: 'WV', name: 'West Virginia', rate: 6.00, tradeInTaxCredit: true, docFeeCap: 175, docFeeStatus: 'Capped at $175', avgCombinedRate: '6.00%', source: 'West Virginia State Tax Department', sourceUrl: 'https://tax.wv.gov/' },
  { code: 'WI', name: 'Wisconsin', rate: 5.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $350 avg)', avgCombinedRate: '5.00% – 5.60%', source: 'Wisconsin Department of Revenue', sourceUrl: 'https://www.revenue.wi.gov/' },
  { code: 'WY', name: 'Wyoming', rate: 4.00, tradeInTaxCredit: true, docFeeStatus: 'Uncapped ($200 – $400 avg)', avgCombinedRate: '4.00% – 6.00%', source: 'Wyoming Department of Revenue', sourceUrl: 'https://revenue.wyo.gov/' }
];
