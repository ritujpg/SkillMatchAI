import { Link, useLocation } from "react-router-dom";
import { Calculator, ListChecks, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/saved", label: "Saved Calculations", icon: ListChecks },
  { to: "/rates", label: "Rates", icon: Percent },
];

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/calculator" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Calculator className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Die Cost Calculator
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-xl bg-secondary/60 p-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
