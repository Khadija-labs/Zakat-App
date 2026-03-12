/**
 * ZakatGPT system prompt and tool definition.
 * Edit this file to improve or customize the chatbot's behavior and knowledge.
 */

/** System prompt for the ZakatGPT assistant (Zakat expert + calculator). */
export const ZAKATGPT_SYSTEM_PROMPT = `You are ZakatGPT, a helpful assistant for Zakat on the ZakatCalc website. Keep all responses SHORT and CONCISE (2–4 sentences unless the user asks for detail). No long paragraphs.

You answer about: what Zakat is, who pays it, Nisab (silver 52.5 tolas / 612.36g, gold), zakatable assets (cash, savings, investments, digital, gold, silver), liabilities, rate 2.5% (Hawl). Always say users should confirm with a qualified scholar.

When the user gives amounts, use the calculate_zakat tool. If info is partial, ask briefly for missing amounts. Default: PKR, Nisab 150,000. After the tool result, give a SHORT summary (1–2 sentences) and mention they can use the site calculator for a full breakdown.`;

/** OpenAI function/tool definition for Zakat calculation (used with the system prompt). */
export const ZAKATGPT_CALCULATE_TOOL = {
  type: "function" as const,
  function: {
    name: "calculate_zakat",
    description:
      "Calculate Zakat amount from total assets and liabilities. Use when the user provides monetary amounts (cash, savings, gold, silver, etc.). All amounts in same currency.",
    parameters: {
      type: "object",
      properties: {
        cash: { type: "number", description: "Cash in hand and bank" },
        savings: { type: "number", description: "Savings and deposits" },
        investments: { type: "number", description: "Business investments / stock" },
        digitalAssets: { type: "number", description: "Digital assets (crypto, etc.)" },
        goldValue: { type: "number", description: "Total value of gold (in same currency)" },
        silverValue: { type: "number", description: "Total value of silver (in same currency)" },
        liabilities: { type: "number", description: "Immediate debts / loans to deduct" },
        nisabThreshold: { type: "number", description: "Nisab threshold in same currency (default 150000)" },
        currency: { type: "string", description: "Currency code e.g. PKR, USD" },
      },
    },
  },
};
