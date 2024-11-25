import { Link } from "@remix-run/react";
import { Exchanges } from "../../constants/exchange";

export default function Exchange() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2">連携中の取引所一覧</h1>
      <ul>
        {Exchanges.map((exchange) => {
          return (
            <li>
              <Link to={`/exchanges/${exchange.name}`}>{exchange.display}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
