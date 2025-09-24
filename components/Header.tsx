import Link from "next/link";
import Avatar from "./Avatar";

function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5">
      <Link href="/" className="flex items-center text-4xl font-thin">
        <Avatar seed="PAPAFAM Support Agent" />
        <div className="space-y-1">
          <h1>Assistly</h1>
          <h2 className="text-sm">Your Customizable AI Chat Agent</h2>
        </div>
      </Link>
    </header>
  );
}
export default Header;
