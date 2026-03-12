import { Layout } from "@/components/Layout";
import { ZakatCalculator } from "@/components/Calculator";
import { SEO } from "@/components/SEO";

export default function CalculatorPage() {
  return (
    <Layout>
      <SEO
        title="Zakat Calculator – Calculate Your Zakat Accurately"
        description="Calculate your Zakat with our private, client-side calculator. Cash, gold, silver, savings, and more. No data leaves your device."
        path="/calculator"
      />
      <section className="pb-24 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ZakatCalculator />
        </div>
      </section>
    </Layout>
  );
}
