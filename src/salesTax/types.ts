export type TaxableItemType = 'general' | 'groceries' | 'clothing' | 'prescription' | 'restaurant' | 'digital' | 'shipping';

export type DiscountType = 'store' | 'manufacturer';

export type CalculationMode = 'add_tax' | 'extract_tax';

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'NOT_VERIFIED';

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
  verificationStatus: VerificationStatus;
  sourceInfo: {
    name: string;
    url: string;
    taxYear: number;
    effectiveDate: string;
  };
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
  verificationStatus: VerificationStatus;
  sourceName: string;
  sourceUrl: string;
  effectiveDate: string;
}
