import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GmailEmailUI from "@/components/scenarios/GmailEmailUI";
import SMSMessageUI from "@/components/scenarios/SMSMessageUI";
import PhishingWebsiteUI from "@/components/scenarios/PhishingWebsiteUI";
import VoiceCallUI from "@/components/scenarios/VoiceCallUI";
import QRCodeUI from "@/components/scenarios/QRCodeUI";
import SocialMediaUI from "@/components/scenarios/SocialMediaUI";
import RansomwarePopupUI from "@/components/scenarios/RansomwarePopupUI";

interface ScenarioData {
  id: string;
  type: string;
  title: string;
  difficulty: string;
  content: Record<string, unknown>;
  correctAnswer: string;
  explanation: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const ScenarioToken = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userCorrect, setUserCorrect] = useState(false);

  useEffect(() => {
    if (token) {
      loadScenario(token);
    }
  }, [token]);

  const loadScenario = async (tokenId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("scenario_tokens")
        .select("*")
        .eq("token", tokenId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError("Scenario not found or link has expired.");
        return;
      }

      if (data.used_at) {
        setError("This scenario has already been completed.");
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError("This scenario link has expired.");
        return;
      }

      // Parse scenario_data - it's stored as JSON
      const scenarioData = data.scenario_data as unknown as ScenarioData;
      setScenario(scenarioData);
    } catch (err) {
      console.error("Error loading scenario:", err);
      setError("Failed to load scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!scenario || !token) return;

    const isPhishing = scenario.correctAnswer === 'phishing';
    let isCorrect = false;

    if (action === 'report' && isPhishing) {
      isCorrect = true;
    } else if ((action === 'task_complete' || action === 'correct_safe_action') && !isPhishing) {
      isCorrect = true;
    } else if ((action === 'hangup' || action === 'close' || action === 'ignore') && isPhishing) {
      isCorrect = true;
    }

    setUserCorrect(isCorrect);
    setShowResult(true);

    // Mark token as used
    await supabase
      .from("scenario_tokens")
      .update({ used_at: new Date().toISOString(), is_correct: isCorrect, result_action: action })
      .eq("token", token);

    toast({
      title: isCorrect ? "✓ CORRECT!" : "✗ INCORRECT",
      description: isCorrect 
        ? "Great security awareness!" 
        : `This was ${isPhishing ? 'a phishing attempt' : 'legitimate'}.`,
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const renderScenarioUI = () => {
    if (!scenario) return null;

    const commonProps = {
      showResult,
      userCorrect,
      explanation: scenario.explanation,
      redFlags: scenario.redFlags,
      trustIndicators: scenario.trustIndicators,
    };

    const content = scenario.content as Record<string, unknown>;

    switch (scenario.type) {
      case 'email':
        return (
          <GmailEmailUI
            email={{
              from: (content.from as string) || '',
              to: (content.to as string) || 'you@email.com',
              subject: (content.subject as string) || '',
              body: (content.body as string) || '',
              date: (content.date as string) || new Date().toLocaleDateString(),
              hasAttachment: content.hasAttachment as boolean,
              attachmentName: content.attachmentName as string,
              taskAction: content.taskAction as string,
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'sms':
        return (
          <SMSMessageUI
            sms={{
              sender: (content.sender as string) || '',
              message: (content.message as string) || '',
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'website':
        return (
          <PhishingWebsiteUI
            website={{
              url: (content.url as string) || '',
              websiteTitle: (content.websiteTitle as string) || '',
              websiteContent: (content.websiteContent as string) || '',
              brandName: content.brandName as string,
              hasLoginForm: content.hasLoginForm as boolean,
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'voice':
        return (
          <VoiceCallUI
            call={{
              callerNumber: (content.callerNumber as string) || '',
              callerName: content.callerName as string,
              transcript: (content.transcript as string) || '',
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'qrcode':
        return (
          <QRCodeUI
            qrCode={{
              qrContext: (content.qrContext as string) || '',
              qrDestination: (content.qrDestination as string) || '',
              location: content.location as string,
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'social':
        return (
          <SocialMediaUI
            content={{
              platform: (content.platform as string) || '',
              username: (content.username as string) || '',
              displayName: content.displayName as string,
              post: (content.post as string) || '',
              verified: (content.verified as boolean) || (content.username as string)?.includes('Verified'),
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      case 'ransomware':
        return (
          <RansomwarePopupUI
            content={{
              title: (content.title as string) || 'System Alert',
              message: (content.body as string) || (content.message as string) || '',
              demandAmount: content.demandAmount as string,
              phoneNumber: content.phoneNumber as string,
              countdown: content.countdown as number | undefined,
              variant: content.variant as 'ransomware' | 'fake_alert' | 'tech_support' | undefined,
            }}
            isPhishing={scenario.correctAnswer === 'phishing'}
            onAction={handleAction}
            {...commonProps}
          />
        );

      default:
        return <div className="text-center py-12 text-gray-500">Unknown scenario type</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cyber-green animate-pulse mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-200 font-mono mb-2">Scenario Unavailable</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button 
            onClick={() => navigate("/scenarios")} 
            className="bg-cyber-green hover:bg-cyber-green/80 text-black font-mono"
          >
            Go to Scenarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyber-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyber-green font-mono">MOBILE SCENARIO</h1>
            <p className="text-gray-500 text-sm font-mono">Sent to your device for training</p>
          </div>
        </div>

        {/* Scenario */}
        {scenario && (
          <div className="mb-4">
            <span className={`text-xs uppercase px-3 py-1 rounded-full font-mono border ${
              scenario.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              scenario.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {scenario.difficulty}
            </span>
          </div>
        )}

        {renderScenarioUI()}

        {showResult && (
          <div className="mt-6 text-center">
            <Button 
              onClick={() => navigate("/scenarios")} 
              className="bg-cyber-green hover:bg-cyber-green/80 text-black font-mono"
            >
              Continue Training →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioToken;
