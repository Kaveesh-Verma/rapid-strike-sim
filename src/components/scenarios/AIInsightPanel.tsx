import { useState } from "react";
import { Lightbulb, Brain, CheckCircle, Loader2, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Scenario } from "@/lib/scenarioGenerator";
import { useLanguage } from "@/hooks/useLanguage";

interface AIInsightPanelProps {
  scenario: Scenario;
  showResult: boolean;
  userAction?: string;
  isCorrect?: boolean;
}

type InsightMode = 'hint' | 'guided' | 'validation';

const AIInsightPanel = ({ scenario, showResult, userAction, isCorrect }: AIInsightPanelProps) => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<InsightMode | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async (mode: InsightMode) => {
    if (activeMode === mode && insight) {
      // Toggle off if same mode clicked again
      setActiveMode(null);
      setInsight(null);
      return;
    }

    setActiveMode(mode);
    setIsLoading(true);
    setError(null);
    setInsight(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-insight-agent', {
        body: {
          mode,
          scenario: {
            type: scenario.type,
            difficulty: scenario.difficulty,
            content: scenario.content,
            correctAnswer: scenario.correctAnswer,
            redFlags: scenario.redFlags,
            trustIndicators: scenario.trustIndicators,
          },
          userAction: mode === 'validation' ? userAction : undefined,
          isCorrect: mode === 'validation' ? isCorrect : undefined,
        },
      });

      if (fnError) throw fnError;
      
      if (data?.insight) {
        setInsight(data.insight);
      } else {
        throw new Error('No insight returned');
      }
    } catch (err) {
      console.error('AI Insight error:', err);
      setError('Unable to get AI insight. Try again later.');
      
      // Provide fallback based on mode
      const fallbacks: Record<InsightMode, string> = {
        hint: "Consider checking: 1) The sender's domain - is it official? 2) The urgency level - are you being pressured? 3) Any requests for sensitive information.",
        guided: "Step 1: Examine the sender carefully. Step 2: Look for urgency or pressure tactics. Step 3: Check all links before clicking. Step 4: Ask yourself if this request is expected.",
        validation: isCorrect 
          ? "Great job! You correctly identified this scenario. Keep practicing to maintain your security awareness."
          : "This was a learning opportunity. Remember to always verify sender identity and be suspicious of urgent requests.",
      };
      setInsight(fallbacks[mode]);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode: InsightMode) => {
    switch (mode) {
      case 'hint': return <Lightbulb className="w-4 h-4" />;
      case 'guided': return <Brain className="w-4 h-4" />;
      case 'validation': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getModeLabel = (mode: InsightMode) => {
    switch (mode) {
      case 'hint': return t.aiInsight.getHint;
      case 'guided': return t.aiInsight.getGuidance;
      case 'validation': return t.aiInsight.validateAnswer;
    }
  };

  const getModeDescription = (mode: InsightMode) => {
    switch (mode) {
      case 'hint': return t.aiInsight.hintModeDesc;
      case 'guided': return t.aiInsight.guidedModeDesc;
      case 'validation': return t.aiInsight.validateModeDesc;
    }
  };

  // Only show hint/guided before answering, show all modes after answering
  const availableModes: InsightMode[] = showResult 
    ? ['hint', 'guided', 'validation'] 
    : ['hint', 'guided'];

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30 p-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-purple-300 font-mono">{t.scenarios.aiInsight}</h3>
      </div>

      {/* Mode Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableModes.map((mode) => (
          <Button
            key={mode}
            variant={activeMode === mode ? "default" : "outline"}
            size="sm"
            onClick={() => fetchInsight(mode)}
            disabled={isLoading}
            className={`gap-2 font-mono text-xs ${
              activeMode === mode 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200'
            }`}
          >
            {getModeIcon(mode)}
            {getModeLabel(mode)}
          </Button>
        ))}
      </div>

      {/* Mode Descriptions */}
      {!activeMode && !isLoading && (
        <div className="space-y-2 text-xs text-gray-400 font-mono">
          {availableModes.map((mode) => (
            <div key={mode} className="flex items-start gap-2">
              <span className="text-purple-400">{getModeIcon(mode)}</span>
              <span><strong className="text-purple-300">{getModeLabel(mode)}:</strong> {getModeDescription(mode)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          <span className="text-purple-300 font-mono text-sm">Analyzing scenario...</span>
        </div>
      )}

      {/* Insight Display */}
      {insight && !isLoading && (
        <div className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-mono text-sm font-semibold capitalize">{activeMode} Mode</span>
          </div>
          <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{insight}</p>
        </div>
      )}

      {/* Error Display */}
      {error && !insight && (
        <div className="text-red-400 text-sm font-mono p-3 bg-red-500/10 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;
