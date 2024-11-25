import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { GetBitbankTradeHistory, GetBitbankTickers } from "~/api/bitbank";
import Coins from "./Coins";

import { CoinSummary } from "./type";

export type tradeHistory = {
  pair: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  fee_amount_quote: number;
  executed_at: number;
};

export async function loader() {
  try {
    const historyRes = await GetBitbankTradeHistory();
    if (historyRes.error) {
      console.error("Fetch error:", historyRes.error);
      return redirect("/500");
    }

    if (!historyRes.data) {
      console.error("Fetch error: data is null");
      return redirect("/500");
    }

    const historyByPair = historyRes.data.trades.reduce(
      (acc, r) => {
        const pair = r.pair;

        // 必要なデータを整形
        const trade = {
          pair: r.pair,
          side: r.side,
          price: Number(r.price),
          amount: Number(r.amount),
          fee_amount_quote: Number(r.fee_amount_quote),
          executed_at: r.executed_at,
        };

        // pair をキーとして分類
        if (!acc[pair]) {
          acc[pair] = []; // 新しいキーを作成
        }
        acc[pair].push(trade); // 配列に追加

        return acc;
      },
      {} as Record<string, tradeHistory[]>,
    );

    const tickerRes = await GetBitbankTickers();
    if (tickerRes.error) {
      console.error("Fetch error:", tickerRes.error);
      return redirect("/500");
    }

    if (!tickerRes.data) {
      console.error("Fetch error: data is null");
      return redirect("/500");
    }

    return {
      historyByPair: historyByPair,
      tickers: tickerRes.data,
    };
  } catch (e) {
    console.error("Fetch error:", e);
    return redirect("/500");
  }
}

export default function Exchange() {
  const data = useLoaderData<typeof loader>();
  const historyByPair = data.historyByPair;
  const tickers = data.tickers;

  const summaries: CoinSummary[] = [];

  for (const pair in historyByPair) {
    // リップルは除外
    if (pair == "xrp_jpy") {
      continue;
    }

    let summary: CoinSummary = {
      name: pair,
      currentPrice: 0,
      totalPurchase: 0,
      totalAmount: 0,
      totalFee: 0,
      pl: "",
      avaragePrice: 0,
    };

    const ticker = tickers.find((t) => t.pair == pair);
    if (!ticker) {
      console.error(`Ticker not found: ${pair}`);
      continue;
    }

    summary.currentPrice = Number(ticker.last);

    for (let i = 0; i < historyByPair[pair].length; i++) {
      const trade = historyByPair[pair][i];

      // 手数料を加算
      summary.totalFee += trade.fee_amount_quote;

      // 取引履歴から合計購入金額と合計コイン数を計算
      if (i == 0) {
        summary.totalPurchase = trade.price * trade.amount;
        summary.totalAmount = trade.amount;
      } else {
        if (trade.side == "buy") {
          summary.totalPurchase += trade.price * trade.amount;
          summary.totalAmount += trade.amount;
        }
        if (trade.side == "sell") {
          summary.totalPurchase -= trade.price * trade.amount;
          summary.totalAmount -= trade.amount;
        }
      }

      // 損益を計算
      const pl = summary.totalAmount * ticker.last - summary.totalPurchase;
      const prefix = pl > 0 ? "+" : "";

      // 損益を文字列に整形
      summary.pl = `${prefix}${pl.toFixed(2)}`;
      summary.avaragePrice = summary.totalPurchase / summary.totalAmount;
    }

    summaries.push(summary);
  }

  return (
    <>
      <h1 className="text-4xl mb-3">BitBank</h1>

      {summaries.map((s, i) => (
        <Coins key={i} summary={s} />
      ))}
    </>
  );
}
