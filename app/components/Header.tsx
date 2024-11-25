import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <div className="flex items-center h-[72px] bg-gray-300">
      <div>
        <Link to="/">
          <p className="font-bold text-gray-700 ml-5 text-xl">CryptoView</p>
        </Link>
      </div>
    </div>
  );
}
