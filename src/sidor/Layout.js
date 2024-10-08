import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <ul className="nav-links">
          <li className="header" id="main">
            <NavLink to="/" activeClassName="active">
              <img src="/skola77logga.png" alt='Skola77' id="kebbe" />
            </NavLink>
          </li>
          <li className="header">
            <NavLink to="/Editor" activeClassName="active">Editor</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Placeringar" activeClassName="active">Placeringar</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Support" activeClassName="active">Hjälp</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Kontakt" activeClassName="active">Kontakt</NavLink>
          </li>
          <li className="header">
            <NavLink to="/OmOss" activeClassName="active">Om</NavLink>
          </li>
        </ul>
        <ul className="nav-account">
          <li className="header">
            <NavLink to="/mittKonto" activeClassName="active" id="mittKonto">Mitt konto</NavLink>
          </li>
        </ul>
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
