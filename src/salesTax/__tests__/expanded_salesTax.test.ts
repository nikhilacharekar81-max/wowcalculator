
import { calculateSalesTax } from '../engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[SALES TAX TEST FAILED] ${message}`);
  }
}

export function runExpandedSalesTaxTests() {
  console.log('--- RUNNING EXPANDED SALES TAX 2026 TESTS ---');

  // 1. Zero-tax cases (e.g., DE - Delaware)
  const res1 = calculateSalesTax({
    amount: 100,
    mode: 'add_tax',
    stateRate: 0.00,
    localRate: 0.00,
    taxYear: 2026,
    stateCode: 'DE'
  });
  assert(res1.totalTax === 0, 'Test 1.1: DE has 0 tax');

  // 2. High-rate case (e.g., LA - Louisiana)
  const res2 = calculateSalesTax({
    amount: 100,
    mode: 'add_tax',
    stateRate: 4.45,
    localRate: 5.10,
    taxYear: 2026,
    stateCode: 'LA'
  });
  assert(res2.totalTax === 9.55, `Test 2.1: LA expected 9.55, got ${res2.totalTax}`);

  // 3. Large transaction amount
  const res3 = calculateSalesTax({
    amount: 1000000,
    mode: 'add_tax',
    stateRate: 5.00,
    localRate: 1.00,
    taxYear: 2026,
    stateCode: 'CA'
  });
  assert(res3.totalTax === 60000, `Test 3.1: Large transaction failed, expected 60000, got ${res3.totalTax}`);

  // 4. Invalid jurisdiction identifier (should throw error)
  let invalidCodeErrorCaught = false;
  try {
    calculateSalesTax({
      amount: 100,
      mode: 'add_tax',
      stateRate: 6.00,
      localRate: 2.00,
      taxYear: 2026,
      stateCode: 'ZZ' // Invalid
    });
  } catch (e: any) {
    if (e.message.includes('Invalid state code: ZZ')) {
      invalidCodeErrorCaught = true;
    }
  }
  assert(invalidCodeErrorCaught, 'Test 4.1: Invalid code should throw error');

  // 5. Rounding boundaries (using the same logic as engine)
  const res5 = calculateSalesTax({
    amount: 1.005, // Taxable base
    mode: 'add_tax',
    stateRate: 10.00, // Should result in 0.1005 -> 0.10
    localRate: 0.00,
    taxYear: 2026,
    stateCode: 'CA'
  });
  assert(res5.stateTax === 0.10, `Test 5.1: Boundary rounding 1.005 base, expected 0.10, got ${res5.stateTax}`);
  
  // 6. Unsupported tax year
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
  assert(errorCaught, 'Test 6.1: Non-2026 year throws explicit error');

  console.log('--- ALL EXPANDED SALES TAX TESTS PASSED SUCCESSFULLY ---');
}

// Run them
runExpandedSalesTaxTests();
