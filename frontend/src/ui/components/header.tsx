import Logo from "./logo";
import NavLinks from "./navlinks";
import "../style/components/header.css";

export default function Header() {
  return (
    <header>
      <Logo size={32} />
      <NavLinks />
    </header>
  );
}
