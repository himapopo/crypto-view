export type CoinSummary = {
  name: string; // コイン名
  currentPrice: number; // 現在の相場
  totalPurchase: number; // 合計購入金額
  totalAmount: number; // 合計コイン数
  totalFee: number; // 手数料
  pl: string; // 損益
  avaragePrice: number; // 平均取得価格
};
