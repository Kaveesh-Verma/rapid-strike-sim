import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, RefreshCw, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import GmailEmailUI from "@/components/scenarios/GmailEmailUI";
import SMSMessageUI from "@/components/scenarios/SMSMessageUI";
import PhishingWebsiteUI from "@/components/scenarios/PhishingWebsiteUI";
import RansomwarePopupUI from "@/components/scenarios/RansomwarePopupUI";
import VoiceCallUI from "@/components/scenarios/VoiceCallUI";
import QRCodeUI from "@/components/scenarios/QRCodeUI";
import SocialMediaUI from "@/components/scenarios/SocialMediaUI";
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
          correctAction: scenario.correctAnswer === 'phishing' ? 'Report as Phishing' : 'Complete task / Interact normally',
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

    const stats = updateSessionStats(isCorrect);
    setSessionStats(stats);

    const difficultyScores = { easy: 10, medium: 20, hard: 30 };
    const score = isCorrect ? difficultyScores[currentScenario.difficulty] : -5;

    try {
      await supabase.from("user_attempts").insert({
        user_id: userId,
        scenario_id: currentScenario.id,
        selected_action: userAction,
        is_correct: isCorrect,
        score_change: score,
        time_taken_seconds: 30,
      });

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

    getAIAnalysis(currentScenario, userAction, isCorrect);
  };

  // Universal action handler for all scenario types
  const handleAction = (action: string) => {
    if (!currentScenario) return;
    const isPhishing = currentScenario.correctAnswer === 'phishing';

    // Correct actions
    if (action === 'report' && isPhishing) {
      processResult(true, 'Correctly reported as phishing');
    } else if (action === 'task_complete' && !isPhishing) {
      processResult(true, 'Successfully completed legitimate task');
    } else if (action === 'correct_safe_action' && !isPhishing) {
      processResult(true, 'Correctly interacted with legitimate content');
    } else if ((action === 'hangup' || action === 'close' || action === 'ignore') && isPhishing) {
      processResult(true, 'Correctly ignored/blocked phishing attempt');
    }
    // Incorrect actions
    else if (action === 'report' && !isPhishing) {
      processResult(false, 'Incorrectly marked legitimate content as phishing');
    } else if ((action === 'link_click' || action === 'scan' || action === 'submit_credentials' || action === 'pay' || action === 'call' || action === 'click_link' || action === 'share' || action === 'reply' || action === 'forward' || action === 'answer') && isPhishing) {
      processResult(false, 'Fell for phishing attempt');
    } else if ((action === 'leave' || action === 'ignore' || action === 'hangup') && !isPhishing) {
      processResult(false, 'Ignored legitimate request');
    } else {
      processResult(false, `Incorrect action: ${action}`);
    }
  };

  const handleReset = () => {
    resetSessionStats();
    setSessionStats({ correct: 0, total: 0, accuracy: 0 });
    loadNextScenario();
    toast({ title: "Session Reset", description: "Starting fresh!" });
  };

  // Render appropriate UI based on scenario type
  const renderScenarioUI = () => {
    if (!currentScenario) return null;

    const commonProps = {
      showResult,
      userCorrect,
      explanation: currentScenario.explanation,
      redFlags: currentScenario.redFlags,
      trustIndicators: currentScenario.trustIndicators,
    };

    switch (currentScenario.type) {
      case 'email':
        return (
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
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'sms':
        return (
          <SMSMessageUI
            sms={{
              sender: currentScenario.content.sender || '',
              message: currentScenario.content.message || '',
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'website':
        return (
          <PhishingWebsiteUI
            website={{
              url: currentScenario.content.url || '',
              websiteTitle: currentScenario.content.websiteTitle || '',
              websiteContent: currentScenario.content.websiteContent || '',
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'voice':
        return (
          <VoiceCallUI
            call={{
              callerNumber: currentScenario.content.callerNumber || '',
              transcript: currentScenario.content.transcript || '',
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'qrcode':
        return (
          <QRCodeUI
            qrCode={{
              qrContext: currentScenario.content.qrContext || '',
              qrDestination: currentScenario.content.qrDestination || '',
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'social':
        return (
          <SocialMediaUI
            content={{
              platform: currentScenario.content.platform || '',
              username: currentScenario.content.username || '',
              post: currentScenario.content.post || '',
              verified: currentScenario.content.username?.includes('Verified'),
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      default:
        return <div className="text-center py-12 text-gray-500">Unknown scenario type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cyber Attack Simulator</h1>
            <p className="text-gray-500">
              {getScenarioCount()} unique scenarios • Realistic immersive training
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                <Target className="w-4 h-4" />
                Correct
              </div>
              <div className="text-2xl font-bold text-green-600">
                {sessionStats.correct}/{sessionStats.total}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                <BarChart3 className="w-4 h-4" />
                Accuracy
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {sessionStats.accuracy}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-xs uppercase text-gray-500 mb-2">Difficulty</div>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'mixed')}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
              >
                <option value="mixed">Mixed</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-center">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Current Scenario */}
          {currentScenario ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full font-medium ${
                  currentScenario.difficulty === "easy" ? "bg-green-100 text-green-700" :
                  currentScenario.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {currentScenario.difficulty}
                </span>
                <span className="text-sm text-gray-500 capitalize">{currentScenario.type}</span>
              </div>

              {renderScenarioUI()}

              {/* AI Analysis */}
              {showResult && (
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                      Generating AI analysis...
                    </div>
                  ) : aiAnalysis && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" /> AI Insight
                      </h4>
                      <p className="text-gray-700">{aiAnalysis.feedback}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Threat Level:</span>
                        <span className={`text-xs uppercase px-3 py-1 rounded-full font-bold ${
                          aiAnalysis.threat_level === 'critical' ? 'bg-red-100 text-red-700' :
                          aiAnalysis.threat_level === 'high' ? 'bg-orange-100 text-orange-700' :
                          aiAnalysis.threat_level === 'low' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {aiAnalysis.threat_level}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Button onClick={loadNextScenario} className="bg-blue-600 hover:bg-blue-700 text-white">
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
            <div className="text-center py-12 text-gray-500">
              Loading scenario...
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scenarios;