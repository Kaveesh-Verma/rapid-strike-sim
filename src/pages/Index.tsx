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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Rapid Capture</span>
          </div>
          <Button onClick={() => navigate("/auth")} className="gap-2">
            Get Started <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Cyber Security Training</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn to Defend.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">By Doing.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Face realistic cyber attack simulations. Make decisions under pressure. 
              Build the instincts to protect yourself and your organization.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="xl" className="gap-2" onClick={() => navigate("/auth")}>
                Start Training <ChevronRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate("/auth")}>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to train your instincts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform combines realistic simulations with structured learning to build real-world security awareness.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Attack Scenarios</h3>
              <p className="text-gray-600">
                60+ realistic phishing, credential theft, ransomware, and social engineering simulations.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Modules</h3>
              <p className="text-gray-600">
                Structured training on real cybersecurity concepts and defense tactics with XP rewards.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Dashboard analytics to identify weak areas, track improvement, and earn achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to sharpen your security instincts?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of professionals training to recognize and respond to cyber threats.
          </p>
          <Button 
            size="xl" 
            className="bg-white text-blue-600 hover:bg-gray-100 gap-2"
            onClick={() => navigate("/auth")}
          >
            Start Free Training <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 bg-gray-50">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>Educational simulation only. No real attacks. No real malware. 100% safe to use.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;