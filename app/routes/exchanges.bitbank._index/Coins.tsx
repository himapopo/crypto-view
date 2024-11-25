import { CoinSummary } from "./type";

type CoinsProps = {
  summary: CoinSummary;
};

export default function Coins(props: CoinsProps) {
  return (
    <div className="border-t-2 border-gray-4 pt-4 mb-4">
      <h2 className="">コイン名: {props.summary.name}</h2>
      <p>現在の相場: 1コイン = {props.summary.currentPrice.toFixed(2)}円</p>
      <p>平均取得価格: {props.summary.avaragePrice.toFixed(2)}円</p>
      <p>合計購入金額: {props.summary.totalPurchase.toFixed(2)}円</p>
      <p>
        合計コイン数: {props.summary.totalAmount.toFixed(2)} (
        {(props.summary.totalAmount * props.summary.currentPrice).toFixed(2)}
        円)
      </p>
      <p>損益: {props.summary.pl}円</p>
      <p>手数料: {props.summary.totalFee.toFixed(2)}円</p>
    </div>
  );
}
