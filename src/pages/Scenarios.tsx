import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, RefreshCw, BarChart3, Target, ChevronRight, Zap } from "lucide-react";
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
import EnhancedAIAnalysis from "@/components/scenarios/EnhancedAIAnalysis";
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
  const [scenarioStartTime, setScenarioStartTime] = useState<number>(Date.now());

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
    setScenarioStartTime(Date.now());
  };

  const getAIAnalysis = useCallback(async (scenario: Scenario, userAction: string, isCorrect: boolean, timeTaken: number) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-scenario', {
        body: {
          scenario: {
            title: scenario.title,
            type: scenario.type,
            difficulty: scenario.difficulty,
            content: scenario.content,
            explanation: scenario.explanation,
            redFlags: scenario.redFlags,
            trustIndicators: scenario.trustIndicators,
            correctAnswer: scenario.correctAnswer,
          },
          userAction,
          correctAction: scenario.correctAnswer === 'phishing' ? 'Report as Phishing' : 'Complete task / Interact normally',
          isCorrect,
          timeTaken,
        }
      });

      if (response.data) {
        setAiAnalysis(response.data);
      } else {
        // Fallback analysis
        setAiAnalysis({
          feedback: scenario.explanation,
          tips: scenario.correctAnswer === 'phishing' 
            ? ['Always verify sender domains carefully', 'Never click links in unexpected messages', 'When in doubt, contact the sender through official channels']
            : ['Legitimate messages typically have specific details', 'Official domains are trustworthy', 'Context matters - expected communications are usually safe'],
          threat_level: scenario.correctAnswer === 'phishing' ? 
            (scenario.difficulty === 'hard' ? 'critical' : scenario.difficulty === 'medium' ? 'high' : 'medium') : 'low',
          real_world_impact: scenario.correctAnswer === 'phishing'
            ? 'Falling for this attack could result in credential theft, financial loss, account takeover, and potential spread to other victims through your compromised accounts.'
            : 'This was a legitimate communication. Recognizing safe messages is just as important as detecting threats to maintain productivity.',
        });
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      // Provide fallback
      setAiAnalysis({
        feedback: scenario.explanation,
        tips: ['Stay vigilant', 'Verify before clicking', 'Trust your instincts'],
        threat_level: scenario.correctAnswer === 'phishing' ? 'high' : 'low',
        real_world_impact: 'Understanding this scenario helps build your security awareness skills.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const processResult = async (isCorrect: boolean, userAction: string) => {
    if (!currentScenario || !userId) return;

    const timeTaken = Math.round((Date.now() - scenarioStartTime) / 1000);
    
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
        time_taken_seconds: timeTaken,
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
        ? `+${difficultyScores[currentScenario.difficulty]} points! Great security awareness.`
        : `-5 points. This was ${currentScenario.correctAnswer === 'phishing' ? 'a phishing attempt' : 'legitimate'}.`,
      variant: isCorrect ? "default" : "destructive",
    });

    getAIAnalysis(currentScenario, userAction, isCorrect, timeTaken);
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
              taskAction: currentScenario.content.taskAction,
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
              brandName: currentScenario.content.brandName,
              hasLoginForm: currentScenario.content.hasLoginForm,
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
              callerName: currentScenario.content.callerName,
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
              location: currentScenario.content.location,
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
              displayName: currentScenario.content.displayName,
              post: currentScenario.content.post || '',
              verified: currentScenario.content.verified || currentScenario.content.username?.includes('Verified'),
            }}
            isPhishing={currentScenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'ransomware':
        return (
          <RansomwarePopupUI
            content={{
              title: currentScenario.content.title || 'System Alert',
              message: currentScenario.content.body || currentScenario.content.message || '',
              demandAmount: currentScenario.content.demandAmount,
              phoneNumber: currentScenario.content.phoneNumber,
              countdown: currentScenario.content.countdown,
              variant: currentScenario.content.variant,
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

  const getDifficultyStyles = (diff: string, isSelected: boolean) => {
    const base = "px-4 py-2 rounded-lg font-medium text-sm transition-all border-2";
    if (isSelected) {
      switch (diff) {
        case 'easy': return `${base} bg-green-600 text-white border-green-600`;
        case 'medium': return `${base} bg-yellow-500 text-white border-yellow-500`;
        case 'hard': return `${base} bg-red-600 text-white border-red-600`;
        case 'mixed': return `${base} bg-blue-600 text-white border-blue-600`;
        default: return `${base} bg-gray-600 text-white border-gray-600`;
      }
    }
    switch (diff) {
      case 'easy': return `${base} bg-white text-green-700 border-green-300 hover:border-green-500 hover:bg-green-50`;
      case 'medium': return `${base} bg-white text-yellow-700 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50`;
      case 'hard': return `${base} bg-white text-red-700 border-red-300 hover:border-red-500 hover:bg-red-50`;
      case 'mixed': return `${base} bg-white text-blue-700 border-blue-300 hover:border-blue-500 hover:bg-blue-50`;
      default: return `${base} bg-white text-gray-700 border-gray-300 hover:border-gray-500`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cyber Attack Simulator</h1>
                <p className="text-gray-500 text-sm">
                  {getScenarioCount()} unique scenarios • Enterprise-grade training
                </p>
              </div>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                <Target className="w-4 h-4" />
                Score
              </div>
              <div className="text-2xl font-bold text-gray-900">
                <span className="text-green-600">{sessionStats.correct}</span>
                <span className="text-gray-400">/{sessionStats.total}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs uppercase mb-1">
                <BarChart3 className="w-4 h-4" />
                Accuracy
              </div>
              <div className={`text-2xl font-bold ${sessionStats.accuracy >= 70 ? 'text-green-600' : sessionStats.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {sessionStats.accuracy}%
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 col-span-2">
              <div className="text-xs uppercase text-gray-500 mb-2">Difficulty</div>
              <div className="flex gap-2 flex-wrap">
                {(['mixed', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDifficulty(d);
                      loadNextScenario();
                    }}
                    className={getDifficultyStyles(d, difficulty === d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-gray-600">
              <RefreshCw className="w-4 h-4" /> Reset Session
            </Button>
          </div>

          {/* Current Scenario */}
          {currentScenario ? (
            <>
              {/* Scenario Badge */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold ${
                    currentScenario.difficulty === "easy" ? "bg-green-100 text-green-700 border border-green-200" :
                    currentScenario.difficulty === "medium" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                    "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    {currentScenario.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 capitalize flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {currentScenario.type}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Scenario #{sessionStats.total + 1}
                </span>
              </div>

              {/* Scenario UI */}
              {renderScenarioUI()}

              {/* AI Analysis Section */}
              {showResult && (
                <div className="mt-6 space-y-6">
                  {isAnalyzing ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                        <div className="text-center">
                          <p className="text-gray-700 font-medium">Analyzing scenario...</p>
                          <p className="text-gray-500 text-sm">AI is evaluating threat indicators</p>
                        </div>
                      </div>
                    </div>
                  ) : aiAnalysis && (
                    <EnhancedAIAnalysis
                      aiAnalysis={aiAnalysis}
                      isCorrect={userCorrect}
                      isPhishing={currentScenario.correctAnswer === 'phishing'}
                      explanation={currentScenario.explanation}
                      redFlags={currentScenario.redFlags}
                      trustIndicators={currentScenario.trustIndicators}
                    />
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 justify-center">
                    <Button onClick={loadNextScenario} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      Next Scenario <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => navigate('/dashboard')} variant="outline">
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-500">Loading scenario...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scenarios;
