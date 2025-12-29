import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, BookOpen, BarChart3, Target, LogOut, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEARNING_MODULES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const Training = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<typeof LEARNING_MODULES[0] | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
        loadProgress(session.user.id);
      }
    });
  }, [navigate]);

  const loadProgress = async (uid: string) => {
    const { data } = await supabase
      .from("user_module_progress")
      .select("module_id")
      .eq("user_id", uid)
      .eq("completed", true);
    
    if (data) {
      setCompletedModules(data.map(d => d.module_id));
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("user_module_progress")
      .upsert({
        user_id: userId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (!error) {
      // Update profile
      await supabase
        .from("profiles")
        .update({ training_completed: completedModules.length + 1 })
        .eq("id", userId);

      setCompletedModules([...completedModules, moduleId]);
      toast({ title: "MODULE COMPLETED", description: "+50 XP bonus unlocked" });
      setSelectedModule(null);
    }
  };

  const categories = [...new Set(LEARNING_MODULES.map(m => m.category))];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-border bg-sidebar p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-border">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-bold uppercase tracking-wider">Rapid Capture</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wider">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-foreground border-l-2 border-primary">
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
          onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="uppercase text-sm tracking-wider">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {selectedModule ? (
          <div className="max-w-3xl">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              ← Back to Modules
            </button>
            
            <div className="border-2 border-border bg-card">
              <div className="p-6 border-b-2 border-border">
                <span className="text-xs uppercase tracking-wider text-primary">{selectedModule.category}</span>
                <h2 className="text-2xl font-bold uppercase mt-2">{selectedModule.title}</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold uppercase text-sm mb-3 text-primary">Content</h3>
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-muted p-4 border border-border">
                    {selectedModule.content}
                  </pre>
                </div>
                
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-bold uppercase text-sm mb-2">Why It Matters</h3>
                  <p className="text-muted-foreground">{selectedModule.why_it_matters}</p>
                </div>

                {completedModules.includes(selectedModule.module_id) ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-5 h-5" /> Module Completed
                  </div>
                ) : (
                  <Button onClick={() => completeModule(selectedModule.module_id)}>
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Training Modules</h1>
              <p className="text-muted-foreground">
                {completedModules.length}/{LEARNING_MODULES.length} modules completed
              </p>
            </div>

            {categories.map(category => (
              <div key={category} className="mb-8">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-primary">{category}</h2>
                <div className="grid gap-3">
                  {LEARNING_MODULES.filter(m => m.category === category).map(module => (
                    <button
                      key={module.module_id}
                      onClick={() => setSelectedModule(module)}
                      className="border-2 border-border p-4 bg-card text-left hover:border-primary/50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        {completedModules.includes(module.module_id) ? (
                          <div className="w-8 h-8 border-2 border-primary bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 border-2 border-border" />
                        )}
                        <div>
                          <h3 className="font-bold uppercase text-sm">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Training;
