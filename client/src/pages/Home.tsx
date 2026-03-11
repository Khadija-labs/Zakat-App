import { Layout } from "@/components/Layout";
import { ZakatCalculator } from "@/components/Calculator";
import { SEO } from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <Layout>
      <JsonLd />
      <SEO
        title="Free Zakat Calculator – Purify Your Wealth with Precision"
        description="Calculate your Zakat accurately according to Islamic principles. Private, client-side calculator for cash, gold, silver, savings & more. No data leaves your device."
        path="/"
      />
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.06] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div>
            <h1 className="arabic-text text-7xl md:text-[120px] text-secondary/90 dark:text-secondary leading-none mb-4 select-none drop-shadow-sm">
              الزكاة
            </h1>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Purify Your Wealth <br className="md:hidden" />
              <span className="text-gradient-gold italic">with Precision</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed font-sans">
              Calculate your Zakat accurately according to Islamic principles. 
              Our private, client-side calculator ensures your sensitive financial data never leaves your device.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="pb-24 -mt-6 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZakatCalculator />
        </div>
      </section>

    </Layout>
  );
}
