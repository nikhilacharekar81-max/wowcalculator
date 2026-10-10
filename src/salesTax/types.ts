export type TaxableItemType = 'general' | 'groceries' | 'clothing' | 'prescription' | 'restaurant' | 'digital' | 'shipping';

export type DiscountType = 'store' | 'manufacturer';

export type CalculationMode = 'add_tax' | 'extract_tax';

export type EvidenceStatus = 'UNVERIFIED' | 'IN_REVIEW' | 'VERIFIED' | 'STALE' | 'CONFLICTED' | 'REJECTED';

export interface AuditEvidence {
  ruleId: string;
  category: string;
  sourceAuthority: string;
  sourceUrl: string;
  statuteOrRegulation?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  sourcePublicationDate?: string;
  lastCheckedDate: string;
  verificationStatus: EvidenceStatus;
  reviewer?: string;
  relatedTestIds: string[];
  limitations?: string;
}

export interface CalculationAuditTrail {
  determinationId: string;
  input: SalesTaxInput;
  jurisdiction: string;
  appliedRates: { component: string; rate: number }[];
  taxabilityDecisions: { category: string; taxable: boolean; note: string }[];
  roundingLog: string;
  engineVersion: string;
  ruleId: string;
  timestamp: string;
}

export interface SalesTaxInput {
  amount: number;
  mode: CalculationMode;
  stateRate: number;
  localRate: number;
  discountPercent?: number;
  discountType?: DiscountType;
  itemType?: TaxableItemType;
  stateCode?: string;
  shippingAmount?: number;
  taxYear: number;
  transactionDate?: string;
}

export interface SalesTaxResult {
  beforeTax: number;
  rawAmount: number;
  stateTax: number;
  localTax: number;
  shippingTax: number;
  totalTax: number;
  finalTotal: number;
  savings: number;
  centAdjustment: number;
  exemptionNote: string;
  itemType: TaxableItemType;
  stateCode: string;
  verificationStatus: EvidenceStatus;
  sourceInfo: {
    name: string;
    url: string;
    taxYear: number;
    effectiveDate: string;
  };
  auditTrail: CalculationAuditTrail;
}

export interface StateSalesTaxConfig {
  code: string;
  name: string;
  stateRate: number;
  avgLocalRate: number;
  combinedRate: number;
  foodTaxable: boolean;
  clothingTaxable: boolean;
  clothingThreshold?: number;
  prescriptionTaxable: boolean;
  digitalTaxable: boolean;
  shippingTaxable: boolean;
  sourcingRule: 'destination' | 'origin';
  verificationStatus: EvidenceStatus;
  sourceName: string;
  sourceUrl: string;
  effectiveDate: string;
  evidence: AuditEvidence;
}
