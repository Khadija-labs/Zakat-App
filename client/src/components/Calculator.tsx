import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Coins, CircleDollarSign, Landmark, HardDrive, ShieldAlert, Calculator, BarChart3 } from "lucide-react";
import {
  TOLA_GRAM,
  DEFAULT_CURRENCY,
  DEFAULT_GOLD_RATE_PKR_PER_TOLA,
  DEFAULT_SILVER_RATE_PKR_PER_TOLA,
} from "@/config/rates";

type Unit = "grams" | "tolas";
type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "SAR" | "AED" | "Other";

const CURRENCY_SYMBOLS: Record<Exclude<CurrencyCode, "Other">, string> = {
  PKR: "₨",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SAR: "﷼",
  AED: "د.إ",
};

function getCurrencySymbol(currency: CurrencyCode, customCode: string): string {
  if (currency === "Other") return customCode.trim() ? `${customCode.trim()} ` : "";
  return CURRENCY_SYMBOLS[currency];
}

interface MetalState {
  quantity: string;
  unit: Unit;
  /** Rate in currency per tola (single source of truth); per-gram is derived. */
  ratePerTola: string;
}

// --- Stable components defined OUTSIDE the parent so React keeps the same component identity
//     across re-renders. Defining them inside ZakatCalculator caused focus loss on every keystroke.

