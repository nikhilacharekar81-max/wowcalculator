import { calculateSalesTax } from '../engine';
import { getStateSalesTaxConfig, getAllStateSalesTaxConfigs } from '../config';
import { calculateComprehensiveTax } from '../../engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[SALES TAX TEST FAILED] ${message}`);
  }
}

export function runSalesTaxTests() {
  console.log('--- RUNNING DEDICATED SALES TAX 2026 TESTS ---');

  // Test 1: Fully taxable transaction
  const res1 = calculateSalesTax({
    amount: 100,
    mode: 'add_tax',
    stateRate: 6.00,
    localRate: 2.00,
    taxYear: 2026,
    stateCode: 'CA',
    itemType: 'general'
  });
  assert(res1.beforeTax === 100, 'Case 1.1: Pretax base equals 100');
  assert(res1.stateTax === 6.00, 'Case 1.2: State tax equals 6.00');
  assert(res1.localTax === 2.00, 'Case 1.3: Local tax equals 2.00');
  assert(res1.totalTax === 8.00, 'Case 1.4: Total tax equals 8.00');
  assert(res1.finalTotal === 108.00, 'Case 1.5: Final total equals 108.00');

  // Test 2: Prescription drug exemption (0% tax everywhere)
  const res2 = calculateSalesTax({
    amount: 50,
    mode: 'add_tax',
    stateRate: 7.00,
    localRate: 2.50,
    taxYear: 2026,
    stateCode: 'NY',
    itemType: 'prescription'
  });
  assert(res2.totalTax === 0, 'Case 2.1: Prescription drugs have $0 tax');
  assert(res2.finalTotal === 50, 'Case 2.2: Final total equals 50');

  // Test 3: Clothing threshold in New York ($110 limit)
  const res3a = calculateSalesTax({
    amount: 90,
    mode: 'add_tax',
    stateRate: 4.00,
    localRate: 4.52,
    taxYear: 2026,
    stateCode: 'NY',
    itemType: 'clothing'
  });
  assert(res3a.totalTax === 0, 'Case 3.1: NY clothing under $110 is tax-free');

  const res3b = calculateSalesTax({
    amount: 150,
    mode: 'add_tax',
    stateRate: 4.00,
    localRate: 4.52,
    taxYear: 2026,
    stateCode: 'NY',
    itemType: 'clothing'
  });
  assert(res3b.totalTax > 0, 'Case 3.2: NY clothing over $110 is taxable');

  // Test 4: Store vs Manufacturer Discounts
  const res4a = calculateSalesTax({
    amount: 100,
    mode: 'add_tax',
    stateRate: 6.00,
    localRate: 0,
    discountPercent: 20,
    discountType: 'store',
    taxYear: 2026,
    stateCode: 'TX'
  });
  assert(res4a.beforeTax === 80, 'Case 4.1: Store discount reduces taxable base to 80');
  assert(res4a.stateTax === 4.80, 'Case 4.2: Tax computed on discounted base (6% of 80 = 4.80)');

  const res4b = calculateSalesTax({
    amount: 100,
    mode: 'add_tax',
    stateRate: 6.00,
    localRate: 0,
    discountPercent: 20,
    discountType: 'manufacturer',
    taxYear: 2026,
    stateCode: 'TX'
  });
  assert(res4b.beforeTax === 100, 'Case 4.3: Manufacturer coupon taxes pre-coupon base (100)');
  assert(res4b.stateTax === 6.00, 'Case 4.4: Tax on pre-coupon base equals 6.00');

  // Test 5: Reverse Tax Extraction
  const res5 = calculateSalesTax({
    amount: 108.00,
    mode: 'extract_tax',
    stateRate: 6.00,
    localRate: 2.00,
    taxYear: 2026,
    stateCode: 'CA'
  });
  assert(res5.beforeTax === 100.00, 'Case 5.1: Extracted pre-tax base equals 100.00');
  assert(res5.totalTax === 8.00, 'Case 5.2: Extracted total tax equals 8.00');

  // Test 6: Strict Tax Year 2026 Enforcement
  let errorCaught = false;
  try {
    calculateSalesTax({
      amount: 100,
      mode: 'add_tax',
      stateRate: 6.00,
      localRate: 0,
      taxYear: 2025,
      stateCode: 'CA'
    });
  } catch (e: any) {
    if (e.message.includes('Unsupported tax year')) {
      errorCaught = true;
    }
  }
  assert(errorCaught, 'Case 6.1: Non-2026 year throws explicit error');

  // Test 7: Cross-Contamination Regression Tests
  const salesTaxBefore = calculateSalesTax({
    amount: 200,
    mode: 'add_tax',
    stateRate: 7.25,
    localRate: 1.5,
    taxYear: 2026,
    stateCode: 'CA'
  });

  const incomeRes1 = calculateComprehensiveTax({
    annualIncome: 100000,
    year: 2026,
    filingStatus: 'single',
    stateCode: 'CA'
  });

  const salesTaxAfter = calculateSalesTax({
    amount: 200,
    mode: 'add_tax',
    stateRate: 7.25,
    localRate: 1.5,
    taxYear: 2026,
    stateCode: 'CA'
  });

  assert(salesTaxBefore.finalTotal === salesTaxAfter.finalTotal, 'Case 7.1: Income tax execution does not contaminate sales tax outputs');

  const incomeResBefore = calculateComprehensiveTax({
    annualIncome: 80000,
    year: 2026,
    filingStatus: 'single',
    stateCode: 'IL'
  });

  calculateSalesTax({
    amount: 500,
    mode: 'add_tax',
    stateRate: 10.00,
    localRate: 3.00,
    taxYear: 2026,
    stateCode: 'IL'
  });

  const incomeResAfter = calculateComprehensiveTax({
    annualIncome: 80000,
    year: 2026,
    filingStatus: 'single',
    stateCode: 'IL'
  });

  assert(incomeResBefore.netIncome === incomeResAfter.netIncome, 'Case 7.2: Sales tax calculation does not contaminate income tax outputs');

  // Test 8: All 51 jurisdictions have configs
  const allConfigs = getAllStateSalesTaxConfigs(2026);
  assert(allConfigs.length === 51, 'Case 8.1: All 51 jurisdictions (50 states + DC) configured');

  // Test 9: Unrecognized state code should throw an error
  let errorCaught9 = false;
  try {
    calculateSalesTax({
      amount: 100,
      mode: 'add_tax',
      stateRate: 6.00,
      localRate: 0,
      taxYear: 2026,
      stateCode: 'ZZ' // Unrecognized
    });
  } catch (e: any) {
    if (e.message.includes('not supported')) {
      errorCaught9 = true;
    }
  }
  assert(errorCaught9, 'Case 9.1: Unrecognized state code throws explicit error');

  console.log('--- ALL SALES TAX TESTS PASSED SUCCESSFULLY ---');
}
