// Finance glossary — concise educational explanations shown after
// finding a word (§6) or solving crossword clues (§7).

export interface Term {
  term: string;
  short: string;
  long: string;
  theme: string;
}

export const GLOSSARY: Term[] = [
  { term: "DIVIDEND", short: "Profit paid to shareholders", long: "A distribution of a company's earnings to shareholders, usually in cash. Yield = annual dividend / share price.", theme: "Stock Market Basics" },
  { term: "REVENUE", short: "Total sales", long: "The total income from selling goods/services before any expenses — the 'top line'.", theme: "Accounting" },
  { term: "EBITDA", short: "Earnings before interest, tax, depreciation", long: "Operating performance proxy: Earnings Before Interest, Taxes, Depreciation & Amortisation.", theme: "Fundamental Analysis" },
  { term: "ROE", short: "Return on Equity", long: "Net profit / shareholder equity. Measures profit generated per rupee of equity.", theme: "Fundamental Analysis" },
  { term: "ROCE", short: "Return on Capital Employed", long: "Measures how efficiently a company generates operating profit from capital employed.", theme: "Fundamental Analysis" },
  { term: "EPS", short: "Earnings Per Share", long: "Net profit / outstanding shares. Higher EPS generally means more profitable per share.", theme: "Valuation" },
  { term: "CAPEX", short: "Capital Expenditure", long: "Money spent on long-term assets like plants, stores and equipment.", theme: "Accounting" },
  { term: "MARGIN", short: "Profit as % of sales", long: "E.g. net margin = net profit / revenue. Shows pricing power and cost control.", theme: "Fundamental Analysis" },
  { term: "DEBT", short: "Borrowed money", long: "Loans and bonds a company must repay. High debt raises risk; check Debt/Equity.", theme: "Banking" },
  { term: "DCF", short: "Discounted Cash Flow", long: "Valuation method: present value of projected future cash flows discounted at WACC.", theme: "Valuation" },
  { term: "CASHFLOW", short: "Cash in vs out", long: "Actual cash generated. Free cash flow = operating cash flow minus capex.", theme: "Accounting" },
  { term: "WACC", short: "Weighted Average Cost of Capital", long: "Blended required return of equity + debt. Used as discount rate in DCF.", theme: "Valuation" },
  { term: "STOCK", short: "Share of ownership", long: "A unit of ownership in a company listed on NSE/BSE, giving claim on earnings.", theme: "Stock Market Basics" },
  { term: "BOND", short: "Loan to issuer", long: "Fixed-income security: you lend money, issuer pays interest + principal.", theme: "Stock Market Basics" },
  { term: "PROFIT", short: "Revenue minus expenses", long: "What's left after all costs. Net income is the bottom line.", theme: "Accounting" },
  { term: "YIELD", short: "Return as % of price", long: "E.g. dividend yield or bond yield — income relative to price paid.", theme: "Valuation" },
];

export const termFor = (w: string) => GLOSSARY.find((g) => g.term === w.toUpperCase());
