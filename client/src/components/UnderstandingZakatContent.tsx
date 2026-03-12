import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Info, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AHADITH_ZAKAT, INITIAL_HADITH_COUNT, HADITH_INCREMENT } from "@/data/ahadithZakat";

function HadithCard({ text, source, lang }: { text: string; source: string; lang: "en" | "ur" | "ar" }) {
  const textClass =
    lang === "en"
      ? "text-lg md:text-xl font-display italic leading-relaxed font-light"
      : lang === "ar"
        ? "text-2xl md:text-3xl font-arabic leading-relaxed tracking-wide"
        : "text-xl md:text-2xl font-arabic leading-relaxed";
  return (
    <div className="bg-white/[0.14] backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl relative">
      <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
      <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
      <p className={`pr-8 ${textClass}`}>{text}</p>
      <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">{source}</p>
    </div>
  );
}

export function UnderstandingZakatContent() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_HADITH_COUNT);
  const total = AHADITH_ZAKAT.length;
  const visible = AHADITH_ZAKAT.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  const isExpanded = visibleCount > INITIAL_HADITH_COUNT;

  const handleReadMore = () => {
    setVisibleCount((c) => Math.min(c + HADITH_INCREMENT, total));
  };
  const handleReadLess = () => {
    setVisibleCount(INITIAL_HADITH_COUNT);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-lg prose-headings:font-display prose-headings:text-secondary dark:prose-headings:text-primary max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 md:p-10 shadow-gold border border-border mb-10"
        >
          <h2 className="flex items-center gap-3 text-3xl font-bold border-b border-border pb-4 text-foreground dark:text-primary">
            <Info className="text-primary w-8 h-8" /> What is Zakat?
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Zakat is an obligatory charitable contribution and the third pillar of Islam. It is considered a right that the poor have over the wealth of the rich. The word itself means "to purify," "to grow," and "to bless." By paying Zakat, a Muslim purifies their remaining wealth and soul.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            It is mandatory for any adult Muslim of sound mind who possesses wealth above a specific threshold (Nisab) for a full Islamic lunar year (Hawl).
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-8 border border-amber-200 dark:border-amber-800/60"
          >
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-amber-600" /> The Nisab Threshold
            </h3>
            <p className="text-sm text-amber-800 mb-4 leading-relaxed dark:text-amber-200">
              Nisab is the minimum amount of wealth a Muslim must own before they are liable to pay Zakat. The historical Nisab thresholds are:
            </p>
            <ul className="space-y-2 text-sm text-amber-900 font-semibold dark:text-amber-200">
              <li className="flex justify-between border-b border-amber-200 pb-2 dark:border-amber-800">
                <span>Gold Nisab:</span>
                <span>87.48 grams (7.5 Tolas)</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Silver Nisab:</span>
                <span>612.36 grams (52.5 Tolas)</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-950/50 rounded-lg text-xs text-amber-900 dark:text-amber-200">
              Most modern scholars advise using the Silver Nisab for calculating cash and other assets to maximize benefit to the poor.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/60"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <AlertCircle className="text-slate-500 dark:text-slate-400" /> Zakatable Assets
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Zakat is payable on assets that have the potential to grow. These include:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>Gold, silver, and precious metals</li>
              <li>Cash in hand and bank accounts</li>
              <li>Business merchandise / stock</li>
              <li>Shares, stocks, and bonds</li>
              <li>Agricultural produce and livestock</li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
              * Personal items like your primary home, car, and clothing are exempt from Zakat.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hadith Section */}
      <div className="mt-24 bg-secondary text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10 mix-blend-overlay" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold mb-10 text-primary text-center">Words of the Prophet ﷺ</h2>

          <Tabs defaultValue="english" className="w-full">
            <TabsList className="bg-white/10 border border-white/20 p-1 mb-8 inline-flex w-full justify-center">
              <TabsTrigger value="english" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white">English</TabsTrigger>
              <TabsTrigger value="urdu" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white font-arabic">اردو</TabsTrigger>
              <TabsTrigger value="arabic" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white font-arabic">العربية</TabsTrigger>
            </TabsList>

            <div className="space-y-10">
              <TabsContent value="english" className="m-0 space-y-10">
                {visible.map((h, i) => (
                  <HadithCard key={i} text={h.en} source={h.source} lang="en" />
                ))}
              </TabsContent>
              <TabsContent value="urdu" className="m-0 space-y-10">
                {visible.map((h, i) => (
                  <HadithCard key={i} text={h.ur} source={h.source} lang="ur" />
                ))}
              </TabsContent>
              <TabsContent value="arabic" className="m-0 space-y-10">
                {visible.map((h, i) => (
                  <HadithCard key={i} text={h.ar} source={h.source} lang="ar" />
                ))}
              </TabsContent>
            </div>

            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleReadMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Read more <ChevronDown className="w-4 h-4" />
                </button>
              )}
              {isExpanded && (
                <button
                  type="button"
                  onClick={handleReadLess}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Read less <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
