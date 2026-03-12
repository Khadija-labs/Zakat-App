/**
 * Default currency and gold/silver rates for the calculator.
 * Values come from env (VITE_*) so you can change them in one place (.env).
 */

/** 1 tola = 11.6638038 grams (standard) */
export const TOLA_GRAM = 11.6638038;

function parseEnvNum(key: string, fallback: number): number {
  const raw = import.meta.env[key];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Default currency code (e.g. PKR). */
export const DEFAULT_CURRENCY =
  (import.meta.env.VITE_DEFAULT_CURRENCY as string) || "PKR";

/** Default gold rate in PKR per tola. Change via VITE_DEFAULT_GOLD_RATE_PKR_PER_TOLA in .env */
export const DEFAULT_GOLD_RATE_PKR_PER_TOLA = parseEnvNum(
  "VITE_DEFAULT_GOLD_RATE_PKR_PER_TOLA",
  522300
);

/** Default silver rate in PKR per tola. Change via VITE_DEFAULT_SILVER_RATE_PKR_PER_TOLA in .env */
export const DEFAULT_SILVER_RATE_PKR_PER_TOLA = parseEnvNum(
  "VITE_DEFAULT_SILVER_RATE_PKR_PER_TOLA",
  11102
);

/** Gold rate per gram (derived from per tola). */
export function goldRatePerGram(ratePerTola: number): number {
  return ratePerTola / TOLA_GRAM;
}

/** Silver rate per gram (derived from per tola). */
export function silverRatePerGram(ratePerTola: number): number {
  return ratePerTola / TOLA_GRAM;
}
