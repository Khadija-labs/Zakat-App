import { useEffect } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://zakat-calculators.vercel.app";

export interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Updates document title and meta tags for SEO. Use once per page near the top.
 */
export function SEO({ title, description, path = "", noIndex = false }: SEOProps) {
  const fullTitle = title ? `${title} | ZakatCalc` : "Free Zakat Calculator Online – ZakatCalc | Gold, Silver, Cash (PKR, USD)";
  const fullUrl = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
  const desc =
    description ??
    "Free online Zakat calculator. Calculate Zakat on gold, silver, cash, savings & more. PKR, USD. Nisab-based, private.";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
      let el = document.querySelector(`${selector}[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    setMeta('meta[name="description"]', "name", "description", desc);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", desc);
    setMeta('meta[property="og:url"]', "property", "og:url", fullUrl);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    setMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.href = fullUrl;
    else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = fullUrl;
      document.head.appendChild(link);
    }
  }, [fullTitle, desc, fullUrl, noIndex]);

  return null;
}
