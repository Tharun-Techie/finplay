// Pluggable market-data abstraction (§15). Never couple to one provider.
// MVP ships a MOCK provider with NSE sample data; real providers implement
// the same interface (selection based on licensing/cost/limits).

export interface Quote {
  ticker: string;
  exchange: string;
  price: number;
  currency: string;
  asOf: string;
  source: string;
}

export interface MarketDataProvider {
  name: string;
  getQuote(ticker: string, exchange?: string): Promise<Quote | null>;
  getFundamentals(ticker: string): Promise<Record<string, number> | null>;
}

class MockProvider implements MarketDataProvider {
  name = "MOCK";
  async getQuote(ticker: string, exchange = "NSE"): Promise<Quote> {
    return {
      ticker: ticker.toUpperCase(),
      exchange,
      price: 100 + ticker.length * 37.5,
      currency: "INR",
      asOf: new Date().toISOString(),
      source: "mock",
    };
  }
  async getFundamentals() {
    return null;
  }
}

export function getMarketDataProvider(): MarketDataProvider {
  // const name = process.env.MARKET_DATA_PROVIDER ?? "MOCK";
  // switch (name) { case "NSE": return new NseProvider(); ... }
  return new MockProvider();
}
