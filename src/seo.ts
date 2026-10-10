/**
 * SEO & Search-Engine-Friendly URL Configuration
 * WCAG 2.1 AA & Schema.org Compliant Metadata Engine
 */

export interface CalculatorConfig {
  id: string;
  slug: string; // Search engine friendly URL path (e.g. '/mortgage-calculator')
  label: string;
  category: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const HOME_CONFIG: CalculatorConfig = {
  id: 'home',
  slug: '/',
  label: 'Home',
  category: 'Overview',
  shortTitle: 'ApexFinance Suite',
  metaTitle: 'ApexFinance – Free Industrial-Grade Financial Calculators & Wealth Engines',
  metaDescription: 'High-precision financial computation platform for mortgages, investments, retirement FIRE planning, personal loans, auto financing, income taxes, and compound interest.',
  keywords: 'financial calculators, mortgage calculator, loan calculator, retirement calculator, FIRE calculator, compound interest, tax calculator, amortization schedule'
};

export const CALCULATORS_CONFIG: CalculatorConfig[] = [
  {
    id: 'mortgage',
    slug: '/mortgage-calculator',
    label: 'Mortgage & EMI',
    category: 'Mortgage & Real Estate',
    shortTitle: 'Mortgage & EMI Calculator',
    metaTitle: 'Mortgage & EMI Calculator – PITI Amortization & Extra Payments | ApexFinance',
    metaDescription: 'Calculate monthly mortgage payments, escrow taxes, insurance, and accelerated payoff schedules with comprehensive amortization analytics.',
    keywords: 'mortgage calculator, EMI calculator, home loan payment, amortization schedule, PITI calculator, extra payments mortgage'
  },
  {
    id: 'loan',
    slug: '/loan-calculator',
    label: 'Loan Calculator',
    category: 'Loans & Credit',
    shortTitle: 'Personal Loan Calculator',
    metaTitle: 'Loan Calculator – Monthly Payment, Interest & Fee Estimator | ApexFinance',
    metaDescription: 'Estimate monthly loan payments, total interest costs, and origination fees for personal, business, or installment loans with real-time analytics.',
    keywords: 'loan calculator, personal loan calculator, loan payment calculator, loan interest, installment loan, loan origination fee'
  },
  {
    id: 'auto',
    slug: '/auto-loan-calculator',
    label: 'Auto Loan',
    category: 'Loans & Credit',
    shortTitle: 'Auto Loan Calculator',
    metaTitle: 'Auto Loan Calculator – Car Payment, Sales Tax & Trade-In | ApexFinance',
    metaDescription: 'Calculate monthly auto financing payments, factoring in vehicle price, trade-in value, down payment, sales tax, and dealer documentation fees.',
    keywords: 'auto loan calculator, car payment calculator, vehicle financing, car loan interest, auto loan amortization, trade in value'
  },
  {
    id: 'interest',
    slug: '/interest-calculator',
    label: 'Interest',
    category: 'Investing & Wealth',
    shortTitle: 'Interest Calculator',
    metaTitle: 'Interest Calculator – Simple & Compound Interest with APY | ApexFinance',
    metaDescription: 'Calculate simple and compound interest gains across daily, monthly, quarterly, and annual compounding with regular monthly additions.',
    keywords: 'interest calculator, compound interest calculator, simple interest, effective APY, daily compounding, interest yield'
  },
  {
    id: 'payment',
    slug: '/payment-calculator',
    label: 'Payment',
    category: 'Mortgage & Real Estate',
    shortTitle: 'Payment & Affordability Calculator',
    metaTitle: 'Payment Calculator – Loan Payment & Affordability Solver | ApexFinance',
    metaDescription: 'Calculate periodic payments or solve for maximum affordable loan principal across monthly, bi-weekly, and weekly payment schedules.',
    keywords: 'payment calculator, loan affordability calculator, periodic payment, bi-weekly payment, weekly loan payment'
  },
  {
    id: 'retirement',
    slug: '/retirement-calculator',
    label: 'Retirement (FIRE)',
    category: 'Investing & Wealth',
    shortTitle: 'Retirement & FIRE Calculator',
    metaTitle: 'Retirement & FIRE Calculator – Safe Withdrawal & Net Worth | ApexFinance',
    metaDescription: 'Project your financial independence retirement age (FIRE), target net worth, and portfolio growth based on savings and withdrawal rates.',
    keywords: 'retirement calculator, FIRE calculator, financial independence retire early, safe withdrawal rate, nest egg, 4 percent rule'
  },
  {
    id: 'amortization',
    slug: '/amortization-calculator',
    label: 'Amortization',
    category: 'Mortgage & Real Estate',
    shortTitle: 'Amortization Calculator',
    metaTitle: 'Amortization Calculator – Full Loan Schedule & Prepayment | ApexFinance',
    metaDescription: 'Generate interactive annual and monthly amortization tables showing principal reduction, cumulative interest, and prepayment acceleration.',
    keywords: 'amortization calculator, amortization schedule, loan amortization table, principal and interest, extra principal payments'
  },
  {
    id: 'investment',
    slug: '/investment-calculator',
    label: 'Investment & SIP',
    category: 'Investing & Wealth',
    shortTitle: 'Investment & SIP Calculator',
    metaTitle: 'Investment & SIP Calculator – Compound Growth & Wealth Planning | ApexFinance',
    metaDescription: 'Simulate wealth accumulation, recurring monthly contributions, and compound investment returns over multi-year horizons.',
    keywords: 'investment calculator, SIP calculator, systematic investment plan, wealth calculator, compound return, portfolio growth'
  },
  {
    id: 'inflation',
    slug: '/inflation-calculator',
    label: 'Inflation',
    category: 'Income, Taxes & Economy',
    shortTitle: 'Inflation Calculator',
    metaTitle: 'Inflation Calculator – Future Cost & Purchasing Power Erosion | ApexFinance',
    metaDescription: 'Calculate future equivalent costs and observe historical and prospective purchasing power erosion over custom time horizons.',
    keywords: 'inflation calculator, purchasing power calculator, cost of living, inflation rate, future money value, CPI calculator'
  },
  {
    id: 'finance',
    slug: '/finance-calculator',
    label: 'Finance TVM',
    category: 'Income, Taxes & Economy',
    shortTitle: 'TVM Finance Calculator',
    metaTitle: 'Finance Calculator – Time Value of Money Solver (PV, FV, PMT) | ApexFinance',
    metaDescription: 'Solve for Present Value, Future Value, Periodic Payment, or Number of Periods using classical Time Value of Money cashflow principles.',
    keywords: 'finance calculator, TVM calculator, time value of money, present value, future value, PMT solver, financial math'
  },
  {
    id: 'tax',
    slug: '/income-tax-calculator',
    label: 'Income Tax',
    category: 'Income, Taxes & Economy',
    shortTitle: 'Income Tax Calculator',
    metaTitle: 'Income Tax Calculator – Federal Brackets, FICA & Take-Home | ApexFinance',
    metaDescription: 'Estimate your federal income tax, state taxes, FICA withholding, and net paycheck take-home pay with pre-tax deduction modeling.',
    keywords: 'income tax calculator, salary paycheck calculator, federal tax brackets, FICA tax, effective tax rate, net take home pay'
  },
  {
    id: 'compound',
    slug: '/compound-interest-calculator',
    label: 'Compound Interest',
    category: 'Investing & Wealth',
    shortTitle: 'Compound Interest Calculator',
    metaTitle: 'Compound Interest Calculator – Daily, Monthly & Annual Growth | ApexFinance',
    metaDescription: 'Compute exponential compound interest growth with initial deposits, recurring additions, and multiple compounding frequencies.',
    keywords: 'compound interest calculator, compounding frequency, compound interest formula, interest on interest, wealth projection'
  },
  {
    id: 'salary',
    slug: '/salary-calculator',
    label: 'Salary',
    category: 'Income, Taxes & Economy',
    shortTitle: 'Salary & Wage Calculator',
    metaTitle: 'Salary to Hourly Calculator – Gross & Net Wage Conversion | ApexFinance',
    metaDescription: 'Convert salary rates between hourly, daily, weekly, bi-weekly, monthly, and annual amounts with overtime and tax deduction estimates.',
    keywords: 'salary calculator, hourly to salary, wage calculator, paycheck conversion, annual salary to hourly, overtime pay'
  },
  {
    id: 'rate',
    slug: '/interest-rate-calculator',
    label: 'Interest Rate',
    category: 'Loans & Credit',
    shortTitle: 'Interest Rate (APR) Calculator',
    metaTitle: 'Interest Rate (APR) Calculator – True Loan Rate Solver | ApexFinance',
    metaDescription: 'Reverse-solve the exact annual percentage rate (APR) from loan amount, monthly payment, term, and upfront financing fees.',
    keywords: 'interest rate calculator, APR calculator, calculate APR, loan rate solver, true interest rate, effective APR'
  },
  {
    id: 'sales-tax',
    slug: '/sales-tax-calculator',
    label: 'Sales Tax',
    category: 'Income, Taxes & Economy',
    shortTitle: 'Sales Tax Calculator',
    metaTitle: 'Sales Tax Calculator – Add Tax or Reverse Extract | ApexFinance',
    metaDescription: 'Calculate sales tax, total purchase cost, or reverse extract pre-tax price from receipt totals with combined state and local rates.',
    keywords: 'sales tax calculator, reverse sales tax, tax extraction, state sales tax, local sales tax, sales discount tax'
  },
  {
    id: 'debt',
    slug: '/debt-payoff-calculator',
    label: 'Debt Snowball',
    category: 'Loans & Credit',
    shortTitle: 'Debt Payoff Calculator',
    metaTitle: 'Debt Payoff Calculator – Snowball vs Avalanche Accelerator | ApexFinance',
    metaDescription: 'Accelerate debt elimination by comparing Debt Snowball and Debt Avalanche payoff strategies with monthly extra payments.',
    keywords: 'debt payoff calculator, debt snowball, debt avalanche, credit card payoff, debt free calculator, extra payment debt'
  }
];

export function getCalculatorById(id: string): CalculatorConfig | undefined {
  if (id === 'home') return HOME_CONFIG;
  return CALCULATORS_CONFIG.find(c => c.id === id);
}

export function getCalculatorByPath(pathname: string, hash: string, search: string): CalculatorConfig | undefined {
  // 1. Try search param ?calc=... or ?calculator=...
  if (search) {
    const params = new URLSearchParams(search);
    const calcParam = params.get('calc') || params.get('calculator') || params.get('tool') || params.get('id');
    if (calcParam) {
      if (calcParam === 'home' || calcParam === 'root') return HOME_CONFIG;
      const match = CALCULATORS_CONFIG.find(c => 
        c.id === calcParam || 
        c.slug === `/${calcParam}` || 
        c.slug.replace(/^\//, '') === calcParam ||
        calcParam.includes(c.id)
      );
      if (match) return match;
    }
  }

  // 2. Try hash #/mortgage-calculator or #mortgage or #/calculator/mortgage
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '').replace(/\/$/, '');
    if (cleanHash === '' || cleanHash === 'home') return HOME_CONFIG;
    const match = CALCULATORS_CONFIG.find(c => 
      c.id === cleanHash || 
      c.slug === `/${cleanHash}` || 
      c.slug === cleanHash ||
      cleanHash === `calculator/${c.id}` ||
      cleanHash === c.id.replace(/-/g, '') ||
      cleanHash.includes(c.id)
    );
    if (match) return match;
  }

