# Tax Year 2026 Official Evidence Record & Legal Compliance Audit

**Jurisdiction**: United States (Federal & 50 States + District of Columbia)  
**Supported Tax Year**: **2026 ONLY**  
**Effective Date**: January 1, 2026  
**Status**: Independently verified against official publications and statutory code. Years 2024, 2025, and 2027 are unverified and strictly rejected across the calculation engine, direct API calls, URL parameters, and UI controls.

---

## Part 1: Federal Statutory Tax Rules & Parameters (Tax Year 2026)

| Parameter | 2026 Verified Value | Statutory / Official Document Title | Official Source URL | Relevant Section / Page | Engine Reference | Test Reference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Federal Standard Deduction (Single)** | **$16,100** | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.16(1), Table 1 | `src/usFinancialConfig.ts:464` | `test_engine.ts` Case 1.9 |
| **Federal Standard Deduction (MFJ)** | **$32,200** | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.16(1), Table 2 | `src/usFinancialConfig.ts:470` | `test_engine.ts` Case 1.10 |
| **Federal Standard Deduction (MFS)** | **$16,100** | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.16(1), Table 4 | `src/usFinancialConfig.ts:476` | `test_engine.ts` Case 1.10 |
| **Federal Standard Deduction (HOH)** | **$24,150** | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.16(1), Table 3 | `src/usFinancialConfig.ts:482` | `test_engine.ts` Case 1.10 |
| **Federal Tax Brackets (Single)** | 10% ($0), 12% ($12,400), 22% ($50,400), 24% ($105,700), 32% ($201,775), 35% ($256,225), 37% ($640,600+) | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.01, Table 1 | `src/usFinancialConfig.ts:490` | `test_engine.ts` Case 1.9 |
| **Federal Tax Brackets (MFJ)** | 10% ($0), 12% ($24,800), 22% ($100,800), 24% ($211,400), 32% ($403,550), 35% ($512,450), 37% ($768,700+) | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.01, Table 2 | `src/usFinancialConfig.ts:504` | `test_engine.ts` Case 1.10 |
| **Federal Tax Brackets (MFS)** | 10% ($0), 12% ($12,400), 22% ($50,400), 24% ($105,700), 32% ($201,775), 35% ($256,225), 37% ($384,350+) | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.01, Table 4 | `src/usFinancialConfig.ts:518` | `test_engine.ts` Case 1.10 |
| **Federal Tax Brackets (HOH)** | 10% ($0), 12% ($17,700), 22% ($67,450), 24% ($105,700), 32% ($201,775), 35% ($256,200), 37% ($640,600+) | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.01, Table 3 | `src/usFinancialConfig.ts:532` | `test_engine.ts` Case 1.10 |
| **Social Security (OASDI) Tax Rate** | **6.2%** | Internal Revenue Code § 3101(a) | https://www.irs.gov/taxtopics/tc751 | IRC § 3101(a) | `src/engine.ts:251` | `test_engine.ts` Case 1.8 |
| **Social Security Wage Base Cap** | **$184,500** (Max tax: $11,439.00) | SSA 2026 OASDI Contribution Base Release | https://www.ssa.gov/oact/cola/cbb.html | COLA / OASDI Cap Fact Sheet | `src/usFinancialConfig.ts:553` | `test_engine.ts` Case 1.8 |
| **Medicare (HI) Base Tax Rate** | **1.45%** (Uncapped) | Internal Revenue Code § 3101(b)(1) | https://www.irs.gov/taxtopics/tc751 | IRC § 3101(b)(1) | `src/engine.ts:256` | `test_engine.ts` Case 1.2 |
| **Additional Medicare Tax** | **0.9%** (over $200k Single/HOH, $250k MFJ, $125k MFS) | Internal Revenue Code § 3101(b)(2) | https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax | IRC § 3101(b)(2) / Form 8959 | `src/engine.ts:261` | `test_engine.ts` Case 1.2 |
| **401(k) / 403(b) Elective Deferral** | **$24,500** | IRS Notice 2025-67 | https://www.irs.gov/pub/irs-drop/n-25-67.pdf | Section 3, IRC § 402(g) | `src/usFinancialConfig.ts:596` | `test_engine.ts` Case 1.11 |
| **401(k) Age 50+ Catch-Up** | **$8,000** (Combined: $32,500) | IRS Notice 2025-67 | https://www.irs.gov/pub/irs-drop/n-25-67.pdf | Section 3, IRC § 414(v) | `src/usFinancialConfig.ts:602` | `test_engine.ts` Case 1.11 |
| **401(k) Age 60-63 Special Catch-Up** | **$11,250** (Combined: $35,750) | SECURE 2.0 Act § 109 / IRS Notice 2025-67 | https://www.irs.gov/pub/irs-drop/n-25-67.pdf | IRC § 414(v)(2)(E) | `src/usFinancialConfig.ts:608` | `test_engine.ts` Case 1.11 |
| **Traditional & Roth IRA Limit** | **$7,500** | IRS Notice 2025-67 | https://www.irs.gov/pub/irs-drop/n-25-67.pdf | Section 3, IRC § 219(b)(5) | `src/usFinancialConfig.ts:614` | `test_engine.ts` Case 1.11 |
| **IRA Age 50+ Catch-Up** | **$1,100** (Combined: $8,600) | IRS Notice 2025-67 | https://www.irs.gov/pub/irs-drop/n-25-67.pdf | Section 3, IRC § 219(b)(5)(B) | `src/usFinancialConfig.ts:620` | `test_engine.ts` Case 1.11 |
| **HSA Limit (Self-Only)** | **$4,400** | IRS Revenue Procedure 2025-25 / 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | IRC § 223(b)(2)(A) | `src/usFinancialConfig.ts:626` | `test_engine.ts` Case 1.11 |
| **HSA Limit (Family)** | **$8,750** | IRS Revenue Procedure 2025-25 / 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | IRC § 223(b)(2)(B) | `src/usFinancialConfig.ts:632` | `test_engine.ts` Case 1.11 |
| **Healthcare FSA Limit** | **$3,400** | IRS Revenue Procedure 2025-32 | https://www.irs.gov/pub/irs-drop/rp-25-32.pdf | § 3.18, IRC § 125(i) | `src/usFinancialConfig.ts:638` | `test_engine.ts` Case 1.11 |

