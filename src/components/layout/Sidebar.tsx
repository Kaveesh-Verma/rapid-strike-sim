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
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col min-h-screen shadow-sm">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-gray-900">Rapid Capture</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
