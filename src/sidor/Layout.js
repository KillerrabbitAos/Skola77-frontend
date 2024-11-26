// Layout.js
import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";
import { data } from "../data";
import "./Layout.css";

const Layout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdown, setDropdown] = useState(isMobile && !isTablet);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const svg = (
    <img
      style={{ margin: "auto" }}
      src="/skola77logga.png"
      alt="Skola77"
      id="kebbe"
    />
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

  useEffect(() => {
    const anpassa = () => {
      if (window.outerWidth < window.outerHeight) {
        setDropdown(true);
      } else {
        setDropdown(false);
      }
    };

    anpassa();

    window.addEventListener("resize", anpassa);

    return () => window.removeEventListener("resize", anpassa);
  }, []);

  return (
    <>
      <div style={{zIndex: 2000}} className={!dropdown ? `navbar` : "bg-white h-[70px]"}>
        {dropdown ? (
          <div className="">
            <div className="w-full grid grid-cols-3">
              <div></div>
              <div className="flex items-center text-[3.5vh] justify-center">
                {
                  <>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? "active-item" : "hidden"
                      }
                    >
                      {svg}
                    </NavLink>
                    <NavLink
                      to="/Klasser"
                      className={({ isActive }) =>
                        isActive ? "active-item" : "hidden"
                      }
                    >
                      Klasser
                    </NavLink>
                    <NavLink
                      to="/Placeringar"
                      className={({ isActive }) =>
                        isActive ? "active-item" : "hidden"
                      }
                    >
                      Placeringar
                    </NavLink>
                    <NavLink
                      to="/Klassrum"
                      className={({ isActive }) =>
                        isActive ? "active-item" : "hidden"
                      }
                    >
                      Klassrum
                    </NavLink>
                    <NavLink
                      to="/Support"
                      className={({ isActive }) =>
                        isActive ? "active-item" : "hidden"
                      }
                    >
                      Hjälp
                    </NavLink>
                  </>
                }
              </div>
              <div onClick={toggleDropdown} className="place-self-end w-[70px]">
                <div className="h-[70px] aspect-square flex items-center justify-center">
                  <div
                    style={{
                      cursor: "pointer",
                      rotate: isDropdownOpen && "-90deg",
                      animationName: isDropdownOpen ? "snurrNer" : "snurrUpp",
                      animationDuration: "0.1s",
                    }}
                  >
                    {LogoSVG}
                  </div>
                </div>
              </div>
            </div>

            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <NavLink to="/" onClick={toggleDropdown}>
                    <div
                      style={{ textAlign: "center" }}
                      className="justify-center flex-row flex items-center"
                    >
                      {svg}
                    </div>
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Placeringar" onClick={toggleDropdown}>
                    <div
                      style={{ textAlign: "center" }}
                      className="justify-center flex-row flex items-center"
                    >
                      Placeringar
                    </div>
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Klassrum" onClick={toggleDropdown}>
                    <div
                      style={{ textAlign: "center" }}
                      className="justify-center flex-row flex items-center"
                    >
                      Klassrum
                    </div>
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Klasser" onClick={toggleDropdown}>
                    <div
                      style={{ textAlign: "center" }}
                      className="justify-center flex-row flex items-center"
                    >
                      Klasser
                    </div>
                  </NavLink>
                </li>
                <li className="dropdown-item">
                  <NavLink to="/Support" onClick={toggleDropdown}>
                    <div
                      style={{ textAlign: "center" }}
                      className="justify-center flex-row flex items-center"
                    >
                      Hjälp
                    </div>
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
                draggable="false"

                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Placeringar
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Klassrum"
                draggable="false"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Klassrum
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Klasser"
                draggable="false"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Klasser
              </NavLink>
            </li>
            <li className="header">
              <NavLink
                to="/Support"
                draggable="false"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Hjälp
              </NavLink>
            </li>
            <ul className="nav-account">
              <li className="header">
                <NavLink
                  to="/mittKonto"
                  draggable="false"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  id="mittKonto"
                >
                  <img
                    src="/account.svg"
                    alt="Mitt konto"
                    draggable="false"
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
