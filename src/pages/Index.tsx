import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Target, BookOpen, BarChart3, ChevronRight, Zap } from "lucide-react";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-primary/20 bg-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl text-primary font-mono">RAPID CAPTURE</span>
          </div>
          <Button onClick={() => navigate("/auth")} className="gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-mono font-semibold">
            Get Started <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 border-b border-primary/20">
        <div className="container mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider font-mono">Cyber Security Training</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight font-mono">
              LEARN TO DEFEND.<br />
              <span className="text-primary">BY DOING.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl font-mono">
              Face realistic cyber attack simulations. Make decisions under pressure. 
              Build the instincts to protect yourself and your organization.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-mono font-semibold px-8" onClick={() => navigate("/auth")}>
                Start Training <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/auth")} className="border-primary/50 text-primary hover:bg-primary/10 font-mono px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4 font-mono">EVERYTHING YOU NEED TO TRAIN YOUR INSTINCTS</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-mono">
              Our platform combines realistic simulations with structured learning to build real-world security awareness.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/50 rounded-2xl border border-primary/20 p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-mono">Attack Scenarios</h3>
              <p className="text-gray-400 font-mono text-sm">
                60+ realistic phishing, credential theft, ransomware, and social engineering simulations.
              </p>
            </div>
            <div className="bg-black/50 rounded-2xl border border-primary/20 p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-mono">Learning Modules</h3>
              <p className="text-gray-400 font-mono text-sm">
                Structured training on real cybersecurity concepts and defense tactics with XP rewards.
              </p>
            </div>
            <div className="bg-black/50 rounded-2xl border border-primary/20 p-8 hover:border-primary/40 transition-all">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 font-mono">Progress Tracking</h3>
              <p className="text-gray-400 font-mono text-sm">
                Dashboard analytics to identify weak areas, track improvement, and earn achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16 px-4 border-y border-primary/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4 font-mono">READY TO SHARPEN YOUR SECURITY INSTINCTS?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto font-mono">
            Join thousands of professionals training to recognize and respond to cyber threats.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/80 gap-2 font-mono font-semibold px-8"
            onClick={() => navigate("/auth")}
          >
            Start Free Training <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8 px-4 bg-black">
        <div className="container mx-auto text-center text-gray-500 text-sm font-mono">
          <p>Educational simulation only. No real attacks. No real malware. 100% safe to use.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
