import { NavLink } from "react-router-dom";
import {
  Home,
  PlusCircle,
  CreditCard,
  History,
  Menu,
  X,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useClickOutside } from "@mantine/hooks";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsOpen(false));
  const { logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useClickOutside(() => setIsUserMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/crear-transaccion", icon: PlusCircle, label: "Transacción" },
    { to: "/prestamos", icon: CreditCard, label: "Préstamos" },
    { to: "/historial", icon: History, label: "Historial" },
  ];

  return (
    <div className="flex flex-col bg-background transition-colors duration-300 relative">
      <header className="w-full h-20 p-4 border-b bg-sidebar border-border flex shadow-sidebar items-center justify-between bg-card">
        <h2 className="text-xl font-semibold">LOGO</h2>
        <nav className="hidden lg:flex   items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-colors flex gap-2 font-semibold  ${
                  isActive
                    ? "bg-active text-white"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* User Profile and Logout Dropdown */}
        <div className="hidden lg:block relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="button flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-accent"
          >
            <UserCircle className="w-5 h-5" />
            <span>Usuario</span>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-30">
              <div className="py-1">
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent button"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
        <div ref={menuRef} className="relative lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-20 bg-transparent border-none text-foreground hover:bg-transparent focus:bg-transparent"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sidebar (always mounted so transitions work on close) */}
          <aside
            className={`fixed right-0 top-0 w-60 z-50 h-screen bg-card transition-transform duration-300 transform border-l border-border flex lg:hidden flex-col ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center h-20 justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0 ">
                <h2 className="text-md font-semibold break-all">
                  Yonalfred Guzman
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-foreground hover:bg-accent rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-active text-white"
                            : "text-foreground hover:bg-accent"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-border">
              <div className="bg-accent rounded-lg p-4 transition-colors duration-300">
                <p className="text-xs text-muted-foreground">Balance Total</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  $45,320.50
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="button flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <h4>Cerrar Sesión</h4>
            </button>
          </aside>
        </div>
      </header>
    </div>
  );
}