  // 3. Try clean pathname /mortgage-calculator, /calculator/mortgage, /mortgage, etc.
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  if (cleanPath === '/' || cleanPath === '') {
    return HOME_CONFIG;
  }

  // Exact slug match (e.g. /mortgage-calculator)
  let match = CALCULATORS_CONFIG.find(c => c.slug === cleanPath);
  if (match) return match;

  // Pattern /calculator/:id (e.g. /calculator/mortgage or /calculator/interest)
  match = CALCULATORS_CONFIG.find(c => 
    cleanPath === `/calculator/${c.id}` || 
    cleanPath === `/calculator${c.slug}` ||
    cleanPath === `/${c.id}` ||
    cleanPath === `/${c.id}-calculator`
  );
  if (match) return match;

  // Substring or trailing match
  match = CALCULATORS_CONFIG.find(c => 
    cleanPath.endsWith(c.slug) || 
    cleanPath.endsWith(`/${c.id}`)
  );
  if (match) return match;

  return HOME_CONFIG;
}

/**
 * Updates DOM head metadata dynamically for search engines and social cards
 */
export function syncSEOMetadata(config: CalculatorConfig) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = config.metaTitle;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.metaDescription);

  // 3. OpenGraph tags
  const setMeta = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + config.slug : config.slug;

  setMeta('og:title', config.metaTitle);
  setMeta('og:description', config.metaDescription);
  setMeta('og:url', currentUrl);
  setMeta('og:type', 'website');
  setMeta('twitter:title', config.metaTitle);
  setMeta('twitter:description', config.metaDescription);

  // 4. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', currentUrl);

  // 5. Schema.org JSON-LD Structured Data
  let scriptLd = document.getElementById('schema-ld-json') as HTMLScriptElement | null;
  if (!scriptLd) {
    scriptLd = document.createElement('script');
    scriptLd.id = 'schema-ld-json';
    scriptLd.type = 'application/ld+json';
    document.head.appendChild(scriptLd);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${currentUrl}#app`,
        "name": config.shortTitle,
        "url": currentUrl,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "description": config.metaDescription,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ApexFinance",
          "url": typeof window !== 'undefined' ? window.location.origin : ""
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": typeof window !== 'undefined' ? window.location.origin : ""
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": config.category,
            "item": typeof window !== 'undefined' ? `${window.location.origin}/#calculators` : ""
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": config.shortTitle,
            "item": currentUrl
          }
        ]
      }
    ]
  };

  scriptLd.textContent = JSON.stringify(structuredData, null, 2);
}
