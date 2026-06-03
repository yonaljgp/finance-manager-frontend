import { NavLink } from "react-router-dom";
import { Home, PlusCircle, CreditCard, History, Menu, X } from "lucide-react";
import ColorSchemeToggle from "./colorSchemeToggle";
import { useState, useEffect } from "react";
import { useClickOutside } from "@mantine/hooks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/crear-transaccion", icon: PlusCircle, label: "Transacción" },
    { to: "/prestamos", icon: CreditCard, label: "Préstamos" },
    { to: "/historial", icon: History, label: "Historial" },
  ];

  return (
    <div className="flex flex-col bg-background transition-colors duration-300">
      <header className="w-full h-20 p-4 border-b bg-sidebar border-border flex shadow-sidebar items-center justify-between bg-card">
        <h2>logo</h2>
        <nav className="hidden lg:flex   items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg transition-colors flex gap-2  ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div ref={menuRef} className="relative lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-20 bg-transparent border-none text-foreground hover:bg-transparent focus:bg-transparent"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {isOpen && (
            <aside className="fixed right-0 top-20 w-64 z-50 h-screen bg-card border-l border-border flex lg:hidden flex-col transition-colors duration-300">
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
                              ? "bg-primary text-primary-foreground"
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
              <div className="p-4 border-t border-border flex items-center justify-center">
                <ColorSchemeToggle />
              </div>
              <div className="p-4 border-t border-border">
                <div className="bg-accent rounded-lg p-4 transition-colors duration-300">
                  <p className="text-xs text-muted-foreground">Balance Total</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    $45,320.50
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </header>
    </div>
  );
}