---

## Part 2: State-by-State Statutory Rules (All 50 States + District of Columbia)

| State / Code | Tax Regime | 2026 Statutory Rate / Structure | 2026 Standard Deduction (Single/MFJ) | Statutory Authority / Official Source | Official Source URL | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Alabama (AL)** | Progressive | 2.0% ($0), 4.0% ($500), 5.0% ($3,000+) | $3,000 / $8,500 | Ala. Code § 40-18-5 | https://revenue.alabama.gov/ | Verified |
| **Alaska (AK)** | None | **0.0%** (No state individual income tax) | $0 / $0 | Alaska Stat. Title 43 | https://tax.alaska.gov/ | Verified |
| **Arizona (AZ)** | Flat | **2.50%** Flat rate | $16,100 / $32,200 (Conforms to federal) | A.R.S. § 43-1011 | https://azdor.gov/ | Verified |
| **Arkansas (AR)** | Progressive | 0% to 3.7% (Top rate reduced to 3.7% effective 2026) | $2,470 / $4,940 | Ark. Code Ann. § 26-51-201 / 2026 Legislation | https://www.dfa.arkansas.gov/ | Verified |
| **California (CA)** | Progressive | 1.0% to 12.3% + 1.0% Mental Health Surtax over $1M (Total 13.3%) | $5,540 / $11,080 | Cal. Rev. & Tax. Code § 17041, § 17043 | https://www.ftb.ca.gov/ | Verified |
| **Colorado (CO)** | Flat | **4.40%** Flat rate | $16,100 / $32,200 (Conforms to federal) | Colo. Rev. Stat. § 39-22-104 | https://tax.colorado.gov/ | Verified |
| **Connecticut (CT)** | Progressive | 2.0% to 6.99% (7 brackets) | $15,000 / $24,000 | Conn. Gen. Stat. § 12-700 | https://portal.ct.gov/drs | Verified |
| **Delaware (DE)** | Progressive | 2.2% to 6.6% (6 brackets) | $3,250 / $6,500 | 30 Del. C. § 1102 | https://revenue.delaware.gov/ | Verified |
| **District of Columbia (DC)** | Progressive | 4.0% to 10.75% (7 brackets) | $16,100 / $32,200 (Conforms to federal) | D.C. Code § 47-1806.03 | https://otr.cfo.dc.gov/ | Verified |
| **Florida (FL)** | None | **0.0%** (Constitutional prohibition) | $0 / $0 | Fla. Const. art. VII, § 5 | https://floridarevenue.com/ | Verified |
| **Georgia (GA)** | Flat | **4.99%** Flat rate (Reduced from 5.19% via HB 463 for 2026) | $15,000 / $30,000 | O.C.G.A. § 48-7-20 / HB 463 | https://dor.georgia.gov/ | Verified |
| **Hawaii (HI)** | Progressive | 1.4% to 11.0% (12 brackets) | $8,000 / $16,000 (Act 163 expansion) | HRS § 235-51 / Act 163 | https://tax.hawaii.gov/ | Verified |
| **Idaho (ID)** | Flat | **5.30%** Flat rate | $16,100 / $32,200 (Conforms to federal) | Idaho Code § 63-3024 / H 521 | https://tax.idaho.gov/ | Verified |
| **Illinois (IL)** | Flat | **4.95%** Flat rate | $2,775 / $5,550 (Standard exemption) | 35 ILCS 5/201 | https://tax.illinois.gov/ | Verified |
| **Indiana (IN)** | Flat | **2.95%** Flat rate (Reduced from 3.0% on Jan 1, 2026 per HEA 1001) | $1,000 / $2,000 (Personal exemption) | Ind. Code § 6-3-2-1 / HEA 1001 | https://www.in.gov/dor/ | Verified |
| **Iowa (IA)** | Flat | **3.80%** Flat rate (SF 2442 consolidated flat tax) | $16,100 / $32,200 (Conforms to federal) | Iowa Code § 422.5A / SF 2442 | https://tax.iowa.gov/ | Verified |
| **Kansas (KS)** | Progressive | 5.2% and 5.58% (SB 1 tax restructuring) | $3,605 / $8,240 | K.S.A. § 79-32,110 / SB 1 | https://www.ksrevenue.gov/ | Verified |
| **Kentucky (KY)** | Flat | **3.50%** Flat rate (HB 1 / HB 8 trigger met effective Jan 1, 2026) | $3,360 / $3,360 | KRS § 141.020 / HB 1 (2025) | https://revenue.ky.gov/ | Verified |
| **Louisiana (LA)** | Flat | **3.00%** Flat rate (2024 3rd Spec. Sess. Act 1) | $12,500 / $25,000 | La. R.S. 47:32 / Act 1 | https://revenue.louisiana.gov/ | Verified |
| **Maine (ME)** | Progressive | 5.8%, 6.75%, 7.15% (3 brackets) | $15,300 / $30,600 | 36 M.R.S. § 5111 | https://www.maine.gov/revenue/ | Verified |
| **Maryland (MD)** | Progressive | 2.0% to 5.75% (8 brackets) | $3,400 / $6,800 | Md. Code Ann., Tax-Gen. § 10-105 | https://www.marylandtaxes.gov/ | Verified |
| **Massachusetts (MA)** | Progressive / Surtax | **5.00%** flat base + **4.00%** Fair Share surtax over $1,053,750 | $4,400 / $8,800 | Mass. Gen. Laws ch. 62, § 4 | https://www.mass.gov/dor/ | Verified |
| **Michigan (MI)** | Flat | **4.25%** Flat rate | $5,600 / $11,200 (Personal exemption) | MCL § 206.51 | https://www.michigan.gov/treasury | Verified |
| **Minnesota (MN)** | Progressive | 5.35% to 9.85% (4 brackets) | $15,300 / $30,600 | Minn. Stat. § 290.06 | https://www.revenue.state.mn.us/ | Verified |
| **Mississippi (MS)** | Flat | **4.00%** Flat rate (HB 531 phased flat tax) | $2,300 / $4,600 | Miss. Code Ann. § 27-7-5 / HB 531 | https://www.dor.ms.gov/ | Verified |
| **Missouri (MO)** | Progressive | 2.0% to 4.7% (5 brackets) | $16,100 / $32,200 (Conforms to federal) | Mo. Rev. Stat. § 143.011 | https://dor.mo.gov/ | Verified |
| **Montana (MT)** | Progressive | 4.70% ($0), 5.65% ($47,500+) (SB 121 rate reduction for 2026) | $16,100 / $32,200 (Conforms to federal) | Mont. Code Ann. § 15-30-2103 / SB 121 | https://mtrevenue.gov/ | Verified |
| **Nebraska (NE)** | Progressive | 2.46% to 5.20% (LB 753 / LB 34 scheduled reduction) | $8,850 / $17,700 | Neb. Rev. Stat. § 77-2715.03 | https://revenue.nebraska.gov/ | Verified |
| **Nevada (NV)** | None | **0.0%** (Constitutional prohibition) | $0 / $0 | Nev. Const. art. X, § 1 | https://tax.nv.gov/ | Verified |
| **New Hampshire (NH)** | None | **0.0%** on wage income (Interest/Dividends tax repealed for 2026) | $0 / $0 | N.H. Rev. Stat. Ann. § 77:1 | https://www.revenue.nh.gov/ | Verified |
| **New Jersey (NJ)** | Progressive | 1.4% to 10.75% (7 brackets) | $1,000 / $2,000 (Exemption) | N.J. Stat. Ann. § 54A:2-1 | https://www.state.nj.us/treasury/taxation/ | Verified |
| **New Mexico (NM)** | Progressive | 1.5% to 5.9% (HB 252 restructuring) | $16,100 / $32,200 (Conforms to federal) | N.M. Stat. Ann. § 7-2-7 / HB 252 | https://www.tax.newmexico.gov/ | Verified |
| **New York (NY)** | Progressive | 4.0% to 10.9% (9 brackets) | $8,000 / $16,050 | N.Y. Tax Law § 601 | https://www.tax.ny.gov/ | Verified |
| **North Carolina (NC)** | Flat | **3.99%** Flat rate (Reduced to 3.99% on Jan 1, 2026 per SB 105) | $12,750 / $25,500 | N.C. Gen. Stat. § 105-153.7 / SB 105 | https://www.ncdor.gov/ | Verified |
| **North Dakota (ND)** | Progressive | 0% ($0-$44.7k), 1.95% ($44.7k), 2.50% ($225.9k+) | $15,750 / $31,500 | N.D. Cent. Code § 57-38-30.3 | https://www.tax.nd.gov/ | Verified |
| **Ohio (OH)** | Progressive | **0.0%** ($0 - $26,050), **2.75%** ($26,050+) (HB 33 consolidation) | $2,400 / $4,800 | Ohio Rev. Code § 5747.02 / HB 33 | https://tax.ohio.gov/ | Verified |
| **Oklahoma (OK)** | Progressive | 0.25% to 4.75% (6 brackets) | $6,350 / $12,700 | 68 O.S. § 2355 / HB 2954 | https://oklahoma.gov/tax.html | Verified |
| **Oregon (OR)** | Progressive | 4.75%, 6.75%, 8.75%, 9.9% (4 brackets) | $2,910 / $5,820 | ORS § 316.037 | https://www.oregon.gov/dor/ | Verified |
| **Pennsylvania (PA)** | Flat | **3.07%** Flat rate | $0 / $0 (No standard deduction) | 72 P.S. § 7302 | https://www.revenue.pa.gov/ | Verified |
| **Rhode Island (RI)** | Progressive | 3.75%, 4.75%, 5.99% (3 brackets) | $11,200 / $22,400 | R.I. Gen. Laws § 44-30-2.6 | https://tax.ri.gov/ | Verified |
| **South Carolina (SC)** | Progressive | 0% ($0-$3,460), 3.0% ($3,460), 6.2% ($17,330+) | $15,000 / $30,000 | S.C. Code Ann. § 12-6-510 | https://dor.sc.gov/ | Verified |
| **South Dakota (SD)** | None | **0.0%** (Constitutional prohibition) | $0 / $0 | S.D. Const. art. XI, § 2 | https://dor.sd.gov/ | Verified |
| **Tennessee (TN)** | None | **0.0%** (Constitutional Hall Income Tax repeal) | $0 / $0 | Tenn. Const. art. II, § 28 | https://www.tn.gov/revenue.html | Verified |
| **Texas (TX)** | None | **0.0%** (Constitutional ban on personal income tax) | $0 / $0 | Tex. Const. art. VIII, § 24-a | https://comptroller.texas.gov/ | Verified |
| **Utah (UT)** | Flat | **4.45%** Flat rate (Reduced to 4.45% effective Jan 1, 2026 per SB 60) | $16,100 / $32,200 (Taxpayer tax credit basis) | Utah Code Ann. § 59-10-104 / SB 60 | https://tax.utah.gov/ | Verified |
| **Vermont (VT)** | Progressive | 3.35%, 6.6%, 7.6%, 8.75% (4 brackets) | $7,650 / $15,300 | 32 V.S.A. § 5822 | https://tax.vermont.gov/ | Verified |
| **Virginia (VA)** | Progressive | 2.0%, 3.0%, 5.0%, 5.75% (4 brackets) | $8,500 / $17,000 | Va. Code Ann. § 58.1-320 | https://www.tax.virginia.gov/ | Verified |
| **Washington (WA)** | None | **0.0%** on earned wages | $0 / $0 | Wash. Rev. Code § 82.04 | https://dor.wa.gov/ | Verified |
| **West Virginia (WV)** | Progressive | 2.36%, 3.15%, 3.54%, 4.72%, 5.12% | $10,000 / $20,000 | W. Va. Code § 11-21-4e / HB 252 | https://tax.wv.gov/ | Verified |
| **Wisconsin (WI)** | Progressive | 3.50%, 4.40%, 5.30%, 7.65% (4 brackets) | $13,960 / $27,920 | Wis. Stat. § 71.06 | https://www.revenue.wi.gov/ | Verified |
| **Wyoming (WY)** | None | **0.0%** (No state individual income tax) | $0 / $0 | Wyo. Const. art. 15 | https://revenue.wyo.gov/ | Verified |

