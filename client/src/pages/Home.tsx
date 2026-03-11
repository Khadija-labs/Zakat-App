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
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div>
            <h1 className="arabic-text text-8xl md:text-[140px] text-secondary/90 leading-none mb-4 select-none drop-shadow-sm">
              الزكاة
            </h1>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Purify Your Wealth <br className="md:hidden" />
              <span className="text-gradient-gold italic">with Precision</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed font-sans">
              Calculate your Zakat accurately according to Islamic principles. 
              Our private, client-side calculator ensures your sensitive financial data never leaves your device.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="pb-24 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZakatCalculator />
        </div>
      </section>

    </Layout>
  );
}
