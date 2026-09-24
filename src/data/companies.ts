// Sample NSE/BSE universe (§2, §14). Real metrics would flow from
// MarketDataProvider + content pipeline (§43-44); values below are
// illustrative seed data with asOf/source traceability.

export interface SeedMetric {
  key: string;
  value: number;
  currency?: string;
  period?: string;
  asOf: string;
  source: string;
}

export interface SeedCompany {
  id: string;
  name: string;
  ticker: string;
  exchange: "NSE" | "BSE";
  sector: string;
  industry: string;
  description: string;
  products: string;
  geography: string;
  metrics: SeedMetric[];
}

const ASOF = "2026-09-23";
const SRC = "seed";

export const COMPANIES: SeedCompany[] = [
  {
    id: "c-dmart",
    name: "Avenue Supermarts",
    ticker: "DMART",
    exchange: "NSE",
    sector: "Consumer",
    industry: "Consumer Retail",
    description:
      "Operates DMart, a large network of value-focused hypermarkets and supermarkets across India.",
    products: "Food, grocery, apparel, general merchandise via DMart stores",
    geography: "Pan-India (Maharashtra, Gujarat, South India and expanding)",
    metrics: [
      { key: "PE", value: 72.4, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 14.2, period: "FY24", asOf: ASOF, source: SRC },
      { key: "ROCE", value: 18.5, period: "FY24", asOf: ASOF, source: SRC },
      { key: "MARKET_CAP_CR", value: 285000, currency: "INR", period: "TTM", asOf: ASOF, source: SRC },
    ],
  },
  {
    id: "c-hdfc",
    name: "HDFC Bank",
    ticker: "HDFCBANK",
    exchange: "NSE",
    sector: "Financials",
    industry: "Banking",
    description: "India's largest private-sector bank by assets, serving retail and wholesale customers.",
    products: "Deposits, loans, cards, payments, wealth management",
    geography: "Pan-India + overseas branches",
    metrics: [
      { key: "PE", value: 19.8, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 16.1, period: "FY24", asOf: ASOF, source: SRC },
      { key: "ROCE", value: 8.4, period: "FY24", asOf: ASOF, source: SRC },
    ],
  },
  {
    id: "c-itc",
    name: "ITC",
    ticker: "ITC",
    exchange: "NSE",
    sector: "Consumer",
    industry: "FMCG & Tobacco",
    description: "Diversified conglomerate: cigarettes, FMCG foods, paperboards, hotels and agri.",
    products: "Cigarettes, Aashirvaad, Sunfeast, Bingo!, Classmate, hotels",
    geography: "Pan-India",
    metrics: [
      { key: "PE", value: 27.3, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 28.9, period: "FY24", asOf: ASOF, source: SRC },
      { key: "DIV_YIELD", value: 3.1, period: "FY24", asOf: ASOF, source: SRC },
    ],
  },
  {
    id: "c-asian",
    name: "Asian Paints",
    ticker: "ASIANPAINT",
    exchange: "NSE",
    sector: "Materials",
    industry: "Paints & Coatings",
    description: "India's largest paint company with a vast dealer network and strong brand.",
    products: "Decorative paints, industrial coatings, waterproofing, home decor",
    geography: "India + 8 international markets",
    metrics: [
      { key: "PE", value: 48.6, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 24.5, period: "FY24", asOf: ASOF, source: SRC },
    ],
  },
  {
    id: "c-infosys",
    name: "Infosys",
    ticker: "INFY",
    exchange: "NSE",
    sector: "Technology",
    industry: "IT Services",
    description: "Global IT services major headquartered in Bengaluru; digital, cloud and consulting.",
    products: "Application services, Infosys Cobalt cloud, Finacle",
    geography: "Global (US ~60% revenue, India HQ)",
    metrics: [
      { key: "PE", value: 26.1, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 31.8, period: "FY24", asOf: ASOF, source: SRC },
    ],
  },
  {
    id: "c-reliance",
    name: "Reliance Industries",
    ticker: "RELIANCE",
    exchange: "NSE",
    sector: "Energy",
    industry: "Conglomerate (Energy/Retail/Telecom)",
    description: "India's largest company by market cap: O2C, Jio telecom, Reliance Retail.",
    products: "Refining, petrochemicals, Jio connectivity, retail stores",
    geography: "Pan-India, global energy footprint",
    metrics: [
      { key: "PE", value: 28.9, period: "TTM", asOf: ASOF, source: SRC },
      { key: "ROE", value: 9.4, period: "FY24", asOf: ASOF, source: SRC },
    ],
  },
];

export function findCompany(query: string): SeedCompany | undefined {
  const q = query.toUpperCase().replace(/[^A-Z]/g, "");
  return COMPANIES.find(
    (c) =>
      c.name.toUpperCase().replace(/[^A-Z]/g, "") === q ||
      c.ticker.toUpperCase() === query.toUpperCase().trim(),
  );
}
