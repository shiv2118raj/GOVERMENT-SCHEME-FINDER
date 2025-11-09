import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function AnimatedNavLink({ to, children, onClick }) {
  // We color the link and let the stacked spans inherit via text-current.
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group relative inline-block overflow-hidden h-5 flex items-center text-sm",
          isActive ? "text-white" : "text-gray-300 hover:text-white",
        ].join(" ")
      }
    >
      <div className="flex flex-col transition-transform duration-[400ms] ease-out group-hover:-translate-y-1/2">
        <span className="text-current">{children}</span>
        <span className="text-current">{children}</span>
      </div>
    </NavLink>
  );
}

const DotLogo = () => (
  <div className="relative w-5 h-5 flex items-center justify-center">
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 -translate-x-1/2 opacity-80" />
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 -translate-y-1/2 opacity-80" />
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 -translate-y-1/2 opacity-80" />
    <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 -translate-x-1/2 opacity-80" />
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen((v) => !v);

  // Animate header shape
  useEffect(() => {
    if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => setHeaderShapeClass("rounded-full"), 300);
    }
    return () => {
      if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Sync auth state across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") setIsLoggedIn(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  const isAdmin = () => localStorage.getItem('role') === 'admin';

  const navLinksData = [
    { label: t("nav.home", "Home"), to: "/" },
    { label: t("nav.browseSchemes", "Browse Schemes"), to: "/schemes" },
    { label: `📄 ${t("nav.documents", "Documents")}`, to: "/documents" },
    { label: t("nav.recommendations", "Recommendations"), to: "/recommendations" },
    { label: t("nav.applications", "My Applications"), to: "/applications" },
  ];

  if (isAdmin()) {
    navLinksData.splice(0, navLinksData.length, // Clear existing links
      { label: t("nav.home", "Home"), to: "/" },
      { label: "User", to: "/admin/users" },
      { label: "Document", to: "/admin/documents" },
      { label: "Application", to: "/admin/applications" }
    );
  }

  return (
    <header
      className={[
        "fixed top-6 left-1/2 -translate-x-1/2 z-20",
        "flex flex-col items-center",
        "pl-6 pr-6 py-3 backdrop-blur-sm",
        headerShapeClass,
        "border border-[#333] bg-[#1f1f1f57]",
        "w-[calc(100%-2rem)] sm:w-auto",
        "transition-[border-radius] duration-300 ease-in-out",
      ].join(" ")}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <DotLogo />
          <span className="hidden sm:inline font-semibold tracking-wide text-gray-200">
            SCHEME GENIE
          </span>
        </Link>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
            >
              {t("nav.logout", "Logout")}
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200"
            >
              {t("nav.login", "Login")}
            </NavLink>
          )}
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? t("nav.closeMenu", "Close menu") : t("nav.openMenu", "Open menu")}
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={[
          "sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden",
          isOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none",
        ].join(" ")}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  "w-full text-center transition-colors",
                  isActive ? "text-white" : "text-gray-300 hover:text-white",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full"
            >
              {t("nav.logout", "Logout")}
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full text-center"
            >
              {t("nav.login", "Login")}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}