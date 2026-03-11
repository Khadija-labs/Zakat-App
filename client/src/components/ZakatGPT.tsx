import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME =
  "Assalamu alaikum! I'm **ZakatGPT**. Ask me anything about Zakat—rules, Nisab, what to pay on—or tell me your amounts (cash, savings, gold, etc.) and I'll calculate your Zakat for you.";

export function ZakatGPT() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setError(null);
    try {
      const nextMessages = [...messages, { role: "user" as const, content: text }];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message?.content ?? "No response." },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[100] w-[min(400px,calc(100vw-3rem))] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "min(520px, 70vh)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-secondary text-secondary-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-bold text-lg">ZakatGPT</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              {error && (
                <p className="text-sm text-destructive px-2">{error}</p>
              )}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Textarea
                placeholder="Ask about Zakat or give amounts to calculate..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="min-h-[44px] max-h-24 resize-none"
                disabled={loading}
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90"
                onClick={send}
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-gradient-gold text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label={open ? "Close ZakatGPT" : "Open ZakatGPT"}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </>
  );
}
