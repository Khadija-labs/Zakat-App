import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactSubmit } from "@shared/schema";
import { useSubmitContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useEffect, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, options: { sitekey: string }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
      ready: (cb: () => void) => void;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

export default function Contact() {
  const submitContact = useSubmitContact();
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const form = useForm<ContactSubmit>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      recaptchaToken: "",
    },
  });

  // Load reCAPTCHA script and render widget when site key is set
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    const scriptId = "recaptcha-script";

    const renderWidget = () => {
      const container = recaptchaRef.current;
      if (!container || widgetIdRef.current !== null) return;
      if (!window.grecaptcha) return;
      try {
        widgetIdRef.current = window.grecaptcha.render(container, {
          sitekey: RECAPTCHA_SITE_KEY,
        });
        setRecaptchaReady(true);
      } catch (e) {
        console.warn("[reCAPTCHA] render error:", e);
      }
    };

    const scheduleRender = () => {
      // Defer so the ref is definitely attached to the DOM
      return window.setTimeout(() => {
        window.grecaptcha?.ready(renderWidget);
      }, 100);
    };

    if (document.getElementById(scriptId)) {
      const timeoutId = scheduleRender();
      return () => {
        window.clearTimeout(timeoutId);
        widgetIdRef.current = null;
      };
    }

    (window as Window & { onRecaptchaLoad?: () => void }).onRecaptchaLoad = () => {
      window.grecaptcha?.ready(renderWidget);
    };

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Give the container ref a moment to be attached
      window.setTimeout(() => window.grecaptcha?.ready(renderWidget), 100);
    };
    document.head.appendChild(script);

    return () => {
      delete (window as Window & { onRecaptchaLoad?: () => void }).onRecaptchaLoad;
      widgetIdRef.current = null;
    };
  }, []);

  const onSubmit = (data: ContactSubmit) => {
    const token = RECAPTCHA_SITE_KEY && window.grecaptcha
      ? window.grecaptcha.getResponse(widgetIdRef.current ?? undefined)
      : "";
    if (RECAPTCHA_SITE_KEY && !token) {
      form.setError("root", { message: "Please complete the reCAPTCHA verification." });
      return;
    }
    submitContact.mutate(
      { name: data.name, email: data.email, message: data.message, recaptchaToken: token || undefined },
      {
        onSuccess: () => {
          form.reset({ name: "", email: "", message: "", recaptchaToken: "" });
          if (RECAPTCHA_SITE_KEY && window.grecaptcha && widgetIdRef.current !== null) {
            window.grecaptcha.reset(widgetIdRef.current);
          }
        },
      }
    );
  };

  return (
    <Layout>
      <div className="bg-secondary text-white py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto font-light leading-relaxed">
            Have a question, suggestion, or feedback? We would love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 md:p-10 shadow-gold border border-border"
        >
          <p className="text-muted-foreground text-sm mb-6">
            We do not store your message in a database. It is sent directly to our team so we can respond. Your data is not used for marketing or shared with third parties.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        className="text-base py-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="text-base py-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-semibold">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your message (emojis welcome!)"
                        className="min-h-[140px] text-base resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {RECAPTCHA_SITE_KEY && (
                <div className="flex flex-col gap-2">
                  <div
                    ref={recaptchaRef}
                    className="min-h-[78px] [&_.grecaptcha-badge]:self-start"
                    style={{ minWidth: 304 }}
                  />
                  {form.formState.errors.root?.message && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
                  )}
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-gold text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl"
                disabled={submitContact.isPending}
              >
                {submitContact.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
}
