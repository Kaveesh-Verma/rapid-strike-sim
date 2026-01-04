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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {selectedModule ? (
          <div className="max-w-3xl animate-in slide-in-from-right duration-300">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Modules</span>
            </button>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs uppercase tracking-wider font-medium text-blue-700 px-3 py-1 bg-blue-100 rounded-full">
                    {selectedModule.category}
                  </span>
                  <span className={`text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-full ${
                    selectedModule.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    selectedModule.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedModule.difficulty}
                  </span>
                  {completedModules.includes(selectedModule.module_id) && (
                    <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Check className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
                <p className="text-gray-600 mt-2">{selectedModule.description}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Learning Content
                  </h3>
                  <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
                    {selectedModule.content}
                  </div>
                </div>
                
                <div className="border-l-4 border-amber-400 pl-4 bg-amber-50 py-4 pr-4 rounded-r-lg">
                  <h3 className="font-semibold text-sm mb-2 text-amber-800 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Why It Matters
                  </h3>
                  <p className="text-gray-700">{selectedModule.why_it_matters}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {completedModules.includes(selectedModule.module_id) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Check className="w-5 h-5" /> Module Completed
                      </div>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
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
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isCompleting ? "Saving..." : "Mark as Complete (+50 XP)"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Modules</h1>
              <p className="text-gray-500">
                {completedModules.length}/{LEARNING_MODULES.length} modules completed • Earn 50 XP per module
              </p>
            </div>

            {/* Overall Progress */}
            <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-blue-600 font-bold">{Math.round((completedModules.length / LEARNING_MODULES.length) * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 rounded-full"
                  style={{ width: `${(completedModules.length / LEARNING_MODULES.length) * 100}%` }}
                />
              </div>
            </div>

            {categories.map(category => {
              const progress = getCategoryProgress(category);
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">{category}</h2>
                    <span className="text-sm text-gray-500">
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
                          className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            {isCompleted ? (
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">{index + 1}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-500">{module.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
