import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Heart, Shield, Calculator, BookOpen, Users } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About ZakatCalc"
        description="A trusted, privacy-first tool to help Muslims fulfill their Zakat obligation with clarity and confidence. Learn about our mission and values."
        path="/about"
      />
      <div className="bg-secondary text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">About ZakatCalc</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            A trusted, privacy-first tool to help Muslims fulfill their Zakat obligation with clarity and confidence.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 md:p-10 shadow-gold border border-border mb-10"
        >
          <h2 className="font-display text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
            <BookOpen className="text-primary w-7 h-7" /> Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            ZakatCalc was created to make calculating Zakat simple, accurate, and stress-free. We believe that fulfilling this pillar of Islam should not be hindered by complicated spreadsheets or uncertainty about thresholds and rates. Our goal is to provide a clear, scholarly-informed calculator that works entirely on your device—so your financial details stay private while you gain peace of mind.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are not a religious authority. We encourage you to confirm your calculation and any edge cases with a qualified Islamic scholar. ZakatCalc is a tool to support your journey, not to replace scholarly guidance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-8 border border-amber-200 dark:border-amber-800/60"
          >
            <Calculator className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-display text-xl font-bold text-secondary mb-3">Precision & Clarity</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              We support multiple asset categories—cash, savings, investments, digital assets, gold, and silver—with flexible units (grams and tolas) and clear Nisab calculation so you can align with mainstream scholarly opinion.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/60"
          >
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-display text-xl font-bold text-secondary mb-3">Privacy by Design</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              No database stores your numbers. All calculations run in your browser. Your wealth data never leaves your device unless you choose to contact us—and we do not log or retain that data for calculation purposes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary text-white rounded-2xl p-8 md:p-10 border border-primary/30"
        >
          <h3 className="font-display text-2xl font-bold text-primary mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" /> Who We Serve
          </h3>
          <p className="text-white/90 leading-relaxed mb-4">
            ZakatCalc is for anyone who wishes to estimate their Zakat in Pakistani Rupees (PKR) with a clean, accessible interface. Whether you are new to Zakat or have been paying for years, we aim to make the process straightforward and dignified—so you can focus on the spiritual act of giving, not on the mechanics.
          </p>
          <p className="text-white/80 text-sm italic">
            We are a small team building tools in the spirit of service. If you have feedback or suggestions, we would love to hear from you via our Contact page.
          </p>
        </motion.div>

        <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
          <p className="font-display font-bold text-secondary text-lg mb-2">Barakallahu Feekum</p>
          <p className="text-sm text-muted-foreground">
            May Allah accept your Zakat and purify your wealth. Thank you for trusting ZakatCalc.
          </p>
        </div>
      </div>
    </Layout>
  );
}
