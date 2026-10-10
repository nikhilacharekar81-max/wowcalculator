import { SalesTaxInput, SalesTaxResult, TaxabilityDecision, AppliedRateComponent, EvidenceStatus } from './types';
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

  if (!input.stateCode || typeof input.stateCode !== 'string' || !input.stateCode.trim()) {
    throw new Error('A valid two-letter state code is required. Generic fallback rates are disabled.');
  }

  const stateCode = input.stateCode.trim().toUpperCase();
  const transactionDate = input.transactionDate || '2026-01-01';

  let stateCfg;
  try {
    stateCfg = getStateSalesTaxConfig(stateCode, transactionDate);
  } catch (e: any) {
    if (e.message && (e.message.includes('transaction date') || e.message.includes('effective date') || e.message.includes('expiration date') || e.message.includes('2026'))) {
      throw e;
    }
    throw new Error(`Invalid state code: ${stateCode} (State code ${stateCode} is not supported.)`);
  }

  const discountPct = Math.max(0, Math.min(100, input.discountPercent || 0));
  const discountRate = discountPct / 100;
  const discountType = input.discountType || 'store';
  const itemType = input.itemType || 'general';
  const shippingAmt = Math.max(0, input.shippingAmount || 0);

  const stateR = (input.stateRate !== undefined ? Math.max(0, input.stateRate) : stateCfg.stateRate) / 100;
  const isLocalRateEstimated = input.localRate === undefined;
  const localR = (input.localRate !== undefined ? Math.max(0, input.localRate) : (stateCfg.avgLocalRate || 0)) / 100;

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

  // Wayfair economic nexus & marketplace facilitator rules: remote sellers, interstate transactions, drop shipments, and multi-state sellers override origin sourcing to destination sourcing
  const isRemoteOrMarketplace = Boolean(
    input.isRemoteSeller ||
    input.isMarketplaceFacilitator ||
    input.isInterstate ||
    input.isDropShipment ||
    (input.sellerStateCode && input.buyerStateCode && input.sellerStateCode.trim().toUpperCase() !== input.buyerStateCode.trim().toUpperCase())
  );
  const effectiveSourcingRule = isRemoteOrMarketplace ? 'destination' : stateCfg.sourcingRule;

  if (effectiveSourcingRule === 'origin') {
    exemptionNote += ' [Note: Sourcing rule is origin-based; tax determined by seller location.]';
  } else {
    exemptionNote += isRemoteOrMarketplace
      ? ' [Note: Sourcing rule overridden to destination-based under Wayfair economic nexus, marketplace facilitator, or interstate commerce guidelines.]'
      : ' [Note: Sourcing rule is destination-based; tax determined by delivery location.]';
  }

  const effectiveStateR = stateR * effectiveMultiplier;
  const effectiveLocalR = localR * effectiveMultiplier;
  const totalR = effectiveStateR + effectiveLocalR;

  // Never report a jurisdiction as VERIFIED when its supporting evidence remains UNVERIFIED
  const effectiveVerificationStatus: EvidenceStatus = 
    stateCfg.verificationStatus === 'VERIFIED' && stateCfg.evidence?.verificationStatus !== 'VERIFIED'
      ? 'UNVERIFIED'
      : (stateCfg.evidence?.verificationStatus || stateCfg.verificationStatus || 'UNVERIFIED');

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

    const taxabilityDecisions: TaxabilityDecision[] = [
      {
        category: itemType.charAt(0).toUpperCase() + itemType.slice(1),
        taxable: effectiveMultiplier > 0,
        ruleId: stateCfg.evidence?.ruleId || `${stateCode}-2026-001`,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        note: exemptionNote
      }
    ];

    if (discountPct > 0) {
      taxabilityDecisions.push({
        category: 'Discount',
        taxable: discountType === 'store',
        ruleId: `${stateCode}-DISCOUNT-001`,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        note: discountType === 'store'
          ? `Store discount of ${discountPct}% deducted from taxable base prior to tax calculation.`
          : `Manufacturer coupon of ${discountPct}% treated as post-tax tender; tax applied to full pre-coupon price.`
      });
    }

    if (shippingAmt > 0) {
      taxabilityDecisions.push({
        category: 'Shipping & Delivery',
        taxable: stateCfg.shippingTaxable,
        ruleId: `${stateCode}-SHIPPING-001`,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        note: stateCfg.shippingTaxable
          ? `${stateCfg.name} treats delivery/shipping charges as taxable gross receipts.`
          : `${stateCfg.name} exempts separately stated shipping/delivery charges.`
      });
    }

    taxabilityDecisions.push({
      category: 'Sourcing Rule',
      taxable: true,
      ruleId: `${stateCode}-SOURCING-001`,
      sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
      note: effectiveSourcingRule === 'origin'
        ? `${stateCfg.name} enforces origin-based sourcing for intrastate transactions (tax determined by seller point of origin).`
        : isRemoteOrMarketplace
          ? `${stateCfg.name} baseline origin sourcing is overridden to destination-based sourcing under South Dakota v. Wayfair economic nexus / marketplace facilitator rules.`
          : `${stateCfg.name} enforces destination-based sourcing (tax determined by buyer point of delivery).`
    });

    const appliedRates: AppliedRateComponent[] = [
      {
        component: 'state',
        rate: effectiveStateR,
        percentage: roundToCents(effectiveStateR * 100),
        amount: stateTax,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        isEstimate: false
      },
      {
        component: 'local',
        rate: effectiveLocalR,
        percentage: roundToCents(effectiveLocalR * 100),
        amount: localTax,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        isEstimate: isLocalRateEstimated
      }
    ];

    if (shippingTax > 0) {
      appliedRates.push({
        component: 'shipping',
        rate: totalR,
        percentage: roundToCents(totalR * 100),
        amount: shippingTax,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        isEstimate: isLocalRateEstimated
      });
    }

    const roundingLog = `Mode: add_tax. Base: $${taxableBase.toFixed(2)}. State tax: $${stateTax.toFixed(2)} at ${(effectiveStateR * 100).toFixed(4)}% and local tax: $${localTax.toFixed(2)} at ${(effectiveLocalR * 100).toFixed(4)}% ${isLocalRateEstimated ? '(population-weighted average local rate estimate)' : '(user-specified local rate)'} rounded independently to nearest cent. Shipping tax: $${shippingTax.toFixed(2)}. Total tax: $${totalTax.toFixed(2)}. Final out-of-pocket: $${finalTotal.toFixed(2)}.`;

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
      sourcingRule: effectiveSourcingRule,
      verificationStatus: effectiveVerificationStatus,
      sourceInfo: {
        name: stateCfg.sourceName,
        url: stateCfg.sourceUrl,
        taxYear: 2026,
        effectiveDate: stateCfg.effectiveDate
      },
      auditTrail: {
        determinationId: `DET-${Date.now()}`,
        input: { ...input, transactionDate, taxYear },
        transactionDate,
        taxYear,
        jurisdiction: stateCode,
        sourcingRule: effectiveSourcingRule,
        appliedRates,
        taxabilityDecisions,
        roundingLog,
        engineVersion: '2026.1.0',
        ruleId: stateCfg.evidence?.ruleId || `${stateCode}-2026-001`,
        timestamp: new Date().toISOString()
      }
    };
  } else {
    const total = Math.max(0, input.amount);
    const beforeTaxRaw = totalR > 0 ? total / (1 + totalR) : total;
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

    const taxabilityDecisions: TaxabilityDecision[] = [
      {
        category: itemType.charAt(0).toUpperCase() + itemType.slice(1),
        taxable: effectiveMultiplier > 0,
        ruleId: stateCfg.evidence?.ruleId || `${stateCode}-2026-001`,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        note: exemptionNote
      },
      {
        category: 'Sourcing Rule',
        taxable: true,
        ruleId: `${stateCode}-SOURCING-001`,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        note: effectiveSourcingRule === 'origin'
          ? `${stateCfg.name} enforces origin-based sourcing for intrastate transactions (tax determined by seller location).`
          : isRemoteOrMarketplace
            ? `${stateCfg.name} baseline origin sourcing is overridden to destination-based sourcing under South Dakota v. Wayfair economic nexus / marketplace facilitator rules.`
            : `${stateCfg.name} enforces destination-based sourcing (tax determined by buyer point of delivery).`
      }
    ];

    const appliedRates: AppliedRateComponent[] = [
      {
        component: 'state',
        rate: effectiveStateR,
        percentage: roundToCents(effectiveStateR * 100),
        amount: stateTax,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        isEstimate: false
      },
      {
        component: 'local',
        rate: effectiveLocalR,
        percentage: roundToCents(effectiveLocalR * 100),
        amount: localTax,
        sourceAuthority: stateCfg.evidence?.sourceAuthority || stateCfg.sourceName,
        isEstimate: isLocalRateEstimated
      }
    ];

    const roundingLog = `Mode: extract_tax. Total receipt: $${total.toFixed(2)}. Extracted pre-tax base: $${beforeTax.toFixed(2)}. Cent adjustment applied: $${centAdjustment.toFixed(2)}. State tax: $${stateTax.toFixed(2)}. Local tax: $${localTax.toFixed(2)} ${isLocalRateEstimated ? '(population-weighted average local rate estimate)' : '(user-specified local rate)'}. Reconciled total: $${calculatedTotal.toFixed(2)}.`;

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
      sourcingRule: effectiveSourcingRule,
      verificationStatus: effectiveVerificationStatus,
      sourceInfo: {
        name: stateCfg.sourceName,
        url: stateCfg.sourceUrl,
        taxYear: 2026,
        effectiveDate: stateCfg.effectiveDate
      },
      auditTrail: {
        determinationId: `DET-${Date.now()}`,
        input: { ...input, transactionDate, taxYear },
        transactionDate,
        taxYear,
        jurisdiction: stateCode,
        sourcingRule: effectiveSourcingRule,
        appliedRates,
        taxabilityDecisions,
        roundingLog,
        engineVersion: '2026.1.0',
        ruleId: stateCfg.evidence?.ruleId || `${stateCode}-2026-001`,
        timestamp: new Date().toISOString()
      }
    };
  }
}
