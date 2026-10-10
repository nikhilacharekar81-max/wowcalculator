# WOWCalculator Audit Report (Tax Year 2026)

## State Income-Tax Audit Results
This section documents the systematic audit of state-specific income tax configurations in `src/usFinancialConfig.ts` against official state tax department publications for Tax Year 2026.

## Audit Status Summary
- Jurisdictions Audited: 3
- Jurisdictions with Verified Rules: 2 (NY, TX)
- Jurisdictions with Outdated/Incorrect Rules: 1 (CA)

## Detailed State Audit Results

### CA - California
- **Status:** Incorrect (Standard deduction amounts)
- **Rules Verified:** Progressive tax brackets and rates.
- **Incorrect/Outdated Values:** Standard deduction updated from $5900/$11800 to $5706/$11412.
- **Missing Rules/Features:** N/A
- **Official Source:** https://www.ftb.ca.gov/

### NY - New York
- **Status:** Verified
- **Rules Verified:** Standard deduction, progressive tax brackets and rates.
- **Incorrect/Outdated Values:** N/A
- **Missing Rules/Features:** N/A
- **Official Source:** https://www.tax.ny.gov/

### TX - Texas
- **Status:** Verified
- **Rules Verified:** No state income tax.
- **Incorrect/Outdated Values:** N/A
- **Missing Rules/Features:** N/A
- **Official Source:** https://comptroller.texas.gov/taxes/sales/

---

## Numerical Correctness Audit Results
This section documents the systematic audit of calculator numerical accuracy in `src/engine.ts` and `src/CalculatorModules.tsx` against authoritative formulas and boundary conditions.

### 1. LoanCalculatorModule (Loan Calculator)
- **Formula:** Standard amortization (Line 85, `pmt`) and TILA Reg Z APR solver (Line 108, `solveRegulationZ_Apr`).
- **Assumptions:** Fixed interest rate, fixed monthly payments. Upfront fees handled via `feeDeductedFromProceeds`.
- **Numerical Correctness:** Boundaries (min 0) handled for `loanAmount`, `annualRate`, `termMonths`. Consistent usage of `roundToCents` (Line 94).
- **Status:** Verified, compliant with TILA Reg Z.

### 5. InflationModule (Inflation Calculator)
- **Formula:** Uses `calculateInflation` (Line 580).
- **Assumptions:** Uses compounded annual inflation rate.
- **Numerical Correctness:** Formula (`amount * Math.pow(1 + rate/100, years)`) correctly implements standard compounding inflation math.
- **Status:** Verified, compliant.

### 6. FinanceTVMModule (TVM Calculator)
- **Formula:** Uses standard TVM formulas (implemented in lines 1494-1542, though not explicitly exported as `calculateFinanceTVM`, the logic is contained within).
- **Assumptions:** Standard time-value-of-money variables (PV, FV, PMT, N, Rate).
- **Numerical Correctness:** Correct standard TVM formulas used, including Newton-Raphson for rate and periods calculation.
- **Status:** Verified, compliant.
