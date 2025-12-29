import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Shield, Target, BookOpen, BarChart3, LogOut, Activity, Award, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScore: 0,
    modulesCompleted: 0,
    scenariosAttempted: 0,
    accuracy: 0,
  });

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
        loadStats(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadStats = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      setStats({
        totalScore: profile.total_score || 0,
        modulesCompleted: profile.training_completed || 0,
        scenariosAttempted: profile.scenarios_attempted || 0,
        accuracy: profile.scenarios_attempted > 0 
          ? Math.round((profile.scenarios_correct || 0) / profile.scenarios_attempted * 100) 
          : 0,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono animate-pulse">LOADING DASHBOARD...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-border bg-sidebar p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-border">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-bold uppercase tracking-wider">Rapid Capture</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-foreground border-l-2 border-primary">
            <BarChart3 className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wider">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/training")}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wider">Training</span>
          </button>
          <button 
            onClick={() => navigate("/scenarios")}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Target className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wider">Scenarios</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="uppercase text-sm tracking-wider">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-sm uppercase text-muted-foreground">Total Score</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalScore}</p>
          </div>
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-sm uppercase text-muted-foreground">Modules Done</span>
            </div>
            <p className="text-4xl font-bold">{stats.modulesCompleted}/15</p>
          </div>
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-primary" />
              <span className="text-sm uppercase text-muted-foreground">Scenarios</span>
            </div>
            <p className="text-4xl font-bold">{stats.scenariosAttempted}</p>
          </div>
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-primary" />
              <span className="text-sm uppercase text-muted-foreground">Accuracy</span>
            </div>
            <p className="text-4xl font-bold">{stats.accuracy}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-border p-6 bg-card">
            <h3 className="text-lg font-bold uppercase mb-4">Start Training</h3>
            <p className="text-muted-foreground mb-4">
              Complete learning modules to build your cybersecurity knowledge.
            </p>
            <Button onClick={() => navigate("/training")}>
              <BookOpen className="w-4 h-4 mr-2" /> View Modules
            </Button>
          </div>
          <div className="border-2 border-primary/30 p-6 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold uppercase">Run Simulation</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Test your skills against realistic attack scenarios.
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
