import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="How ZakatCalc handles your data. We do not store your financial inputs; calculations run entirely on your device."
        path="/privacy-policy"
      />
      <div className="bg-secondary text-secondary-foreground py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 dark:text-primary">Privacy Policy</h1>
          <p className="text-lg text-secondary-foreground/80 font-light">Your financial data is yours alone.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border">
          <div className="prose prose-lg max-w-none text-foreground/80">
            <h2 className="font-display text-2xl font-bold text-secondary dark:text-primary mb-4">1. Complete Client-Side Processing</h2>
            <p className="mb-6">
              Our Zakat Calculator is designed with strict privacy in mind. <strong>We do not use a database to store your financial inputs.</strong> Every calculation is performed locally on your device (client-side) using JavaScript. When you refresh or close the page, your financial data is completely erased.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary dark:text-primary mb-4">2. Contact Form Submissions</h2>
            <p className="mb-6">
              If you choose to use our Contact Form to send us a message, the Name, Email, and Message you provide will be transmitted securely to our server solely for the purpose of reading and responding to your inquiry. We do not sell, rent, or share this communication data with third parties.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary dark:text-primary mb-4">3. Cookies & Tracking</h2>
            <p className="mb-6">
              We may use essential cookies to maintain website functionality and basic analytics to understand website traffic. However, none of these analytics track the financial numbers you input into the calculator.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary dark:text-primary mb-4">4. Updates to this Policy</h2>
            <p className="mb-6">
              This privacy policy is subject to change. Any updates will be reflected on this page. Your continued use of the website implies agreement to these terms.
            </p>

            <div className="mt-10 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
              <p className="font-bold text-secondary text-lg mb-2">Peace of Mind</p>
              <p className="text-sm">
                Calculate your Zakat freely knowing your numbers are safe, private, and known only to you and Allah (SWT).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
