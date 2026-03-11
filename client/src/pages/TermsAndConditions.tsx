import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { FileText } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function TermsAndConditions() {
  return (
    <Layout>
      <SEO
        title="Terms & Conditions"
        description="Terms of use for ZakatCalc. An informational calculator for Zakat estimation; verify with a qualified scholar."
        path="/terms-and-conditions"
      />
      <div className="bg-secondary text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-lg text-white/70 font-light">Please read these terms before using ZakatCalc.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border">
          <div className="prose prose-lg max-w-none text-foreground/80">
            <h2 className="font-display text-2xl font-bold text-secondary mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing or using ZakatCalc (“the Service”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">2. Nature of the Service</h2>
            <p className="mb-6">
              ZakatCalc is an informational calculator designed to help users estimate their Zakat obligation in Pakistani Rupees (PKR). It is not a substitute for religious scholarship or a fatwa. Calculations are based on commonly cited thresholds (e.g. silver Nisab) and are intended for guidance only. You are responsible for verifying your obligation with a qualified Islamic scholar before paying Zakat.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">3. No Religious or Legal Advice</h2>
            <p className="mb-6">
              We do not provide religious (Shari’ah) or legal advice. Rates, Nisab values, and asset categories may vary according to scholarly opinion and local law. Always consult a knowledgeable scholar for definitive rulings on your personal situation.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">4. Privacy and Data</h2>
            <p className="mb-6">
              Our calculator runs on your device; we do not store your financial inputs in a database. If you use the Contact form, we receive only the name, email, and message you submit, which we use solely to respond to your inquiry. We do not sell or share your data with third parties for marketing. For full details, see our <Link href="/privacy-policy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">5. Use of the Website</h2>
            <p className="mb-6">
              You agree to use the Service only for lawful purposes. You must not attempt to disrupt the Service, compromise its security, or use it to send spam or malicious content. We reserve the right to restrict or terminate access if we believe these terms have been violated.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">6. Disclaimer of Warranties</h2>
            <p className="mb-6">
              The Service is provided “as is” without warranties of any kind. We do not guarantee that the calculator is error-free or that results are religiously or legally correct. You use the Service at your own risk.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">7. Limitation of Liability</h2>
            <p className="mb-6">
              To the fullest extent permitted by law, ZakatCalc and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or reliance on its results, including but not limited to religious or financial decisions made based on the calculator.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">8. Changes to Terms</h2>
            <p className="mb-6">
              We may update these Terms and Conditions from time to time. The updated version will be posted on this page with a revised date. Your continued use of the Service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="font-display text-2xl font-bold text-secondary mb-4">9. Contact</h2>
            <p className="mb-6">
              For questions about these terms, please use our <Link href="/contact" className="text-primary font-semibold hover:underline">Contact</Link> page.
            </p>

            <div className="mt-10 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
              <p className="font-bold text-secondary text-lg mb-2">Summary</p>
              <p className="text-sm">
                ZakatCalc is a guidance tool only. Verify with a scholar. We do not store your calculation data. Use responsibly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
