import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, HeartHandshake, FileText, Menu, X, Users, Mail, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Calculator", icon: <HeartHandshake className="w-4 h-4" /> },
    { href: "/understanding-zakat", label: "Understanding Zakat", icon: <Moon className="w-4 h-4" /> },
    { href: "/about", label: "About Us", icon: <Users className="w-4 h-4" /> },
    { href: "/contact", label: "Contact Us", icon: <Mail className="w-4 h-4" /> },
    { href: "/terms-and-conditions", label: "Terms and Conditions", icon: <Scale className="w-4 h-4" /> },
    { href: "/privacy-policy", label: "Privacy and Policies", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative islamic-pattern">
      {/* Top Header Strip */}
      <div className="bg-secondary text-secondary-foreground py-2 text-center text-sm font-semibold tracking-wide">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
      </div>

      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <Moon className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-secondary leading-none">
                  Zakat<span className="text-primary">Calc</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="md:hidden p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    location === link.href
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                  <Moon className="text-white w-5 h-5" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white">ZakatCalc</h2>
              </Link>
              <p className="text-secondary-foreground/80 leading-relaxed font-sans">
                Purify your wealth with precision. A simple, professional, and secure client-side calculator for managing your Islamic obligations.
              </p>
            </div>
            
            <div>
              <h3 className="font-display font-bold text-xl text-primary mb-6">Quick Links</h3>
              <ul className="space-y-4 font-sans text-secondary-foreground/80">
                <li><Link href="/" className="hover:text-primary transition-colors">Calculator</Link></li>
                <li><Link href="/understanding-zakat" className="hover:text-primary transition-colors">Understanding Zakat</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms and Conditions</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy and Policies</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-primary mb-6">Contact Us</h3>
              <p className="font-sans text-secondary-foreground/80 mb-2">
                Have questions? Use our <Link href="/contact" className="text-primary hover:underline font-semibold">Contact</Link> page. For religious rulings, consult a qualified Islamic scholar.
              </p>
              <p className="font-sans text-sm text-primary mt-4">
                * No calculation data is saved on our servers. All Zakat math runs on your device.
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-sm font-sans text-secondary-foreground/60">
            <p>&copy; {new Date().getFullYear()} ZakatCalc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
