import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Target, BookOpen, BarChart3, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono animate-pulse">INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl uppercase tracking-wider">Rapid Capture</span>
          </div>
          <Button variant="cyber" onClick={() => navigate("/auth")}>
            Access System <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto py-20 px-4">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Cyber Attack Training Simulator</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">
            Learn to Defend.<br />
            <span className="text-primary">By Doing.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl font-mono">
            Face realistic cyber attack simulations. Make decisions under pressure. 
            Build the instincts to protect yourself and your organization.
          </p>
          <div className="flex gap-4">
            <Button size="xl" onClick={() => navigate("/auth")}>
              Start Training
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/auth")}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-border p-6 bg-card">
            <Target className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold uppercase mb-2">Attack Scenarios</h3>
            <p className="text-muted-foreground text-sm">
              15+ realistic phishing, credential theft, and ransomware simulations.
            </p>
          </div>
          <div className="border-2 border-border p-6 bg-card">
            <BookOpen className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold uppercase mb-2">Learning Modules</h3>
            <p className="text-muted-foreground text-sm">
              Structured training on real cybersecurity concepts and defense tactics.
            </p>
          </div>
          <div className="border-2 border-border p-6 bg-card">
            <BarChart3 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-bold uppercase mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground text-sm">
              Dashboard analytics to identify weak areas and track improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border p-6 mt-20">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>Educational simulation only. No real attacks. No real malware.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
