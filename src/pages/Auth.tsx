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
        toast({ title: "ACCESS GRANTED", description: "Welcome back, operator." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) throw error;
        toast({ title: "ACCOUNT CREATED", description: "You can now access the system." });
      }
    } catch (error: any) {
      toast({
        title: "ACCESS DENIED",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 border-r-2 border-border p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <Shield className="w-10 h-10 text-primary" />
            <span className="font-bold text-2xl uppercase tracking-wider">Rapid Capture</span>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
            Cyber Attack<br />Training Simulator
          </h1>
          <p className="text-muted-foreground max-w-md">
            An educational platform for learning to identify and respond to cyber threats in a safe, simulated environment.
          </p>
        </div>
        <div className="text-sm text-muted-foreground border-t-2 border-border pt-6">
          <p>✓ No real attacks</p>
          <p>✓ No real malware</p>
          <p>✓ 100% educational</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">Back to Home</span>
          </button>

          <div className="border-2 border-border bg-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">
                {isLogin ? "System Login" : "Create Account"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin ? "Enter credentials to access the training system" : "Register to begin your training"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-2 border-border"
                  placeholder="operator@company.com"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background border-2 border-border"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Need an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