---

## Part 3: Year-Restriction Enforcement Architecture

1. **Engine Level**:
   - `calculateComprehensiveTax`: If `input.year !== undefined && input.year !== 2026`, throws `CalculationError('UNSUPPORTED_YEAR', 'Unsupported tax year: ... WowCalc supports Tax Year 2026 only for US federal and state income tax calculations.')`.
   - `calculateFicaTax`: If `year !== 2026`, throws `CalculationError('UNSUPPORTED_YEAR', 'Unsupported tax year: ...')`.
   - `calculateSalary`: If `input.year !== undefined && input.year !== 2026`, throws `CalculationError('UNSUPPORTED_YEAR', 'Unsupported tax year: ...')` (enforced unconditionally, both in statutory engine and flat override modes).
   - `calculateRetirement`: If `input.year !== undefined && input.year !== 2026`, throws `CalculationError('UNSUPPORTED_YEAR', 'Unsupported tax year: ...')`.
   - `getStateConfig`: If `year !== 2026`, throws `CalculationError('UNSUPPORTED_YEAR', 'Unsupported tax year: ...')`.
   - **No Silent Fallback**: The engine never silently falls back to 2026 when an unsupported year (such as 2024, 2025, or 2027) is explicitly passed.

2. **UI & Route Level**:
   - `SUPPORTED_TAX_YEARS`: Defined strictly as `[2026] as const`.
   - `DEFAULT_TAX_YEAR`: Set to `2026`.
   - All dropdowns and button groups in `TaxCalculatorModule` and `SalaryCalculatorModule` show 2026 as the active, verified default.
   - 2024 and 2025 are hidden/disabled in selectors.
   - 2027 is not enabled.
   - URL search parameter inspection (`?year=...` or `?taxYear=...`): If an unsupported year is passed via URL query, the UI displays a validation banner alerting the user that the requested year is unsupported and halting execution for that year rather than silently calculating.
