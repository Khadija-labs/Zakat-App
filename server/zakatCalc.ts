/**
 * Server-side Zakat calculation (same logic as client Calculator).
 * Used by ZakatGPT when the user asks to calculate Zakat.
 */
export interface ZakatInput {
  cash?: number;
  savings?: number;
  investments?: number;
  digitalAssets?: number;
  goldValue?: number;
  silverValue?: number;
  liabilities?: number;
  nisabThreshold?: number;
  currency?: string;
}

const DEFAULT_NISAB = 150000;
const ZAKAT_RATE = 0.025;

export function calculateZakat(input: ZakatInput) {
  const cash = input.cash ?? 0;
  const savings = input.savings ?? 0;
  const investments = input.investments ?? 0;
  const digitalAssets = input.digitalAssets ?? 0;
  const goldValue = input.goldValue ?? 0;
  const silverValue = input.silverValue ?? 0;
  const liabilities = input.liabilities ?? 0;
  const nisab = input.nisabThreshold ?? DEFAULT_NISAB;
  const currency = input.currency ?? "PKR";

  const totalAssets = cash + savings + investments + digitalAssets + goldValue + silverValue;
  const netWealth = totalAssets - liabilities;
  const isEligible = netWealth >= nisab;
  const zakatAmount = isEligible ? netWealth * ZAKAT_RATE : 0;

  return {
    totalAssets,
    netWealth,
    nisabThreshold: nisab,
    isEligible,
    zakatAmount,
    currency,
  };
}
