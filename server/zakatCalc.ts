/**
 * Server-side Zakat calculation for the chatbot.
 * Gold and silver are converted to amounts (value); Nisab is based on silver 52.5 tolas only.
 */
export interface ZakatInput {
  cash?: number;
  savings?: number;
  investments?: number;
  digitalAssets?: number;
  goldValue?: number;
  silverValue?: number;
  otherAssets?: number;
  liabilities?: number;
  /** Silver rate per tola (same currency). Nisab = silverRatePerTola × 52.5 tolas. */
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
  const goldValue = input.goldValue ?? 0;
  const silverValue = input.silverValue ?? 0;
  const otherAssets = input.otherAssets ?? 0;
  const liabilities = input.liabilities ?? 0;
  const currency = input.currency ?? "PKR";

  // Nisab from silver 52.5 tolas only (silver rate × 52.5)
  const silverRatePerTola = input.silverRatePerTola ?? 0;
  const nisabFromSilver =
    silverRatePerTola > 0 ? silverRatePerTola * SILVER_NISAB_TOLAS : 0;
  const nisab = nisabFromSilver > 0 ? nisabFromSilver : (input.nisabThreshold ?? DEFAULT_NISAB);

  // Total zakatable assets: gold amount + silver amount + rest
  const totalAssets =
    cash + savings + investments + digitalAssets + goldValue + silverValue + otherAssets;
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
