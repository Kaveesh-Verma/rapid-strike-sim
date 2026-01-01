import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, RefreshCw, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import GmailEmailUI from "@/components/scenarios/GmailEmailUI";
import ScenarioUI from "@/components/scenarios/ScenarioUI";
import { 
  generateUniqueScenario, 
  getSessionStats, 
  updateSessionStats, 
  resetSessionStats,
  getScenarioCount,
  Scenario,
  Difficulty
} from "@/lib/scenarioGenerator";

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
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userCorrect, setUserCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed');
  const [sessionStats, setSessionStats] = useState(getSessionStats());
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
        loadNextScenario();
      }
    });
  }, [navigate]);

  const loadNextScenario = () => {
    const difficultyFilter = difficulty === 'mixed' ? undefined : difficulty;
    const scenario = generateUniqueScenario(difficultyFilter);
    setCurrentScenario(scenario);
    setShowResult(false);
    setUserCorrect(false);
    setAiAnalysis(null);
  };

  const getAIAnalysis = useCallback(async (scenario: Scenario, userAction: string, isCorrect: boolean) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-scenario', {
        body: {
          scenario: {
            title: scenario.title,
            type: scenario.type,
            difficulty: scenario.difficulty,
          },
          userAction,
          correctAction: scenario.correctAnswer === 'phishing' ? 'Report as Phishing' : 'Interact normally (legitimate email)',
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

  const processResult = async (isCorrect: boolean, userAction: string) => {
    if (!currentScenario || !userId) return;

    setUserCorrect(isCorrect);
    setShowResult(true);

    // Update local session stats
    const stats = updateSessionStats(isCorrect);
    setSessionStats(stats);

    // Calculate score
    const difficultyScores = { easy: 10, medium: 20, hard: 30 };
    const score = isCorrect ? difficultyScores[currentScenario.difficulty] : -5;

    // Save to database
    try {
      await supabase.from("user_attempts").insert({
        user_id: userId,
        scenario_id: currentScenario.id,
        selected_action: userAction,
        is_correct: isCorrect,
        score_change: score,
        time_taken_seconds: 30,
      });

      // Update profile stats
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
    } catch (error) {
      console.error('Error saving to database:', error);
    }

    toast({
      title: isCorrect ? "✓ CORRECT!" : "✗ INCORRECT",
      description: isCorrect 
        ? `+${difficultyScores[currentScenario.difficulty]} points!`
        : `-5 points. This was ${currentScenario.correctAnswer === 'phishing' ? 'a phishing attempt' : 'legitimate'}.`,
      variant: isCorrect ? "default" : "destructive",
    });

    // Get AI analysis
    getAIAnalysis(currentScenario, userAction, isCorrect);
  };

  // Handle Gmail-style email actions
  const handleEmailAction = (action: 'report' | 'link_click' | 'reply' | 'forward' | 'correct_safe_action') => {
    if (!currentScenario) return;

    const isPhishing = currentScenario.correctAnswer === 'phishing';

    switch (action) {
      case 'report':
        // User marked as phishing
        if (isPhishing) {
          // Correct - it was phishing
          processResult(true, 'Marked as Phishing');
        } else {
          // Incorrect - it was legitimate
          processResult(false, 'Incorrectly marked as Phishing');
        }
        break;

      case 'link_click':
        // User clicked a phishing link (warning was shown)
        processResult(false, 'Clicked phishing link');
        break;

      case 'reply':
        // User replied to a phishing email
        processResult(false, 'Replied to phishing email');
        break;

      case 'forward':
        // User forwarded a phishing email
        processResult(false, 'Forwarded phishing email');
        break;

      case 'correct_safe_action':
        // User interacted correctly with a legitimate email
        processResult(true, 'Correctly interacted with legitimate email');
        break;
    }
  };

  // Handle non-email scenario answers (legacy flow)
  const handleAnswer = async (answer: 'phishing' | 'legitimate') => {
    if (!currentScenario) return;

    const isCorrect = answer === currentScenario.correctAnswer;
    const userAction = answer === 'phishing' ? 'Reported as Phishing' : 'Marked as Safe';
    processResult(isCorrect, userAction);
  };

  const handleReset = () => {
    resetSessionStats();
    setSessionStats({ correct: 0, total: 0, accuracy: 0 });
    loadNextScenario();
    toast({ title: "Session Reset", description: "Starting fresh!" });
  };

  // Check if current scenario is an email type
  const isEmailScenario = currentScenario?.type === 'email';

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Cyber Simulator</h1>
            <p className="text-muted-foreground">
              {getScenarioCount()} unique scenarios • 50% phishing, 50% legitimate
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-1">
                <Target className="w-4 h-4" />
                Correct
              </div>
              <div className="text-2xl font-bold text-primary">
                {sessionStats.correct}/{sessionStats.total}
              </div>
            </div>
            <div className="border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase mb-1">
                <BarChart3 className="w-4 h-4" />
                Accuracy
              </div>
              <div className="text-2xl font-bold">
                {sessionStats.accuracy}%
              </div>
            </div>
            <div className="border-2 border-border bg-card p-4">
              <div className="text-xs uppercase text-muted-foreground mb-2">Difficulty</div>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'mixed')}
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

          {/* Current Scenario */}
          {currentScenario ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                  currentScenario.difficulty === "easy" ? "border-primary/50 text-primary" :
                  currentScenario.difficulty === "medium" ? "border-accent/50 text-accent" :
                  "border-destructive/50 text-destructive"
                }`}>
                  {currentScenario.difficulty}
                </span>
                <span className="text-sm text-muted-foreground capitalize">{currentScenario.type}</span>
              </div>

              {/* Email scenarios use Gmail-style UI */}
              {isEmailScenario ? (
                <GmailEmailUI
                  email={{
                    from: currentScenario.content.from || '',
                    to: currentScenario.content.to || 'you@email.com',
                    subject: currentScenario.content.subject || '',
                    body: currentScenario.content.body || '',
                    date: currentScenario.content.date || new Date().toLocaleDateString(),
                    hasAttachment: currentScenario.content.hasAttachment,
                    attachmentName: currentScenario.content.attachmentName,
                  }}
                  isPhishing={currentScenario.correctAnswer === 'phishing'}
                  onAction={handleEmailAction}
                  showResult={showResult}
                  userCorrect={userCorrect}
                  explanation={currentScenario.explanation}
                  redFlags={currentScenario.redFlags}
                  trustIndicators={currentScenario.trustIndicators}
                />
              ) : (
                <ScenarioUI
                  scenario={currentScenario}
                  onAnswer={handleAnswer}
                  showResult={showResult}
                  userCorrect={userCorrect}
                />
              )}

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
                          aiAnalysis.threat_level === 'low' ? 'border-primary text-primary' :
                          'border-accent text-accent'
                        }`}>
                          {aiAnalysis.threat_level}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Button onClick={loadNextScenario} variant="cyber">
                      Next Scenario →
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
              Loading scenario...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scenarios;