interface InputFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function InputField({ icon, label, value, onChange, placeholder }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value.replace(/[^0-9.]/g, "");
    onChange(numValue);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-foreground/80 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-primary/80 pointer-events-none text-sm">
          {icon}
        </div>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className={`w-full pl-12 pr-4 py-3 text-base bg-card border rounded-lg focus:outline-none transition-all duration-200 shadow-sm ${
            isFocused ? "border-primary focus:ring-2 focus:ring-primary/50" : "border-border"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
}

interface MetalSectionProps {
  title: string;
  state: MetalState;
  setState: React.Dispatch<React.SetStateAction<MetalState>>;
  theme: "gold" | "silver";
  currencyLabel: string;
  currencySymbol: string;
}

function MetalSection({ title, state, setState, theme, currencyLabel, currencySymbol }: MetalSectionProps) {
  const [quantityFocused, setQuantityFocused] = useState(false);
  const [rateFocused, setRateFocused] = useState(false);

  return (
    <div
      className={`p-4 md:p-5 rounded-xl border shadow-sm min-w-0 ${
        theme === "gold"
          ? "bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60"
          : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60"
      }`}
    >
      <div className="mb-3">
        <h3
          className={`font-display font-bold text-base mb-2 ${
            theme === "gold" ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {title}
        </h3>
        <div className="flex bg-card rounded-md p-0.5 shadow-sm border border-border w-fit">
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, unit: "grams" }))}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              state.unit === "grams" ? "bg-secondary text-white" : "text-secondary/70 hover:bg-secondary/10"
            }`}
          >
            Grams
          </button>
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, unit: "tolas" }))}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              state.unit === "tolas" ? "bg-secondary text-white" : "text-secondary/70 hover:bg-secondary/10"
            }`}
          >
            Tolas
          </button>
        </div>
      </div>
      {/* Two-row layout: Quantity full width, then Rate per tola | Rate per gram (equal) — fixes Tolas alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="min-w-0 sm:col-span-2">
          <label className="block text-xs font-semibold text-foreground/70 mb-1">
            Quantity ({state.unit})
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full min-w-0 px-3 py-2.5 border rounded-lg bg-card focus:outline-none text-sm transition-all ${
              quantityFocused ? "border-primary ring-2 ring-primary focus:ring-primary" : "border-border"
            }`}
            placeholder={state.unit === "tolas" ? "e.g. 10" : "e.g. 116"}
            value={state.quantity}
            onChange={(e) => {
              const numValue = e.target.value.replace(/[^0-9.]/g, "");
              setState((prev) => ({ ...prev, quantity: numValue }));
            }}
            onFocus={() => setQuantityFocused(true)}
            onBlur={() => setQuantityFocused(false)}
          />
        </div>
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-foreground/70 mb-1 truncate" title={`Rate per tola (${currencyLabel})`}>
            Rate per tola ({currencyLabel})
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            className={`w-full min-w-0 px-3 py-2.5 border rounded-lg bg-card focus:outline-none text-sm transition-all ${
              rateFocused ? "border-primary ring-2 ring-primary focus:ring-primary" : "border-border"
            }`}
            placeholder={currencySymbol ? `e.g. ${currencySymbol}5,000` : "e.g. 5000"}
            value={state.ratePerTola}
            onChange={(e) => {
              const numValue = e.target.value.replace(/[^0-9.]/g, "");
              setState((prev) => ({ ...prev, ratePerTola: numValue }));
            }}
            onFocus={() => setRateFocused(true)}
            onBlur={() => setRateFocused(false)}
          />
        </div>
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-foreground/70 mb-1 truncate" title={`Rate per gram (${currencyLabel})`}>
            Rate per gram ({currencyLabel})
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            className="w-full min-w-0 px-3 py-2.5 border rounded-lg bg-card focus:outline-none text-sm transition-all border-border focus:border-primary focus:ring-2 focus:ring-primary"
            placeholder={currencySymbol ? `e.g. ${currencySymbol}500` : "e.g. 500"}
            value={
              (() => {
                const perTola = parseFloat(state.ratePerTola);
                return Number.isFinite(perTola) && perTola >= 0 ? (perTola / TOLA_GRAM).toFixed(2) : "";
              })()
            }
            onChange={(e) => {
              const numValue = e.target.value.replace(/[^0-9.]/g, "");
              const perGram = parseFloat(numValue);
              if (numValue === "" || numValue === ".") {
                setState((prev) => ({ ...prev, ratePerTola: numValue }));
              } else if (Number.isFinite(perGram) && perGram >= 0) {
                setState((prev) => ({ ...prev, ratePerTola: (perGram * TOLA_GRAM).toFixed(2) }));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

function formatAmount(symbol: string, value: number): string {
  const str = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return symbol ? `${symbol} ${str}` : str;
}

export function ZakatCalculator() {
  // Currency (default from env; user can change)
  const [currency, setCurrency] = useState<CurrencyCode>(
    (DEFAULT_CURRENCY && ["PKR", "USD", "EUR", "GBP", "SAR", "AED", "Other"].includes(DEFAULT_CURRENCY)
      ? DEFAULT_CURRENCY
      : "PKR") as CurrencyCode
  );
  const [customCurrency, setCustomCurrency] = useState<string>("");
  const currencyLabel = currency === "Other" ? (customCurrency.trim() || "Currency") : currency;
  const currencySymbol = getCurrencySymbol(currency, customCurrency);

  // Base Assets
  const [cash, setCash] = useState<string>("");
  const [savings, setSavings] = useState<string>("");
  const [investments, setInvestments] = useState<string>("");
  const [digitalAssets, setDigitalAssets] = useState<string>("");

  // Precious Metals (default gold/silver rates from env when PKR)
  const [gold, setGold] = useState<MetalState>({
    quantity: "",
    unit: "tolas",
    ratePerTola: String(DEFAULT_GOLD_RATE_PKR_PER_TOLA),
  });
  const [silver, setSilver] = useState<MetalState>({
    quantity: "",
    unit: "tolas",
    ratePerTola: String(DEFAULT_SILVER_RATE_PKR_PER_TOLA),
  });

  // Deductions
  const [liabilities, setLiabilities] = useState<string>("");

  // Show summary
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Calculations
  const parseNum = (val: string) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculation = useMemo(() => {
    const cashVal = parseNum(cash);
    const savingsVal = parseNum(savings);
    const investmentsVal = parseNum(investments);
    const digitalVal = parseNum(digitalAssets);

    const goldRatePerTola = parseNum(gold.ratePerTola);
    const goldRatePerGram = goldRatePerTola / TOLA_GRAM;
    const goldVal =
      parseNum(gold.quantity) * (gold.unit === "tolas" ? goldRatePerTola : goldRatePerGram);

    const silverRatePerTola = parseNum(silver.ratePerTola);
    const silverRatePerGram = silverRatePerTola / TOLA_GRAM;
    const silverVal =
      parseNum(silver.quantity) * (silver.unit === "tolas" ? silverRatePerTola : silverRatePerGram);

    const totalAssets = cashVal + savingsVal + investmentsVal + digitalVal + goldVal + silverVal;
    const liabilitiesVal = parseNum(liabilities);

    const netWealth = totalAssets - liabilitiesVal;

    // Nisab: silver 52.5 tolas or 612.36 grams
    let dynamicNisab = 0;
    if (silverRatePerTola > 0) {
      dynamicNisab = silver.unit === "tolas" ? silverRatePerTola * 52.5 : silverRatePerGram * 612.36;
    } else {
      dynamicNisab = 150000;
    }

    const isEligible = netWealth >= dynamicNisab;
    const zakatAmount = isEligible ? netWealth * 0.025 : 0;

    return {
      totalAssets,
      netWealth,
      zakatAmount,
      isEligible,
      dynamicNisab,
      silverRateProvided: silverRatePerTola > 0,
    };
  }, [cash, savings, investments, digitalAssets, gold, silver, liabilities]);

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr,minmax(300px,360px)] gap-6 lg:gap-8 items-start">
      {/* Left: Calculator inputs */}
      <div className="space-y-4 order-1">
        {/* Liquid Assets Card (includes currency selector) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-5 md:p-6 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l" />
          <h2 className="text-xl font-display font-bold text-foreground dark:text-primary mb-4 flex items-center gap-2">
            <Coins className="text-primary w-5 h-5" /> Liquid & Invested Assets
          </h2>

          <div className="mb-4 pb-4 border-b border-border/60">
            <label className="block text-xs font-bold text-foreground/80 mb-1.5">Currency</label>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[180px]"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                <option value="PKR">PKR – Pakistani Rupee</option>
                <option value="USD">USD – US Dollar</option>
                <option value="EUR">EUR – Euro</option>
                <option value="GBP">GBP – British Pound</option>
                <option value="SAR">SAR – Saudi Riyal</option>
                <option value="AED">AED – UAE Dirham</option>
                <option value="Other">Other…</option>
              </select>
              {currency === "Other" && (
                <input
                  type="text"
                  className="border border-border rounded-lg px-3 py-2 text-sm w-full sm:w-28 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. MYR, INR"
                  value={customCurrency}
                  onChange={(e) => setCustomCurrency(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                />
              )}
              <span className="text-xs text-muted-foreground">Amounts in: <strong className="text-foreground">{currencyLabel}</strong> {currencySymbol && <span>({currencySymbol})</span>}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={currencySymbol ? <span className="text-base font-semibold text-primary/80">{currencySymbol}</span> : <CircleDollarSign />} label="Cash in Hand & Bank" value={cash} onChange={setCash} placeholder="0.00" />
            <InputField icon={currencySymbol ? <span className="text-base font-semibold text-primary/80">{currencySymbol}</span> : <Landmark />} label="Savings & Deposits" value={savings} onChange={setSavings} placeholder="0.00" />
            <InputField icon={currencySymbol ? <span className="text-base font-semibold text-primary/80">{currencySymbol}</span> : <CircleDollarSign />} label="Business Investments / Stock" value={investments} onChange={setInvestments} placeholder="0.00" />
            <InputField icon={currencySymbol ? <span className="text-base font-semibold text-primary/80">{currencySymbol}</span> : <HardDrive />} label="Digital Assets (Crypto, etc.)" value={digitalAssets} onChange={setDigitalAssets} placeholder="0.00" />
          </div>
        </motion.div>

        {/* Precious Metals Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-5 md:p-6 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l" />
          <h2 className="text-xl font-display font-bold text-foreground dark:text-primary mb-4 flex items-center gap-2">
            Precious Metals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <MetalSection title="Gold (ذهب)" state={gold} setState={setGold} theme="gold" currencyLabel={currencyLabel} currencySymbol={currencySymbol} />
            <MetalSection title="Silver (فضة)" state={silver} setState={setSilver} theme="silver" currencyLabel={currencyLabel} currencySymbol={currencySymbol} />
          </div>
        </motion.div>

        {/* Liabilities Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-5 md:p-6 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive rounded-l" />
          <h2 className="text-xl font-display font-bold text-foreground dark:text-primary mb-4 flex items-center gap-2">
            <ShieldAlert className="text-destructive w-5 h-5" /> Deductible Liabilities
          </h2>
          <InputField icon={currencySymbol ? <span className="text-base font-semibold text-primary/80">{currencySymbol}</span> : <CircleDollarSign />} label="Outstanding Loans & Debts (Immediate)" value={liabilities} onChange={setLiabilities} placeholder="0.00" />
          <p className="mt-2 text-xs text-muted-foreground">
            * Only deduct debts that are due for payment immediately or within the current lunar year.
          </p>
        </motion.div>

        {/* Calculate Button - full width on mobile, normal on desktop */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowSummary(true)}
          className="w-full bg-gradient-gold text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-base"
        >
          <Calculator className="w-5 h-5" /> Calculate My Zakat
        </motion.button>
      </div>

      {/* Right: Zakat Summary - always visible, sticky on desktop */}
      <aside className="order-2 lg:sticky lg:top-24 lg:self-start">
        {showSummary ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="bg-secondary rounded-xl overflow-hidden shadow-2xl border border-primary/20">
              <div className="bg-gradient-gold p-4 text-center text-white">
                <h2 className="font-display font-bold text-xl">Zakat Summary</h2>
                <p className="opacity-90 text-xs mt-0.5">Your calculation results</p>
              </div>
              <div className="p-5 space-y-4 bg-secondary text-white">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/70 font-medium text-sm">Total Assets</span>
                  <span className="font-bold font-sans text-sm">{formatAmount(currencySymbol, calculation.totalAssets)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/70 font-medium text-sm">Liabilities</span>
                  <span className="font-bold text-red-400 font-sans text-sm">- {formatAmount(currencySymbol, parseNum(liabilities))}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white font-bold text-sm">Net Wealth</span>
                  <span className="font-bold font-sans text-sm">{formatAmount(currencySymbol, calculation.netWealth)}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-white/60 mb-1.5 uppercase tracking-wider font-bold">Nisab (Silver basis)</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-sans text-sm">{formatAmount(currencySymbol, calculation.dynamicNisab)}</span>
                    {!calculation.silverRateProvided && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">Est.</span>
                    )}
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-xs font-medium mb-1 opacity-80">Your Zakat Obligation</p>
                  <div className={`text-2xl font-display font-bold py-3 rounded-lg border ${calculation.isEligible ? "bg-primary/20 border-primary text-primary shadow-[0_0_24px_hsl(var(--primary)/0.35)]" : "bg-white/5 border-white/10 text-white/50"}`}>
                    {formatAmount(currencySymbol, calculation.zakatAmount)}
                  </div>
                  {!calculation.isEligible && calculation.netWealth > 0 && (
                    <p className="text-xs text-white/50 mt-2">Below Nisab. Zakat not obligatory.</p>
                  )}
                  {calculation.isEligible && (
                    <p className="text-xs text-primary mt-2 font-semibold">2.5% of Net Wealth</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="w-full py-2.5 px-5 bg-card border border-border rounded-lg font-semibold text-sm text-foreground hover:bg-muted transition-colors"
            >
              Modify Calculation
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl p-6 shadow-gold border-2 border-dashed border-primary/30 flex flex-col items-start min-h-[200px] text-left"
          >
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4 shrink-0">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display font-bold text-lg text-foreground dark:text-primary mb-2">Zakat Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fill in your assets and liabilities, then click <span className="font-semibold text-primary">Calculate My Zakat</span> to see your summary.
            </p>
          </motion.div>
        )}
      </aside>
    </div>
  );
}
