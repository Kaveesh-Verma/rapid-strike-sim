import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, BookOpen, BarChart3, Target, LogOut } from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/training", icon: BookOpen, label: "Training" },
  { path: "/scenarios", icon: Target, label: "Scenarios" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 border-r-2 border-border bg-sidebar p-4 flex flex-col min-h-screen">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-border">
        <Shield className="w-8 h-8 text-primary animate-pulse" />
        <span className="font-bold uppercase tracking-wider">Rapid Capture</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-muted text-foreground border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted hover:translate-x-1"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="uppercase text-sm tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors group"
      >
        <LogOut className="w-5 h-5 group-hover:animate-pulse" />
        <span className="uppercase text-sm tracking-wider">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
