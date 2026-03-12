import { Layout } from "@/components/Layout";
import { ZakatCalculator } from "@/components/Calculator";
import { SEO } from "@/components/SEO";
import { Calculator } from "lucide-react";

export default function CalculatorPage() {
  return (
    <Layout>
      <SEO
        title="Zakat Calculator – Calculate Your Zakat Accurately"
        description="Calculate your Zakat with our private, client-side calculator. Cash, gold, silver, savings, and more. No data leaves your device."
        path="/calculator"
      />
      <div className="bg-secondary text-secondary-foreground py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calculator className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 dark:text-primary">Calculator</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-xl mx-auto font-light leading-relaxed">
            Enter your assets and liabilities to calculate your Zakat obligation accurately.
          </p>
        </div>
      </div>

      <section className="pb-24 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZakatCalculator />
        </div>
      </section>
    </Layout>
  );
}
