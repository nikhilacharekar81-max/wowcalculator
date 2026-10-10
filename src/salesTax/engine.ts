import { SalesTaxInput, SalesTaxResult } from './types';
import { getStateSalesTaxConfig } from './config';
import { validateSalesTaxInput } from './validation';

function roundToCents(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function calculateSalesTax(input: SalesTaxInput): SalesTaxResult {
  const taxYear = input.taxYear !== undefined ? input.taxYear : 2026;
  if (taxYear !== 2026) {
    throw new Error(`Unsupported tax year: ${taxYear}. Only 2026 is supported.`);
  }
  validateSalesTaxInput({ ...input, taxYear });

  const stateCode = (input.stateCode || 'CA').toUpperCase();
  const transactionDate = input.transactionDate || '2026-01-01';
  const stateCfg = getStateSalesTaxConfig(stateCode, transactionDate);

  const discountPct = Math.max(0, Math.min(100, input.discountPercent || 0));
  const discountRate = discountPct / 100;
  const discountType = input.discountType || 'store';
  const itemType = input.itemType || 'general';
  const shippingAmt = Math.max(0, input.shippingAmount || 0);

  const stateR = Math.max(0, input.stateRate) / 100;
  const localR = Math.max(0, input.localRate) / 100;

  let exemptionNote = '';
  let effectiveMultiplier = 1.0;

  if (itemType === 'prescription') {
    effectiveMultiplier = 0;
    exemptionNote = 'Prescription drugs are exempt from sales tax under state statutory rules.';
  } else if (itemType === 'groceries') {
    if (!stateCfg.foodTaxable) {
      effectiveMultiplier = 0;
      exemptionNote = `${stateCfg.name} exempts unprepared grocery food from sales tax.`;
    } else {
      exemptionNote = `${stateCfg.name} taxes grocery food under general or reduced rates.`;
    }
  } else if (itemType === 'clothing') {
    if (!stateCfg.clothingTaxable) {
      effectiveMultiplier = 0;
      exemptionNote = `${stateCfg.name} exempts clothing apparel from sales tax.`;
    } else if (stateCfg.clothingThreshold && input.amount <= stateCfg.clothingThreshold) {
      effectiveMultiplier = 0;
      exemptionNote = `${stateCfg.name} exempts clothing items priced under $${stateCfg.clothingThreshold}.`;
    } else {
      exemptionNote = `Clothing is taxable at standard rates in ${stateCfg.name}.`;
    }
  } else if (itemType === 'digital') {
    if (!stateCfg.digitalTaxable) {
      effectiveMultiplier = 0;
      exemptionNote = `${stateCfg.name} exempts digital products/software from sales tax.`;
    } else {
      exemptionNote = `Digital products/software are taxable in ${stateCfg.name}.`;
    }
  } else {
    exemptionNote = `General merchandise / prepared meals are fully taxable in ${stateCfg.name}.`;
  }

  const effectiveStateR = stateR * effectiveMultiplier;
  const effectiveLocalR = localR * effectiveMultiplier;
  const totalR = effectiveStateR + effectiveLocalR;

  if (input.mode === 'add_tax') {
    const raw = Math.max(0, input.amount);
    let taxableBase = raw;
    let savings = 0;

    if (discountType === 'store') {
      const discountedRaw = raw * (1 - discountRate);
      taxableBase = roundToCents(discountedRaw);
      savings = roundToCents(raw * discountRate);
    } else {
      savings = roundToCents(raw * discountRate);
      taxableBase = roundToCents(raw);
    }

    const stateTax = roundToCents(taxableBase * effectiveStateR);
    const localTax = roundToCents(taxableBase * effectiveLocalR);
    
    let shippingTax = 0;
    if (shippingAmt > 0 && stateCfg.shippingTaxable) {
      shippingTax = roundToCents(shippingAmt * (effectiveStateR + effectiveLocalR));
    }

    const totalTax = roundToCents(stateTax + localTax + shippingTax);
    const finalTotal = roundToCents(taxableBase + shippingAmt + totalTax);

    return {
      beforeTax: taxableBase,
      rawAmount: raw,
      stateTax,
      localTax,
      shippingTax,
      totalTax,
      finalTotal,
      savings,
      centAdjustment: 0,
      exemptionNote,
      itemType,
      stateCode,
      verificationStatus: stateCfg.evidence.verificationStatus,
      sourceInfo: {
        name: stateCfg.sourceName,
        url: stateCfg.sourceUrl,
        taxYear: 2026,
        effectiveDate: stateCfg.effectiveDate
      },
      auditTrail: {
        determinationId: `DET-${Date.now()}`,
        input: input,
        jurisdiction: stateCode,
        appliedRates: [{ component: 'state', rate: effectiveStateR }, { component: 'local', rate: effectiveLocalR }],
        taxabilityDecisions: [
          { category: 'General', taxable: itemType === 'general', note: exemptionNote },
          { category: 'Groceries', taxable: itemType === 'groceries', note: exemptionNote },
          { category: 'Clothing', taxable: itemType === 'clothing', note: exemptionNote }
        ],
        roundingLog: 'Standard rounding to cents, applied per jurisdiction',
        engineVersion: '2026.1.0',
        ruleId: stateCfg.evidence.ruleId,
        timestamp: new Date().toISOString()
      }
    };
  } else {
    const total = Math.max(0, input.amount);
    const beforeTaxRaw = total / (1 + totalR);
    let beforeTax = roundToCents(beforeTaxRaw);
    let stateTax = roundToCents(beforeTax * effectiveStateR);
    let localTax = roundToCents(beforeTax * effectiveLocalR);
    let shippingTax = 0;
    if (shippingAmt > 0 && stateCfg.shippingTaxable) {
      shippingTax = roundToCents(shippingAmt * totalR);
    }
    let totalTax = roundToCents(stateTax + localTax + shippingTax);
    let calculatedTotal = roundToCents(beforeTax + shippingAmt + totalTax);
    let centAdjustment = roundToCents(total - calculatedTotal);

    if (centAdjustment !== 0) {
      beforeTax = roundToCents(beforeTax + centAdjustment);
      calculatedTotal = roundToCents(beforeTax + shippingAmt + totalTax);
    }

    return {
      beforeTax,
      rawAmount: total,
      stateTax,
      localTax,
      shippingTax,
      totalTax,
      finalTotal: calculatedTotal,
      savings: 0,
      centAdjustment,
      exemptionNote,
      itemType,
      stateCode,
      verificationStatus: stateCfg.evidence.verificationStatus,
      sourceInfo: {
        name: stateCfg.sourceName,
        url: stateCfg.sourceUrl,
        taxYear: 2026,
        effectiveDate: stateCfg.effectiveDate
      },
      auditTrail: {
        determinationId: `DET-${Date.now()}`,
        input: input,
        jurisdiction: stateCode,
        appliedRates: [{ component: 'state', rate: effectiveStateR }, { component: 'local', rate: effectiveLocalR }],
        taxabilityDecisions: [
          { category: 'General', taxable: itemType === 'general', note: exemptionNote },
          { category: 'Groceries', taxable: itemType === 'groceries', note: exemptionNote },
          { category: 'Clothing', taxable: itemType === 'clothing', note: exemptionNote }
        ],
        roundingLog: 'Standard rounding to cents, applied per jurisdiction',
        engineVersion: '2026.1.0',
        ruleId: stateCfg.evidence.ruleId,
        timestamp: new Date().toISOString()
      }
    };
  }
}
