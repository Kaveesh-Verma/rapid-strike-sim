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
    <aside className="w-64 border-r border-cyber-green/20 bg-black p-4 flex flex-col min-h-screen">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-cyber-green/20">
        <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
          <Shield className="w-6 h-6 text-cyber-green" />
        </div>
        <span className="font-bold text-cyber-green font-mono tracking-wider">RAPID CAPTURE</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm ${
                isActive
                  ? "bg-cyber-green/10 text-cyber-green border border-cyber-green/30"
                  : "text-gray-400 hover:text-cyber-green hover:bg-cyber-green/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-cyber-green" : "text-gray-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-cyber-red hover:bg-cyber-red/10 transition-colors font-mono text-sm border border-transparent hover:border-cyber-red/30"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
