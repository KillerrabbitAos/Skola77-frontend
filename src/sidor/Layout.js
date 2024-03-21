import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <ul>
          <li className="header" id="main">
            <NavLink to="/" activeClassName="active">
              
              <img src="/Skola77.png" id="kebbe"></img>

            </NavLink>
          </li>
          <li className="header">
            <NavLink to="/Editor" activeClassName="active">Editor</NavLink>
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
      </div>

      <Outlet />
    </>
  );
};

export default Layout;