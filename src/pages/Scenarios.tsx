import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, BookOpen, BarChart3, Target, LogOut, AlertTriangle, Mail, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ATTACK_SCENARIOS, ACTION_LABELS, SCORING_RULES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const Scenarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<typeof ATTACK_SCENARIOS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; score: number; explanation: string } | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const startScenario = (scenario: typeof ATTACK_SCENARIOS[0]) => {
    setCurrentScenario(scenario);
    setShowResult(false);
    setLastResult(null);
    setStartTime(Date.now());
  };

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
    await supabase.from("user_attempts").insert({
      user_id: userId,
      scenario_id: currentScenario.scenario_id,
      selected_action: action,
      is_correct: isCorrect,
      score_change: score,
      time_taken_seconds: timeTaken,
    });

    // Update profile stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      await supabase.from("profiles").update({
        total_score: (profile.total_score || 0) + score,
        scenarios_attempted: (profile.scenarios_attempted || 0) + 1,
        scenarios_correct: (profile.scenarios_correct || 0) + (isCorrect ? 1 : 0),
      }).eq("id", userId);
    }

    setLastResult({
      correct: isCorrect,
      score,
      explanation: currentScenario.explanation,
    });
    setShowResult(true);

    toast({
      title: isCorrect ? "CORRECT RESPONSE" : "INCORRECT RESPONSE",
      description: `${score > 0 ? "+" : ""}${score} points`,
      variant: isCorrect ? "default" : "destructive",
    });
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
          <button 
            onClick={() => navigate("/training")}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span className="uppercase text-sm tracking-wider">Training</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-muted text-foreground border-l-2 border-primary">
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
        {currentScenario ? (
          <div className="max-w-4xl mx-auto">
            {showResult && lastResult ? (
              <div className="border-2 border-border bg-card">
                <div className={`p-6 border-b-2 ${lastResult.correct ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10"}`}>
                  <h2 className="text-2xl font-bold uppercase">
                    {lastResult.correct ? "✓ Correct Response" : "✗ Incorrect Response"}
                  </h2>
                  <p className="text-lg mt-2">{lastResult.score > 0 ? "+" : ""}{lastResult.score} points</p>
                </div>
                <div className="p-6">
                  <h3 className="font-bold uppercase mb-3">Explanation</h3>
                  <p className="text-muted-foreground mb-6">{lastResult.explanation}</p>
                  <div className="flex gap-4">
                    <Button onClick={() => setCurrentScenario(null)}>Back to Scenarios</Button>
                    <Button variant="outline" onClick={() => {
                      const idx = ATTACK_SCENARIOS.findIndex(s => s.scenario_id === currentScenario.scenario_id);
                      const next = ATTACK_SCENARIOS[(idx + 1) % ATTACK_SCENARIOS.length];
                      startScenario(next);
                    }}>Next Scenario</Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase text-muted-foreground">
                    {currentScenario.type} / {currentScenario.difficulty}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentScenario(null)}>
                    Exit Scenario
                  </Button>
                </div>

                {/* Scenario Display */}
                <div className="border-2 border-border bg-card mb-6">
                  {currentScenario.content.type === "email" && (
                    <>
                      <div className="bg-muted p-4 border-b-2 border-border flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold uppercase">Email Client</span>
                      </div>
                      <div className="p-4 border-b border-border text-sm">
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="text-muted-foreground">From:</span>
                          <span>{currentScenario.content.from}</span>
                          <span className="text-muted-foreground">To:</span>
                          <span>{currentScenario.content.to}</span>
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-bold">{currentScenario.content.subject}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <pre className="whitespace-pre-wrap font-mono text-sm">{currentScenario.content.body}</pre>
                      </div>
                    </>
                  )}

                  {currentScenario.content.type === "login_page" && (
                    <>
                      <div className="bg-muted p-4 border-b-2 border-border flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-mono">{currentScenario.content.url}</span>
                        {currentScenario.content.ssl_status === "valid" && (
                          <Lock className="w-4 h-4 text-primary ml-auto" />
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
                          <div className="bg-primary/20 text-primary p-3 text-center font-bold uppercase">
                            Sign In
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentScenario.content.type === "popup" && (
                    <div className={`p-8 text-center ${currentScenario.content.background_color === "red" ? "bg-destructive/20" : "bg-muted"}`}>
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                      <h2 className="text-2xl font-bold uppercase mb-4">{currentScenario.content.title}</h2>
                      <pre className="whitespace-pre-wrap text-sm text-left max-w-lg mx-auto mb-4">
                        {currentScenario.content.message}
                      </pre>
                      {currentScenario.content.timer && (
                        <div className="text-2xl font-mono text-destructive">{currentScenario.content.timer}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="border-2 border-border bg-card p-6">
                  <h3 className="font-bold uppercase mb-4">What would you do?</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {getActionsForScenario(currentScenario.type).map(action => (
                      <Button
                        key={action}
                        variant="outline"
                        className="justify-start h-auto py-3"
                        onClick={() => handleAction(action)}
                      >
                        {ACTION_LABELS[action as keyof typeof ACTION_LABELS]}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Attack Scenarios</h1>
              <p className="text-muted-foreground">Select a scenario to test your skills</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTACK_SCENARIOS.map(scenario => (
                <button
                  key={scenario.scenario_id}
                  onClick={() => startScenario(scenario)}
                  className="border-2 border-border p-4 bg-card text-left hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                      scenario.difficulty === "easy" ? "border-primary/50 text-primary" :
                      scenario.difficulty === "medium" ? "border-accent/50 text-accent" :
                      "border-destructive/50 text-destructive"
                    }`}>
                      {scenario.difficulty}
                    </span>
                    <span className="text-xs uppercase text-muted-foreground">{scenario.type}</span>
                  </div>
                  <h3 className="font-bold uppercase text-sm">{scenario.title}</h3>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Scenarios;
