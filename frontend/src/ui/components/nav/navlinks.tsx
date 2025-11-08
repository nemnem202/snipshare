import { NavLink, useNavigate } from "react-router-dom";
import "../../style/components/navlinks.css";
import useGetSession from "../../../hooks/get_session";
import Fetcher from "../../../lib/fetcher";
import type { ServerResponse } from "../../../types/general/response";
import { useContext } from "react";
import { SessionContext } from "../../../provider/session_provider";

export default function NavLinks() {
  const session = useGetSession();
  const nav = useNavigate();
  const sessionContext = useContext(SessionContext);
  const logout = async () => {
    const res = await Fetcher.get<ServerResponse>("/auth/delete/session");

    if (res.success) {
      if (sessionContext) sessionContext.setSession(null);
      nav("/explorer");
    }
  };
  return (
    <nav className="navlinks-container">
      <NavLink to={"/explorer"} className={({ isActive }) => (isActive ? "active" : "")}>
        Explorer
      </NavLink>
      <NavLink to={"/account"} className={({ isActive }) => (isActive ? "active" : "")}>
        Compte
      </NavLink>
      {session ? (
        <a className="cursor-pointer" onClick={logout}>
          Déconnexion
        </a>
      ) : (
        <NavLink to={"/login"} className={({ isActive }) => (isActive ? "active" : "")}>
          Connexion
        </NavLink>
      )}
    </nav>
  );
}
