import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <ul>
          <li className="header" id="main">
            <Link to="/">Hem</Link>
          </li>
          <li className="header">
            <Link to="/Editor">Editor</Link>
          </li>
          <li className="header">
            <Link to="/Support">Support</Link>
          </li>
        </ul>
      </div>

      <Outlet />
    </>
  )
};

export default Layout;