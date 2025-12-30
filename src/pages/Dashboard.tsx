import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Target, BookOpen, AlertTriangle, Award, Activity, TrendingUp, Zap } from "lucide-react";
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

  // Refresh stats when page becomes visible (e.g., returning from scenarios)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        loadStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userId, loadStats]);

  // Also refresh when navigating back to this page
  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary font-mono text-2xl mb-2 animate-pulse">◢ ◣</div>
          <div className="text-primary font-mono animate-pulse">LOADING DASHBOARD...</div>
        </div>
      </div>
    );
  }

  const getSecurityLevel = () => {
    if (stats.accuracy >= 80 && stats.scenariosAttempted >= 5) return { level: "ELITE", color: "text-primary" };
    if (stats.accuracy >= 60 && stats.scenariosAttempted >= 3) return { level: "TRAINED", color: "text-accent" };
    if (stats.scenariosAttempted >= 1) return { level: "ROOKIE", color: "text-muted-foreground" };
    return { level: "UNRANKED", color: "text-muted-foreground" };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8 animate-in slide-in-from-left duration-500">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold uppercase tracking-wider">Dashboard</h1>
            <span className={`text-xs uppercase px-3 py-1 border border-current ${securityLevel.color}`}>
              {securityLevel.level}
            </span>
          </div>
          <p className="text-muted-foreground">Welcome back, <span className="text-primary">{user?.email}</span></p>
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
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-bold uppercase">Training Progress</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Modules</span>
                  <span>{Math.round((stats.modulesCompleted / 15) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted border border-border">
                  <div 
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${(stats.modulesCompleted / 15) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Accuracy Target (70%)</span>
                  <span className={stats.accuracy >= 70 ? "text-primary" : "text-accent"}>
                    {stats.accuracy >= 70 ? "✓ Achieved" : `${stats.accuracy}%`}
                  </span>
                </div>
                <div className="h-2 bg-muted border border-border relative">
                  <div 
                    className={`h-full transition-all duration-1000 ${stats.accuracy >= 70 ? 'bg-primary' : 'bg-accent'}`}
                    style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
                  />
                  <div className="absolute top-0 left-[70%] w-0.5 h-full bg-primary/50" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-bold uppercase">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Correct Responses</span>
                <span className="text-primary font-bold">{stats.scenariosCorrect}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Incorrect Responses</span>
                <span className="text-destructive font-bold">{stats.scenariosAttempted - stats.scenariosCorrect}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Avg Score/Scenario</span>
                <span className="font-bold">
                  {stats.scenariosAttempted > 0 ? Math.round(stats.totalScore / stats.scenariosAttempted) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-border p-6 bg-card hover:border-primary/30 transition-colors">
            <h3 className="text-lg font-bold uppercase mb-4">Start Training</h3>
            <p className="text-muted-foreground mb-4">
              Complete learning modules to build your cybersecurity knowledge and earn XP.
            </p>
            <Button onClick={() => navigate("/training")}>
              <BookOpen className="w-4 h-4 mr-2" /> View Modules
            </Button>
          </div>
          <div className="border-2 border-primary/30 p-6 bg-card cyber-glow hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="text-lg font-bold uppercase">Run Simulation</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Test your skills against realistic attack scenarios and get AI-powered feedback.
            </p>
            <Button variant="cyber" onClick={() => navigate("/scenarios")}>
              <Target className="w-4 h-4 mr-2" /> Start Scenario
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
