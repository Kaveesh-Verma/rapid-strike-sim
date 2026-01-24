import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronRight, BookOpen, ArrowLeft, Award, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEARNING_MODULES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import QuizModal from "@/components/training/QuizModal";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { getQuizQuestionsForModule } from "@/lib/quizData";

const Training = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<typeof LEARNING_MODULES[0] | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

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
    // Load completed modules
    const { data: moduleProgress } = await supabase
      .from("user_module_progress")
      .select("module_id")
      .eq("user_id", uid)
      .eq("completed", true);
    
    if (moduleProgress) {
      setCompletedModules(moduleProgress.map(d => d.module_id));
    }

    // Load passed quizzes
    const { data: quizProgress } = await supabase
      .from("user_quiz_attempts")
      .select("module_id")
      .eq("user_id", uid)
      .eq("passed", true);
    
    if (quizProgress) {
      setPassedQuizzes([...new Set(quizProgress.map(d => d.module_id))]);
    }
  };

  const handleQuizComplete = async (passed: boolean, score: number) => {
    if (!userId || !selectedModule) return;

    try {
      // Save quiz attempt
      await supabase.from("user_quiz_attempts").insert({
        user_id: userId,
        module_id: selectedModule.module_id,
        score,
        passed,
        answers: [],
      });

      if (passed) {
        setPassedQuizzes([...passedQuizzes, selectedModule.module_id]);
        
        // Auto-complete module if quiz passed
        await completeModule(selectedModule.module_id, true);
        
        toast({
          title: t.training.quizPassed,
          description: "+50 XP bonus earned!",
        });
      } else {
        toast({
          title: t.training.quizFailed,
          description: t.training.tryAgain,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const completeModule = async (moduleId: string, fromQuiz = false) => {
    if (!userId || isCompleting) return;

    setIsCompleting(true);
    try {
      const { data: existing } = await supabase
        .from("user_module_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_module_progress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
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
            total_score: (profile.total_score || 0) + 50
          })
          .eq("id", userId);
      }

      setCompletedModules([...completedModules, moduleId]);
      
      if (!fromQuiz) {
        toast({ 
          title: t.training.moduleComplete, 
          description: "+50 XP bonus earned!",
        });
      }
      
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

  const canCompleteModule = (moduleId: string) => {
    const quizQuestions = getQuizQuestionsForModule(moduleId);
    // If no quiz questions exist, allow direct completion
    if (quizQuestions.length === 0) return true;
    // Otherwise, require quiz pass
    return passedQuizzes.includes(moduleId);
  };

  const categories = [...new Set(LEARNING_MODULES.map(m => m.category))];

  const getCategoryProgress = (category: string) => {
    const categoryModules = LEARNING_MODULES.filter(m => m.category === category);
    const completed = categoryModules.filter(m => completedModules.includes(m.module_id)).length;
    return { completed, total: categoryModules.length };
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {selectedModule ? (
          <div className="max-w-3xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedModule(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-cyber-green transition-colors font-mono"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.common.back}</span>
              </button>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
            
            <div className="bg-black/50 rounded-xl border border-cyber-green/20 overflow-hidden">
              <div className="p-6 border-b border-cyber-green/20 bg-cyber-green/5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs uppercase tracking-wider font-medium font-mono text-cyber-green px-3 py-1 bg-cyber-green/20 border border-cyber-green/30 rounded-full">
                    {selectedModule.category}
                  </span>
                  <span className={`text-xs uppercase tracking-wider font-medium font-mono px-3 py-1 rounded-full border ${
                    selectedModule.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    selectedModule.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {selectedModule.difficulty}
                  </span>
                  {completedModules.includes(selectedModule.module_id) && (
                    <span className="ml-auto flex items-center gap-1 text-cyber-green text-xs font-medium font-mono">
                      <Check className="w-4 h-4" /> {t.training.completed}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-cyber-green font-mono">{selectedModule.title}</h2>
                <p className="text-gray-400 mt-2 font-mono text-sm">{selectedModule.description}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-cyber-green flex items-center gap-2 font-mono">
                    <BookOpen className="w-4 h-4" /> {t.training.learningContent}
                  </h3>
                  <div className="whitespace-pre-wrap text-sm text-gray-300 bg-black/30 p-4 rounded-lg border border-cyber-green/10 leading-relaxed font-mono">
                    {selectedModule.content}
                  </div>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/10 py-4 pr-4 rounded-r-lg">
                  <h3 className="font-semibold text-sm mb-2 text-yellow-500 flex items-center gap-2 font-mono">
                    <Award className="w-4 h-4" /> {t.training.whyItMatters}
                  </h3>
                  <p className="text-gray-300 font-mono text-sm">{selectedModule.why_it_matters}</p>
                </div>

                {/* Quiz Section */}
                {getQuizQuestionsForModule(selectedModule.module_id).length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="font-mono font-semibold text-purple-400">{t.training.quizRequired}</h4>
                          <p className="text-gray-400 text-sm font-mono">{t.training.passToComplete}</p>
                        </div>
                      </div>
                      {passedQuizzes.includes(selectedModule.module_id) ? (
                        <span className="flex items-center gap-2 text-green-400 font-mono text-sm">
                          <Check className="w-4 h-4" /> {t.training.quizPassed}
                        </span>
                      ) : (
                        <Button
                          onClick={() => setShowQuiz(true)}
                          className="bg-purple-500 hover:bg-purple-600 text-white font-mono"
                        >
                          {t.training.takeQuiz}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-cyber-green/20">
                  {completedModules.includes(selectedModule.module_id) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyber-green font-medium font-mono">
                        <Check className="w-5 h-5" /> {t.training.moduleComplete}
                      </div>
                      <Button 
                        className="bg-cyber-green hover:bg-cyber-green/80 text-black font-mono font-semibold"
                        onClick={() => {
                          const currentIndex = LEARNING_MODULES.findIndex(m => m.module_id === selectedModule.module_id);
                          const nextModule = LEARNING_MODULES[currentIndex + 1];
                          if (nextModule) {
                            setSelectedModule(nextModule);
                          }
                        }}
                      >
                        {t.training.nextModule} →
                      </Button>
                    </div>
                  ) : canCompleteModule(selectedModule.module_id) ? (
                    <Button 
                      onClick={() => completeModule(selectedModule.module_id)}
                      disabled={isCompleting}
                      className="w-full sm:w-auto bg-cyber-green hover:bg-cyber-green/80 text-black font-mono font-semibold"
                    >
                      {isCompleting ? "Saving..." : t.training.markComplete}
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-gray-400 font-mono text-sm">{t.training.completeQuizFirst}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Modal */}
            <QuizModal
              open={showQuiz}
              onClose={() => setShowQuiz(false)}
              questions={getQuizQuestionsForModule(selectedModule.module_id)}
              moduleTitle={selectedModule.title}
              onComplete={handleQuizComplete}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyber-green" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-cyber-green font-mono">{t.training.title}</h1>
                  <p className="text-gray-500 font-mono text-sm">
                    {completedModules.length}/{LEARNING_MODULES.length} {t.training.modulesCompleted}
                  </p>
                </div>
              </div>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>

            {/* Overall Progress */}
            <div className="mb-8 p-4 bg-black/50 rounded-xl border border-cyber-green/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400 font-mono">{t.training.overallProgress}</span>
                <span className="text-cyber-green font-bold font-mono">{Math.round((completedModules.length / LEARNING_MODULES.length) * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyber-green to-green-400 transition-all duration-700 rounded-full"
                  style={{ width: `${(completedModules.length / LEARNING_MODULES.length) * 100}%` }}
                />
              </div>
            </div>

            {categories.map(category => {
              const progress = getCategoryProgress(category);
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-cyber-green font-mono">{category}</h2>
                    <span className="text-sm text-gray-500 font-mono">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {LEARNING_MODULES.filter(m => m.category === category).map((module, index) => {
                      const isCompleted = completedModules.includes(module.module_id);
                      const hasQuiz = getQuizQuestionsForModule(module.module_id).length > 0;
                      const quizPassed = passedQuizzes.includes(module.module_id);
                      
                      return (
                        <button
                          key={module.module_id}
                          onClick={() => setSelectedModule(module)}
                          className="bg-black/50 rounded-xl border border-cyber-green/20 p-4 text-left hover:border-cyber-green/50 transition-all duration-200 flex items-center justify-between group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-4">
                            {isCompleted ? (
                              <div className="w-10 h-10 rounded-lg bg-cyber-green/20 border border-cyber-green/30 flex items-center justify-center">
                                <Check className="w-5 h-5 text-cyber-green" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-cyber-green/30 transition-colors">
                                <span className="text-sm font-medium text-gray-500 group-hover:text-cyber-green font-mono">{index + 1}</span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-200 group-hover:text-cyber-green transition-colors font-mono">{module.title}</h3>
                                {hasQuiz && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                                    quizPassed 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  }`}>
                                    {quizPassed ? '✓ Quiz' : 'Quiz'}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 font-mono">{module.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyber-green transition-colors" />
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
