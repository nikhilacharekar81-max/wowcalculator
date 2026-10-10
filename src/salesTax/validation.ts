import { SalesTaxInput } from './types';

export function validateSalesTaxInput(input: SalesTaxInput): void {
  if (!input) {
    throw new Error('Sales tax input cannot be null or undefined.');
  }

  const year = input.taxYear !== undefined ? input.taxYear : 2026;
  if (year !== 2026) {
    throw new Error(`Unsupported tax year: ${year}. WowCalc Sales Tax engine exclusively supports Tax Year 2026.`);
  }

  if (input.amount < 0) {
    throw new Error('Sales tax amount / price cannot be negative.');
  }

  if (input.stateRate < 0) {
    throw new Error('State sales tax rate cannot be negative.');
  }

  if (input.localRate && input.localRate < 0) {
    throw new Error('Local sales tax rate cannot be negative.');
  }

  if (input.shippingAmount !== undefined && input.shippingAmount < 0) {
    throw new Error('Shipping amount cannot be negative.');
  }
}
