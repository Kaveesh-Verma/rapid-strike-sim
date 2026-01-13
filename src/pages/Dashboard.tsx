import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Target, BookOpen, AlertTriangle, Award, Activity, TrendingUp, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { stats, loadStats } = useProfile(userId);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setUserId(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Refresh stats when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        loadStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userId, loadStats]);

  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-cyber-green border-t-transparent rounded-full mx-auto mb-4" />
          <div className="text-gray-500 font-mono">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const getSecurityLevel = () => {
    if (stats.accuracy >= 80 && stats.scenariosAttempted >= 5) return { level: "ELITE", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50" };
    if (stats.accuracy >= 60 && stats.scenariosAttempted >= 3) return { level: "TRAINED", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50" };
    if (stats.scenariosAttempted >= 1) return { level: "ROOKIE", color: "text-cyber-green", bg: "bg-cyber-green/20", border: "border-cyber-green/50" };
    return { level: "UNRANKED", color: "text-gray-500", bg: "bg-gray-800", border: "border-gray-700" };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cyber-green font-mono">DASHBOARD</h1>
              <p className="text-gray-500 font-mono">Welcome back, <span className="text-cyber-green">{user?.email}</span></p>
            </div>
            <span className={`text-xs uppercase px-3 py-1.5 rounded-full font-semibold font-mono ${securityLevel.color} ${securityLevel.bg} ${securityLevel.border} border ml-auto`}>
              {securityLevel.level}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Award} 
            label="Total Score" 
            value={stats.totalScore} 
            highlight 
          />
          <StatCard 
            icon={BookOpen} 
            label="Modules Done" 
            value={stats.modulesCompleted} 
            suffix="/15"
          />
          <StatCard 
            icon={Target} 
            label="Scenarios" 
            value={stats.scenariosAttempted} 
          />
          <StatCard 
            icon={Activity} 
            label="Accuracy" 
            value={stats.accuracy} 
            suffix="%"
            highlight={stats.accuracy >= 70}
          />
        </div>

        {/* Progress Visualization */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/50 rounded-xl border border-cyber-green/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyber-green" />
              <h3 className="font-bold text-cyber-green font-mono">Training Progress</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-gray-400">Modules Completed</span>
                  <span className="font-semibold text-cyber-green">{Math.round((stats.modulesCompleted / 15) * 100)}%</span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyber-green to-green-400 transition-all duration-1000 rounded-full"
                    style={{ width: `${(stats.modulesCompleted / 15) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-gray-400">Accuracy Target (70%)</span>
                  <span className={`font-semibold ${stats.accuracy >= 70 ? "text-cyber-green" : "text-yellow-500"}`}>
                    {stats.accuracy >= 70 ? "✓ Achieved" : `${stats.accuracy}%`}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full relative overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full ${stats.accuracy >= 70 ? 'bg-gradient-to-r from-cyber-green to-green-400' : 'bg-gradient-to-r from-yellow-500 to-amber-400'}`}
                    style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                  />
                  <div className="absolute top-0 left-[70%] w-0.5 h-full bg-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/50 rounded-xl border border-cyber-green/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-cyber-green font-mono">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-3 border-b border-gray-800 font-mono">
                <span className="text-gray-400">Correct Responses</span>
                <span className="text-cyber-green font-bold">{stats.scenariosCorrect}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-800 font-mono">
                <span className="text-gray-400">Incorrect Responses</span>
                <span className="text-cyber-red font-bold">{stats.scenariosAttempted - stats.scenariosCorrect}</span>
              </div>
              <div className="flex justify-between py-3 font-mono">
                <span className="text-gray-400">Avg Score/Scenario</span>
                <span className="font-bold text-gray-300">
                  {stats.scenariosAttempted > 0 ? Math.round(stats.totalScore / stats.scenariosAttempted) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/50 rounded-xl border border-cyber-green/20 p-6 hover:border-cyber-green/40 transition-all">
            <h3 className="text-lg font-bold text-cyber-green mb-3 font-mono">Start Training</h3>
            <p className="text-gray-400 mb-4 font-mono text-sm">
              Complete learning modules to build your cybersecurity knowledge and earn XP.
            </p>
            <Button onClick={() => navigate("/training")} className="gap-2 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 font-mono">
              <BookOpen className="w-4 h-4" /> View Modules
            </Button>
          </div>
          <div className="bg-cyber-green/5 rounded-xl border border-cyber-green/30 p-6 hover:border-cyber-green/50 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-cyber-green" />
              <h3 className="text-lg font-bold text-cyber-green font-mono">Run Simulation</h3>
            </div>
            <p className="text-gray-400 mb-4 font-mono text-sm">
              Test your skills against realistic attack scenarios and get AI-powered feedback.
            </p>
            <Button onClick={() => navigate("/scenarios")} className="gap-2 bg-cyber-green hover:bg-cyber-green/80 text-black font-mono font-semibold">
              <Target className="w-4 h-4" /> Start Scenario
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
