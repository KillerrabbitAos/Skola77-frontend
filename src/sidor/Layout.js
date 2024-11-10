// Layout.js
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { isMobile } from "react-device-detect";
import "./Layout.css";

const Layout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const svg = (
    <img style={{margin: "auto"}} src="/skola77logga.png" alt="Skola77" id="kebbe" />
  );
  const LogoSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 50 50"
      aria-label="Menu Icon"
    >
      <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z" />
    </svg>
  );

  return (
    <>
      <div className="navbar">
        {isMobile ? (
          <div className="mobile-nav" style={{right:"0px", position: "absolute", width:"fit-content"}}>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              {LogoSVG}
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <NavLink to="/" onClick={toggleDropdown}>
                    {svg}
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Placeringar" onClick={toggleDropdown}>
                    Placeringar
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Klassrum" onClick={toggleDropdown}>
                    Klassrum
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Klasser" onClick={toggleDropdown}>
                    Klasser
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Support" onClick={toggleDropdown}>
                    Hjälp
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/mittKonto" onClick={toggleDropdown}>
                    <img
                      src="/account.svg"
                      alt="Mitt konto"
                      className="konto-ikon"
                    />
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <ul className="nav-links">
            <li className="header" id="main">
              <NavLink to="/">{svg}</NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Placeringar"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Placeringar
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Klassrum"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Klassrum
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Klasser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Klasser
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Support"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Hjälp
              </NavLink>
            </li>
            <ul className="nav-account">
              <li className="header">
                <NavLink
                  to="/mittKonto"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  id="mittKonto"
                >
                  <img
                    src="/account.svg"
                    alt="Mitt konto"
                    className="konto-ikon"
                  />
                </NavLink>
              </li>
            </ul>
          </ul>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
