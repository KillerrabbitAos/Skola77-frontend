import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <ul>
          <li className="header" id="main">
            <NavLink to="/" activeClassName="active">Hem</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Editor" activeClassName="active">Editor</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Support" activeClassName="active">Support</NavLink>
          </li>
          <li className="header">
            <NavLink to="/Kontakt" activeClassName="active">Kontakt</NavLink>
          </li>
        </ul>
      </div>

      <Outlet />
    </>
  );
};

export default Layout;