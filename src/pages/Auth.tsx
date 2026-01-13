import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You've successfully logged in." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) throw error;
        toast({ title: "Account Created", description: "You can now access the training system." });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black p-12 flex-col justify-between border-r border-cyber-green/20">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyber-green" />
            </div>
            <span className="font-bold text-2xl text-cyber-green font-mono">RAPID CAPTURE</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-white font-mono leading-tight">
            CYBER ATTACK<br /><span className="text-cyber-green">TRAINING SIMULATOR</span>
          </h1>
          <p className="text-gray-400 max-w-md text-lg font-mono">
            An educational platform for learning to identify and respond to cyber threats in a safe, simulated environment.
          </p>
        </div>
        <div className="text-sm text-gray-500 border-t border-cyber-green/20 pt-6 space-y-1 font-mono">
          <p className="text-cyber-green">✓ No real attacks</p>
          <p className="text-cyber-green">✓ No real malware</p>
          <p className="text-cyber-green">✓ 100% educational</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-cyber-green mb-8 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          <div className="bg-black/50 rounded-2xl border border-cyber-green/20 p-8">
            <div className="mb-8 text-center">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyber-green" />
                </div>
                <span className="font-bold text-xl text-cyber-green font-mono">RAPID CAPTURE</span>
              </div>
              <h2 className="text-2xl font-bold text-cyber-green mb-2 font-mono">
                {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
              </h2>
              <p className="text-gray-500 text-sm font-mono">
                {isLogin ? "Enter your credentials to access the training system" : "Register to begin your training"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 font-mono">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border border-cyber-green/30 rounded-lg focus:ring-2 focus:ring-cyber-green focus:border-cyber-green text-white placeholder:text-gray-600 font-mono"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 font-mono">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black border border-cyber-green/30 rounded-lg focus:ring-2 focus:ring-cyber-green focus:border-cyber-green text-white placeholder:text-gray-600 font-mono"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-cyber-green hover:bg-cyber-green/80 text-black font-mono font-semibold" 
                disabled={loading}
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-500 hover:text-cyber-green transition-colors font-mono"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
