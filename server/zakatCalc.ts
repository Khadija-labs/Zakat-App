/**
 * Server-side Zakat calculation for the chatbot.
 * Uses SILVER rate for Nisab only; gold is excluded from the calculation (silver-based Nisab).
 */
export interface ZakatInput {
  cash?: number;
  savings?: number;
  investments?: number;
  digitalAssets?: number;
  /** Not included in total assets: we use silver rate for Nisab and skip gold in calculation. */
  goldValue?: number;
  silverValue?: number;
  otherAssets?: number;
  liabilities?: number;
  /** Silver rate per tola (same currency). Nisab = silverRatePerTola × 52.5. */
  silverRatePerTola?: number;
  nisabThreshold?: number;
  currency?: string;
}

/** Silver Nisab = 52.5 tolas. */
const SILVER_NISAB_TOLAS = 52.5;
const DEFAULT_NISAB = 150000;
const ZAKAT_RATE = 0.025;

export function calculateZakat(input: ZakatInput) {
  const cash = input.cash ?? 0;
  const savings = input.savings ?? 0;
  const investments = input.investments ?? 0;
  const digitalAssets = input.digitalAssets ?? 0;
  const silverValue = input.silverValue ?? 0;
  const otherAssets = input.otherAssets ?? 0;
  const liabilities = input.liabilities ?? 0;
  const currency = input.currency ?? "PKR";

  // Nisab from silver rate only (52.5 tolas). Gold is skipped in calculation.
  const silverRatePerTola = input.silverRatePerTola ?? 0;
  const nisabFromSilver =
    silverRatePerTola > 0 ? silverRatePerTola * SILVER_NISAB_TOLAS : 0;
  const nisab = nisabFromSilver > 0 ? nisabFromSilver : (input.nisabThreshold ?? DEFAULT_NISAB);

  // Total zakatable assets: exclude gold (silver-based calculation as requested).
  const totalAssets =
    cash + savings + investments + digitalAssets + silverValue + otherAssets;
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
    silverRatePerTolaUsed: silverRatePerTola > 0 ? silverRatePerTola : undefined,
    nisabFromSilver: nisabFromSilver > 0 ? nisabFromSilver : undefined,
  };
}
