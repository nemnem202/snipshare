import { NavLink } from "react-router-dom";
import "../style/components/navlinks.css";

export default function NavLinks() {
  return (
    <nav className="navlinks-container">
      <NavLink to={"/explorer"} className={({ isActive }) => (isActive ? "active" : "")}>
        Explorer
      </NavLink>
      <NavLink to={"/account"} className={({ isActive }) => (isActive ? "active" : "")}>
        Compte
      </NavLink>
    </nav>
  );
}
