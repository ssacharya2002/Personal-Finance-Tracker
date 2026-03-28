import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowDownUp,
  TrendingUp,
  Wallet,
  LogOut,
  TrendingDownIcon,
} from "lucide-react";
import { Button } from "./ui/button";

function Sidebar() {
  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "overview" },
    { name: "Income", icon: TrendingUp, path: "income" },
    { name: "Expenses", icon: TrendingDownIcon, path: "expenses" },
    { name: "Transactions", icon: ArrowDownUp, path: "transactions" },
    { name: "Budgets", icon: Wallet, path: "budgets" }
  ];

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <div className="w-64  h-screen bg-sidebar border-r flex flex-col justify-between">

      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <Wallet className="w-6 h-6" />
          <h1 className="text-lg font-semibold">FinTrack</h1>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom (Logout) */}

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-3 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
