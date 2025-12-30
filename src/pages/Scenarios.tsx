import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Globe, Lock, AlertTriangle, Timer, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTACK_SCENARIOS, ACTION_LABELS, SCORING_RULES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import ScenarioCard from "@/components/scenarios/ScenarioCard";
import ScenarioResult from "@/components/scenarios/ScenarioResult";

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
  const [currentScenario, setCurrentScenario] = useState<typeof ATTACK_SCENARIOS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; score: number; explanation: string } | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
        loadCompletedScenarios(session.user.id);
      }
    });
  }, [navigate]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentScenario && !showResult) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentScenario, showResult, startTime]);

  const loadCompletedScenarios = async (uid: string) => {
    const { data } = await supabase
      .from("user_attempts")
      .select("scenario_id, is_correct")
      .eq("user_id", uid);
    
    if (data) {
      const completed = data.filter(d => d.is_correct).map(d => d.scenario_id);
      setCompletedScenarios(completed);
    }
  };

  const startScenario = (scenario: typeof ATTACK_SCENARIOS[0]) => {
    setCurrentScenario(scenario);
    setShowResult(false);
    setLastResult(null);
    setAiAnalysis(null);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const getAIAnalysis = useCallback(async (scenario: typeof ATTACK_SCENARIOS[0], userAction: string, isCorrect: boolean, timeTaken: number) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-scenario', {
        body: {
          scenario: {
            title: scenario.title,
            type: scenario.type,
            difficulty: scenario.difficulty,
          },
          userAction: ACTION_LABELS[userAction as keyof typeof ACTION_LABELS] || userAction,
          correctAction: ACTION_LABELS[scenario.correct_action as keyof typeof ACTION_LABELS] || scenario.correct_action,
          isCorrect,
          timeTaken,
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

  const handleAction = async (action: string) => {
    if (!currentScenario || !userId) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = action === currentScenario.correct_action;
    const difficulty = currentScenario.difficulty as keyof typeof SCORING_RULES.correct_action;
    
    let score = isCorrect 
      ? SCORING_RULES.correct_action[difficulty]
      : SCORING_RULES.incorrect_action[difficulty];

    if (isCorrect && timeTaken < 30) score += SCORING_RULES.time_bonus.fast;
    else if (isCorrect && timeTaken < 60) score += SCORING_RULES.time_bonus.medium;

    // Save attempt
    const { error: attemptError } = await supabase.from("user_attempts").insert({
      user_id: userId,
      scenario_id: currentScenario.scenario_id,
      selected_action: action,
      is_correct: isCorrect,
      score_change: score,
      time_taken_seconds: timeTaken,
    });

    if (attemptError) {
      console.error('Error saving attempt:', attemptError);
    }

    // Update profile stats - fetch fresh data first
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    if (profile) {
      const { error: updateError } = await supabase.from("profiles").update({
        total_score: (profile.total_score || 0) + score,
        scenarios_attempted: (profile.scenarios_attempted || 0) + 1,
        scenarios_correct: (profile.scenarios_correct || 0) + (isCorrect ? 1 : 0),
      }).eq("id", userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      }
    }

    // Update completed scenarios list
    if (isCorrect && !completedScenarios.includes(currentScenario.scenario_id)) {
      setCompletedScenarios([...completedScenarios, currentScenario.scenario_id]);
    }

    setLastResult({
      correct: isCorrect,
      score,
      explanation: currentScenario.explanation,
    });
    setShowResult(true);

    toast({
      title: isCorrect ? "✓ CORRECT RESPONSE" : "✗ INCORRECT RESPONSE",
      description: `${score > 0 ? "+" : ""}${score} points${isCorrect && timeTaken < 30 ? " (Fast response bonus!)" : ""}`,
      variant: isCorrect ? "default" : "destructive",
    });

    // Get AI analysis asynchronously
    getAIAnalysis(currentScenario, action, isCorrect, timeTaken);
  };

  const getActionsForScenario = (type: string) => {
    if (type === "phishing") {
      return ["report_phishing", "click_link", "reply_email", "delete_email"];
    } else if (type === "fake_login") {
      return ["close_page", "enter_credentials", "ignore"];
    } else if (type === "ransomware") {
      return ["disconnect_report", "pay_ransom", "call_number", "close_page"];
    }
    return ["report_phishing", "ignore"];
  };

  const goToNextScenario = () => {
    const idx = ATTACK_SCENARIOS.findIndex(s => s.scenario_id === currentScenario?.scenario_id);
    const next = ATTACK_SCENARIOS[(idx + 1) % ATTACK_SCENARIOS.length];
    startScenario(next);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        {currentScenario ? (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            {showResult && lastResult ? (
              <ScenarioResult
                isCorrect={lastResult.correct}
                score={lastResult.score}
                explanation={lastResult.explanation}
                aiAnalysis={aiAnalysis}
                isAnalyzing={isAnalyzing}
                onBack={() => setCurrentScenario(null)}
                onNext={goToNextScenario}
              />
            ) : (
              <>
                {/* Scenario Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                      currentScenario.difficulty === "easy" ? "border-primary/50 text-primary" :
                      currentScenario.difficulty === "medium" ? "border-accent/50 text-accent" :
                      "border-destructive/50 text-destructive"
                    }`}>
                      {currentScenario.difficulty}
                    </span>
                    <span className="text-sm uppercase text-muted-foreground">
                      {currentScenario.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentScenario(null)}>
                      Exit
                    </Button>
                  </div>
                </div>

                {/* Scenario Title */}
                <div className="mb-6 p-4 border-l-2 border-primary bg-primary/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-xs uppercase text-primary">Active Scenario</span>
                  </div>
                  <h2 className="text-xl font-bold uppercase">{currentScenario.title}</h2>
                </div>

                {/* Scenario Display */}
                <div className="border-2 border-border bg-card mb-6">
                  {currentScenario.content.type === "email" && (
                    <>
                      <div className="bg-muted p-4 border-b-2 border-border flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold uppercase text-sm">Email Client</span>
                        <div className="ml-auto flex gap-2">
                          <div className="w-3 h-3 border border-muted-foreground" />
                          <div className="w-3 h-3 border border-muted-foreground" />
                          <div className="w-3 h-3 border border-destructive bg-destructive/30" />
                        </div>
                      </div>
                      <div className="p-4 border-b border-border text-sm bg-muted/30">
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="text-muted-foreground">From:</span>
                          <span className="text-foreground">{currentScenario.content.from}</span>
                          <span className="text-muted-foreground">To:</span>
                          <span className="text-foreground">{currentScenario.content.to}</span>
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-bold text-foreground">{currentScenario.content.subject}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{currentScenario.content.body}</pre>
                      </div>
                    </>
                  )}

                  {currentScenario.content.type === "login_page" && (
                    <>
                      <div className="bg-muted p-4 border-b-2 border-border flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-mono flex-1 truncate">{currentScenario.content.url}</span>
                        {currentScenario.content.ssl_status === "valid" && (
                          <Lock className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="p-8 flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-6">{currentScenario.content.page_title}</h2>
                        <div className="w-full max-w-sm space-y-4">
                          {currentScenario.content.form_fields?.map((field: string, i: number) => (
                            <div key={i} className="border-2 border-border p-3 bg-muted text-muted-foreground">
                              {field}
                            </div>
                          ))}
                          <div className="bg-primary/20 text-primary p-3 text-center font-bold uppercase border-2 border-primary">
                            Sign In
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentScenario.content.type === "popup" && (
                    <div className={`p-8 text-center ${currentScenario.content.background_color === "red" ? "bg-destructive/20" : "bg-muted"}`}>
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive animate-pulse" />
                      <h2 className="text-2xl font-bold uppercase mb-4">{currentScenario.content.title}</h2>
                      <pre className="whitespace-pre-wrap text-sm text-left max-w-lg mx-auto mb-4">
                        {currentScenario.content.message}
                      </pre>
                      {currentScenario.content.timer && (
                        <div className="text-2xl font-mono text-destructive animate-pulse">{currentScenario.content.timer}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="border-2 border-border bg-card p-6">
                  <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent" />
                    What would you do?
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {getActionsForScenario(currentScenario.type).map(action => (
                      <Button
                        key={action}
                        variant="outline"
                        className="justify-start h-auto py-4 px-4 text-left hover:border-primary/50 transition-all"
                        onClick={() => handleAction(action)}
                      >
                        <span className="text-sm">{ACTION_LABELS[action as keyof typeof ACTION_LABELS]}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Attack Scenarios</h1>
              <p className="text-muted-foreground">
                Select a scenario to test your skills • {completedScenarios.length}/{ATTACK_SCENARIOS.length} completed
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-muted border border-border">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(completedScenarios.length / ATTACK_SCENARIOS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTACK_SCENARIOS.map(scenario => (
                <ScenarioCard
                  key={scenario.scenario_id}
                  scenario={scenario}
                  onClick={() => startScenario(scenario)}
                  completed={completedScenarios.includes(scenario.scenario_id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scenarios;
