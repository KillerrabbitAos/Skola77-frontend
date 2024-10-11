import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <ul className="nav-links">
          <li className="header" id="main">
            <NavLink to="/">
              <img src="/skola77logga.png" alt="Skola77" id="kebbe" />
            </NavLink>
          </li>
          <li className="header">
            <NavLink to="/Placeringar" className={({ isActive }) => (isActive ? "active" : "")}>
              Placeringar
            </NavLink>
          </li>
          <li className="header">
            <NavLink to="/Klasser" className={({ isActive }) => (isActive ? "active" : "")}>
              Klasser
            </NavLink>
          </li>
          <li className="header">
            <NavLink to="/Support" className={({ isActive }) => (isActive ? "active" : "")}>
              Hjälp
            </NavLink>
          </li>
        </ul>

        <ul className="nav-account">
          <li className="header">
            <NavLink to="/mittKonto" className={({ isActive }) => (isActive ? "active" : "")} id="mittKonto">
              <img src="/account.svg" alt="Mitt konto" className="konto-ikon" />
            </NavLink>
          </li>
        </ul>
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
