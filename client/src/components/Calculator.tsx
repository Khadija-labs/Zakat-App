import { useState, useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Coins, CircleDollarSign, Landmark, HardDrive, ShieldAlert, Calculator } from "lucide-react";

type Unit = "grams" | "tolas";
type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "SAR" | "AED" | "Other";

interface MetalState {
  quantity: string;
  unit: Unit;
  rate: string;
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
      <label className="block text-sm font-bold text-secondary mb-2">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-primary/80 pointer-events-none">
          {icon}
        </div>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className={`w-full pl-14 pr-4 py-4 text-lg bg-white border rounded-xl focus:outline-none transition-all duration-200 shadow-sm ${
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
}

function MetalSection({ title, state, setState, theme, currencyLabel }: MetalSectionProps) {
  const [quantityFocused, setQuantityFocused] = useState(false);
  const [rateFocused, setRateFocused] = useState(false);

  return (
    <div
      className={`p-6 rounded-2xl border ${
        theme === "gold" ? "bg-amber-50/50 border-amber-200" : "bg-slate-50/50 border-slate-200"
      } shadow-sm`}
    >
      <div className="mb-4">
        <h3
          className={`font-display font-bold text-lg mb-3 ${
            theme === "gold" ? "text-amber-700" : "text-slate-700"
          }`}
        >
          {title}
        </h3>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-border w-fit">
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, unit: "grams" }))}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              state.unit === "grams" ? "bg-secondary text-white" : "text-secondary/70 hover:bg-secondary/10"
            }`}
          >
            Grams
          </button>
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, unit: "tolas" }))}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              state.unit === "tolas" ? "bg-secondary text-white" : "text-secondary/70 hover:bg-secondary/10"
            }`}
          >
            Tolas
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-2">
            Quantity ({state.unit})
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-base transition-all ${
              quantityFocused ? "border-primary ring-2 ring-primary focus:ring-primary" : "border-border"
            }`}
            placeholder={`e.g. ${state.unit === "tolas" ? "10" : "116"}`}
            value={state.quantity}
            onChange={(e) => {
              const numValue = e.target.value.replace(/[^0-9.]/g, "");
              setState((prev) => ({ ...prev, quantity: numValue }));
            }}
            onFocus={() => setQuantityFocused(true)}
            onBlur={() => setQuantityFocused(false)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground/70 mb-2">
            Rate / {state.unit === "tolas" ? "Tola" : "Gram"} ({currencyLabel})
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none text-base transition-all ${
              rateFocused ? "border-primary ring-2 ring-primary focus:ring-primary" : "border-border"
            }`}
            placeholder="e.g. 5000"
            value={state.rate}
            onChange={(e) => {
              const numValue = e.target.value.replace(/[^0-9.]/g, "");
              setState((prev) => ({ ...prev, rate: numValue }));
            }}
            onFocus={() => setRateFocused(true)}
            onBlur={() => setRateFocused(false)}
          />
        </div>
      </div>
    </div>
  );
}

export function ZakatCalculator() {
  // Currency (for display only; user enters amounts in their chosen currency)
  const [currency, setCurrency] = useState<CurrencyCode>("PKR");
  const [customCurrency, setCustomCurrency] = useState<string>("");
  const currencyLabel = currency === "Other" ? (customCurrency.trim() || "Currency") : currency;

  // Base Assets
  const [cash, setCash] = useState<string>("");
  const [savings, setSavings] = useState<string>("");
  const [investments, setInvestments] = useState<string>("");
  const [digitalAssets, setDigitalAssets] = useState<string>("");

  // Precious Metals
  const [gold, setGold] = useState<MetalState>({ quantity: "", unit: "tolas", rate: "" });
  const [silver, setSilver] = useState<MetalState>({ quantity: "", unit: "tolas", rate: "" });

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

    const goldVal = parseNum(gold.quantity) * parseNum(gold.rate);
    const silverVal = parseNum(silver.quantity) * parseNum(silver.rate);

    const totalAssets = cashVal + savingsVal + investmentsVal + digitalVal + goldVal + silverVal;
    const liabilitiesVal = parseNum(liabilities);

    const netWealth = totalAssets - liabilitiesVal;

    // Nisab logic:
    // Silver nisab is 52.5 tolas or 612.36 grams.
    let dynamicNisab = 0;
    const sRate = parseNum(silver.rate);
    if (sRate > 0) {
      dynamicNisab = silver.unit === "tolas" ? sRate * 52.5 : sRate * 612.36;
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
      silverRateProvided: sRate > 0,
    };
  }, [cash, savings, investments, digitalAssets, gold, silver, liabilities]);

  return (
    <div className="space-y-8">
      {/* Inputs Column */}
      <div className="space-y-6">
        
        {/* Liquid Assets Card (includes currency selector) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h2 className="text-2xl font-display font-bold text-secondary mb-6 flex items-center gap-2">
            <Coins className="text-primary w-6 h-6" /> Liquid & Invested Assets
          </h2>

          {/* Currency row - same card style */}
          <div className="mb-6 pb-6 border-b border-border/60">
            <label className="block text-sm font-bold text-secondary mb-2">Currency</label>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="border border-border rounded-xl px-4 py-3 text-base bg-background font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[200px]"
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
                  className="border border-border rounded-xl px-4 py-3 text-base w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. MYR, INR"
                  value={customCurrency}
                  onChange={(e) => setCustomCurrency(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                />
              )}
              <span className="text-sm text-muted-foreground">All amounts in: <strong className="text-secondary">{currencyLabel}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={<CircleDollarSign />} label="Cash in Hand & Bank" value={cash} onChange={setCash} placeholder="0.00" />
            <InputField icon={<Landmark />} label="Savings & Deposits" value={savings} onChange={setSavings} placeholder="0.00" />
            <InputField icon={<CircleDollarSign />} label="Business Investments / Stock" value={investments} onChange={setInvestments} placeholder="0.00" />
            <InputField icon={<HardDrive />} label="Digital Assets (Crypto, etc.)" value={digitalAssets} onChange={setDigitalAssets} placeholder="0.00" />
          </div>
        </motion.div>

        {/* Precious Metals Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
          <h2 className="text-2xl font-display font-bold text-secondary mb-6 flex items-center gap-2">
            Precious Metals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetalSection title="Gold (ذهب)" state={gold} setState={setGold} theme="gold" currencyLabel={currencyLabel} />
            <MetalSection title="Silver (فضة)" state={silver} setState={setSilver} theme="silver" currencyLabel={currencyLabel} />
          </div>
        </motion.div>

        {/* Liabilities Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-gold border border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
          <h2 className="text-2xl font-display font-bold text-secondary mb-6 flex items-center gap-2">
            <ShieldAlert className="text-destructive w-6 h-6" /> Deductible Liabilities
          </h2>
          <InputField icon={<CircleDollarSign />} label="Outstanding Loans & Debts (Immediate)" value={liabilities} onChange={setLiabilities} placeholder="0.00" />
          <p className="mt-3 text-sm text-muted-foreground">
            * Only deduct debts that are due for payment immediately or within the current lunar year.
          </p>
        </motion.div>

        {/* Calculate Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowSummary(true)}
          className="w-full bg-gradient-gold text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
        >
          <Calculator className="w-5 h-5" /> Calculate My Zakat
        </motion.button>
      </div>

      {/* Summary / Result Section - Below Calculator */}
      {showSummary && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-secondary rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
            <div className="bg-gradient-gold p-6 text-center text-white">
              <h2 className="font-display font-bold text-2xl">Zakat Summary</h2>
              <p className="opacity-90 text-sm mt-1">Your calculation results</p>
            </div>
            
            <div className="p-8 space-y-6 bg-secondary text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/70 font-medium">Total Assets</span>
                <span className="font-bold font-sans text-lg">{currencyLabel} {calculation.totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/70 font-medium">Liabilities</span>
                <span className="font-bold text-red-400 font-sans text-lg">- {currencyLabel} {parseNum(liabilities).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white font-bold text-lg">Net Wealth</span>
                <span className="font-bold text-lg font-sans">{currencyLabel} {calculation.netWealth.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 mb-2 uppercase tracking-wider font-bold">Nisab Threshold (Silver basis)</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold font-sans text-lg">{currencyLabel} {calculation.dynamicNisab.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  {!calculation.silverRateProvided && (
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">Estimated</span>
                  )}
                </div>
                {calculation.silverRateProvided ? (
                  <p className="text-xs text-white/60">Based on your entered Silver rate (52.5 Tolas).</p>
                ) : (
                  <p className="text-xs text-white/60">Please enter silver rate to calculate exact Nisab.</p>
                )}
              </div>

              <div className="pt-4 text-center">
                <p className="text-sm font-medium mb-2 opacity-80">Your Zakat Obligation</p>
                <div className={`text-5xl font-display font-bold py-6 rounded-xl border ${calculation.isEligible ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                  {currencyLabel} {calculation.zakatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                {!calculation.isEligible && calculation.netWealth > 0 && (
                  <p className="text-sm text-white/50 mt-3">Your net wealth is below the Nisab threshold. Zakat is not obligatory.</p>
                )}
                {calculation.isEligible && (
                  <p className="text-sm text-primary mt-3 font-semibold">2.5% of your Net Wealth</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSummary(false)}
            className="w-full py-3 px-6 bg-white border border-border rounded-xl font-semibold text-secondary hover:bg-gray-50 transition-colors duration-200"
          >
            Modify Calculation
          </button>
        </motion.div>
      )}
    </div>
  );
}
