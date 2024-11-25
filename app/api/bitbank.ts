import {
  BitbankTradeHistoryResponse,
  BitbankTickerResponse,
} from "~/types/bitbank";
import { Get } from "./client";
import crypto from "crypto";

const apiKey = process.env.BITBANK_API_KEY;
const secret = process.env.BITBANK_API_SECRET;

const privateURL = "https://api.bitbank.cc/v1";
const publicURL = "https://public.bitbank.cc";

export const GetBitbankTradeHistoryByPair = (pair: string) => {
  const now = Date.now();
  const window = 5000;

  const hash = crypto.createHmac("sha256", secret!);
  hash.update(
    `${now}${window}/v1/user/spot/trade_history?order=asc&pair=${pair}`,
  );
  const hashed = hash.digest("hex");

  const header = {
    "ACCESS-KEY": apiKey!,
    "ACCESS-SIGNATURE": hashed,
    "ACCESS-REQUEST-TIME": now.toString(),
    "ACCESS-TIME-WINDOW": window.toString(),
  };
  return Get<BitbankTradeHistoryResponse>(
    `${privateURL}/user/spot/trade_history?order=asc&pair=${pair}`,
    { headers: header },
  );
};

export const GetBitbankTradeHistory = () => {
  const now = Date.now();
  const window = 5000;

  const hash = crypto.createHmac("sha256", secret!);
  hash.update(`${now}${window}/v1/user/spot/trade_history?order=asc`);
  const hashed = hash.digest("hex");

  const header = {
    "ACCESS-KEY": apiKey!,
    "ACCESS-SIGNATURE": hashed,
    "ACCESS-REQUEST-TIME": now.toString(),
    "ACCESS-TIME-WINDOW": window.toString(),
  };
  return Get<BitbankTradeHistoryResponse>(
    `${privateURL}/user/spot/trade_history?order=asc`,
    { headers: header },
  );
};

export const GetBitbankTickerByPair = (pair: string) => {
  return Get<BitbankTickerResponse>(`${publicURL}/${pair}/ticker`);
};

export const GetBitbankTickers = () => {
  return Get<BitbankTickerResponse[]>(`${publicURL}/tickers_jpy`);
};
