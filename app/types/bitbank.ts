export type BitbankTradeHistory = {
  pair: string;
  side: "buy" | "sell";
  price: string;
  amount: string;
  fee_amount_quote: string;
  executed_at: number;
};

export type BitbankTradeHistoryResponse = {
  trades: BitbankTradeHistory[];
};

export type BitbankTickerResponse = {
  pair: string;
  last: number;
};

export type TradeHistory = {
  pair: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  fee_amount_quote: number;
  executed_at: number;
};
