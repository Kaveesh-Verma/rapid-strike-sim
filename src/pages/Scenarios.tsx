import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, RefreshCw, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import PhishingEmailUI from "@/components/scenarios/PhishingEmailUI";
import { 
  generateUniqueEmail, 
  getSessionProgress, 
  updateSessionProgress, 
  resetSessionProgress,
  getTemplateCount,
  GeneratedEmail 
} from "@/lib/phishingGenerator";

interface AIAnalysis {
  feedback: string;
  tips: string[];
  threat_level: string;
  real_world_impact: string;
}

const Scenarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<GeneratedEmail | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userCorrect, setUserCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [sessionProgress, setSessionProgress] = useState(getSessionProgress());
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
        // Load first email
        loadNextEmail();
      }
    });
  }, [navigate]);

  const loadNextEmail = () => {
    const difficultyFilter = difficulty === 'mixed' ? undefined : difficulty;
    const email = generateUniqueEmail(difficultyFilter);
    setCurrentEmail(email);
    setShowResult(false);
    setUserCorrect(false);
    setAiAnalysis(null);
  };

  const getAIAnalysis = useCallback(async (email: GeneratedEmail, userAction: string, isCorrect: boolean) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-scenario', {
        body: {
          scenario: {
            title: email.subject,
            type: email.category,
            difficulty: email.difficulty,
          },
          userAction,
          correctAction: 'Report as Phishing',
          isCorrect,
          timeTaken: 30,
        }
      });

      if (response.data) {
        setAiAnalysis(response.data);
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAction = async (action: 'report' | 'click' | 'reply' | 'delete') => {
    if (!currentEmail || !userId) return;

    const isCorrect = action === 'report';
    setUserCorrect(isCorrect);
    setShowResult(true);

    // Update local progress
    const progress = updateSessionProgress(isCorrect);
    setSessionProgress(progress);

    // Calculate score
    const difficultyScores = { easy: 10, medium: 20, hard: 30 };
    const score = isCorrect ? difficultyScores[currentEmail.difficulty] : -5;

    // Save to database
    await supabase.from("user_attempts").insert({
      user_id: userId,
      scenario_id: currentEmail.id,
      selected_action: action,
      is_correct: isCorrect,
      score_change: score,
      time_taken_seconds: 30,
    });

    // Update profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profile) {
      await supabase.from("profiles").update({
        total_score: (profile.total_score || 0) + score,
        scenarios_attempted: (profile.scenarios_attempted || 0) + 1,
        scenarios_correct: (profile.scenarios_correct || 0) + (isCorrect ? 1 : 0),
      }).eq("id", userId);
    }

    toast({
      title: isCorrect ? "✓ CORRECT!" : "✗ INCORRECT",
      description: isCorrect 
        ? `+${difficultyScores[currentEmail.difficulty]} points - You identified the phishing email!`
        : `-5 points - This was a phishing attempt!`,
      variant: isCorrect ? "default" : "destructive",
    });

    // Get AI analysis
    const actionLabels = { report: 'Report as Phishing', click: 'Click the Link', reply: 'Reply to Email', delete: 'Delete Email' };
    getAIAnalysis(currentEmail, actionLabels[action], isCorrect);
  };

  const handleReset = () => {
    resetSessionProgress();
    setSessionProgress({ correct: 0, total: 0, accuracy: 0, difficulty: 'mixed' });
    loadNextEmail();
    toast({ title: "Session Reset", description: "Starting fresh with new emails!" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Phishing Simulator</h1>
            <p className="text-muted-foreground">
              {getTemplateCount()}+ unique email scenarios • Never see the same email twice
            </p>
          </div>

          {/* Progress & Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-1">
                <Target className="w-4 h-4" />
                Score
              </div>
              <div className="text-2xl font-bold text-primary">
                {sessionProgress.correct}/{sessionProgress.total}
              </div>
            </div>
            <div className="border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-1">
                <BarChart3 className="w-4 h-4" />
                Accuracy
              </div>
              <div className="text-2xl font-bold">
                {sessionProgress.accuracy}%
              </div>
            </div>
            <div className="border-2 border-border bg-card p-4">
              <div className="text-xs uppercase text-muted-foreground mb-2">Difficulty</div>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-muted border border-border p-1 text-sm"
              >
                <option value="mixed">Mixed</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="border-2 border-border bg-card p-4 flex items-center justify-center">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Current Email */}
          {currentEmail ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                  currentEmail.difficulty === "easy" ? "border-primary/50 text-primary" :
                  currentEmail.difficulty === "medium" ? "border-accent/50 text-accent" :
                  "border-destructive/50 text-destructive"
                }`}>
                  {currentEmail.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">{currentEmail.category}</span>
              </div>

              <PhishingEmailUI
                email={currentEmail}
                onAction={handleAction}
                showResult={showResult}
                userCorrect={userCorrect}
              />

              {/* AI Analysis */}
              {showResult && (
                <div className="mt-4 border-2 border-border bg-card p-4">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Generating AI analysis...
                    </div>
                  ) : aiAnalysis && (
                    <div className="space-y-3">
                      <h4 className="font-bold uppercase text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> AI Insight
                      </h4>
                      <p className="text-sm">{aiAnalysis.feedback}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Threat Level:</span>
                        <span className={`text-xs uppercase px-2 py-1 border font-bold ${
                          aiAnalysis.threat_level === 'critical' ? 'border-destructive text-destructive' :
                          aiAnalysis.threat_level === 'high' ? 'border-destructive/70 text-destructive/70' :
                          'border-accent text-accent'
                        }`}>
                          {aiAnalysis.threat_level}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Button onClick={loadNextEmail} variant="cyber">
                      Next Email →
                    </Button>
                    <Button onClick={() => navigate('/dashboard')} variant="outline">
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Loading email...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scenarios;
