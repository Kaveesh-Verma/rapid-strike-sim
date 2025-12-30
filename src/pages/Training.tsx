import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronRight, BookOpen, ArrowLeft, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEARNING_MODULES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";

const Training = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<typeof LEARNING_MODULES[0] | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

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
    if (!userId || isCompleting) return;

    setIsCompleting(true);
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from("user_module_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("user_module_progress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("user_module_progress")
          .insert({
            user_id: userId,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      // Update profile training count
      const { data: profile } = await supabase
        .from("profiles")
        .select("training_completed, total_score")
        .eq("id", userId)
        .maybeSingle();

      if (profile && !completedModules.includes(moduleId)) {
        await supabase
          .from("profiles")
          .update({ 
            training_completed: (profile.training_completed || 0) + 1,
            total_score: (profile.total_score || 0) + 50 // XP for completing module
          })
          .eq("id", userId);
      }

      setCompletedModules([...completedModules, moduleId]);
      toast({ 
        title: "MODULE COMPLETED", 
        description: "+50 XP bonus earned!",
      });
      
      // Auto-navigate to next module after a short delay
      setTimeout(() => {
        const currentIndex = LEARNING_MODULES.findIndex(m => m.module_id === moduleId);
        const nextModule = LEARNING_MODULES[currentIndex + 1];
        if (nextModule) {
          setSelectedModule(nextModule);
        } else {
          setSelectedModule(null);
        }
      }, 1500);

    } catch (error) {
      console.error('Error completing module:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const categories = [...new Set(LEARNING_MODULES.map(m => m.category))];

  const getCategoryProgress = (category: string) => {
    const categoryModules = LEARNING_MODULES.filter(m => m.category === category);
    const completed = categoryModules.filter(m => completedModules.includes(m.module_id)).length;
    return { completed, total: categoryModules.length };
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {selectedModule ? (
          <div className="max-w-3xl animate-in slide-in-from-right duration-300">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="uppercase text-sm">Back to Modules</span>
            </button>
            
            <div className="border-2 border-border bg-card">
              <div className="p-6 border-b-2 border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs uppercase tracking-wider text-primary px-2 py-1 border border-primary">
                    {selectedModule.category}
                  </span>
                  <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                    selectedModule.difficulty === 'beginner' ? 'border-primary/50 text-primary' :
                    selectedModule.difficulty === 'intermediate' ? 'border-accent/50 text-accent' :
                    'border-destructive/50 text-destructive'
                  }`}>
                    {selectedModule.difficulty}
                  </span>
                  {completedModules.includes(selectedModule.module_id) && (
                    <span className="ml-auto flex items-center gap-1 text-primary text-xs uppercase">
                      <Check className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold uppercase">{selectedModule.title}</h2>
                <p className="text-muted-foreground mt-2">{selectedModule.description}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold uppercase text-sm mb-3 text-primary flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Learning Content
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono bg-muted p-4 border border-border leading-relaxed">
                    {selectedModule.content}
                  </pre>
                </div>
                
                <div className="border-l-2 border-accent pl-4 bg-accent/5 py-4 pr-4">
                  <h3 className="font-bold uppercase text-sm mb-2 text-accent flex items-center gap-2">
                    <Award className="w-4 h-4" /> Why It Matters
                  </h3>
                  <p className="text-foreground">{selectedModule.why_it_matters}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  {completedModules.includes(selectedModule.module_id) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary">
                        <Check className="w-5 h-5" /> Module Completed
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const currentIndex = LEARNING_MODULES.findIndex(m => m.module_id === selectedModule.module_id);
                          const nextModule = LEARNING_MODULES[currentIndex + 1];
                          if (nextModule) {
                            setSelectedModule(nextModule);
                          }
                        }}
                      >
                        Next Module →
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => completeModule(selectedModule.module_id)}
                      disabled={isCompleting}
                      className="w-full sm:w-auto"
                    >
                      {isCompleting ? "Saving..." : "Mark as Complete (+50 XP)"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Training Modules</h1>
              <p className="text-muted-foreground">
                {completedModules.length}/{LEARNING_MODULES.length} modules completed • Earn 50 XP per module
              </p>
            </div>

            {/* Overall Progress */}
            <div className="mb-8 p-4 border-2 border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm uppercase text-muted-foreground">Overall Progress</span>
                <span className="text-primary font-bold">{Math.round((completedModules.length / LEARNING_MODULES.length) * 100)}%</span>
              </div>
              <div className="h-3 bg-muted border border-border">
                <div 
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${(completedModules.length / LEARNING_MODULES.length) * 100}%` }}
                />
              </div>
            </div>

            {categories.map(category => {
              const progress = getCategoryProgress(category);
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-primary">{category}</h2>
                    <span className="text-sm text-muted-foreground">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {LEARNING_MODULES.filter(m => m.category === category).map((module, index) => {
                      const isCompleted = completedModules.includes(module.module_id);
                      return (
                        <button
                          key={module.module_id}
                          onClick={() => setSelectedModule(module)}
                          className="border-2 border-border p-4 bg-card text-left hover:border-primary/50 transition-all duration-200 flex items-center justify-between group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            {isCompleted ? (
                              <div className="w-8 h-8 border-2 border-primary bg-primary/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 border-2 border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <span className="text-xs text-muted-foreground">{index + 1}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold uppercase text-sm">{module.title}</h3>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Training;
