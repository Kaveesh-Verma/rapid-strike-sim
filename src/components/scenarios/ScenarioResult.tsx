import { CheckCircle, XCircle, AlertTriangle, Lightbulb, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAnalysis {
  feedback: string;
  tips: string[];
  threat_level: string;
  real_world_impact: string;
}

interface ScenarioResultProps {
  isCorrect: boolean;
  score: number;
  explanation: string;
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
  onBack: () => void;
  onNext: () => void;
}

const ScenarioResult = ({ 
  isCorrect, 
  score, 
  explanation, 
  aiAnalysis, 
  isAnalyzing,
  onBack, 
  onNext 
}: ScenarioResultProps) => {
  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-primary border-primary';
      case 'medium': return 'text-accent border-accent';
      case 'high': return 'text-destructive/70 border-destructive/70';
      case 'critical': return 'text-destructive border-destructive';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <div className="border-2 border-border bg-card animate-in fade-in duration-500">
      {/* Header */}
      <div className={`p-6 border-b-2 ${isCorrect ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10"}`}>
        <div className="flex items-center gap-4">
          {isCorrect ? (
            <CheckCircle className="w-12 h-12 text-primary animate-in zoom-in duration-300" />
          ) : (
            <XCircle className="w-12 h-12 text-destructive animate-in zoom-in duration-300" />
          )}
          <div>
            <h2 className="text-2xl font-bold uppercase">
              {isCorrect ? "Correct Response" : "Incorrect Response"}
            </h2>
            <p className={`text-lg mt-1 font-bold ${score > 0 ? 'text-primary' : 'text-destructive'}`}>
              {score > 0 ? "+" : ""}{score} points
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Original Explanation */}
        <div className="border-l-2 border-primary pl-4">
          <h3 className="font-bold uppercase text-sm mb-2 text-primary flex items-center gap-2">
            <Shield className="w-4 h-4" /> Analysis
          </h3>
          <p className="text-muted-foreground">{explanation}</p>
        </div>

        {/* AI Analysis Section */}
        {isAnalyzing ? (
          <div className="bg-muted/50 p-4 border border-border flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Generating AI analysis...</span>
          </div>
        ) : aiAnalysis && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
            {/* AI Feedback */}
            <div className="bg-muted/30 p-4 border border-border">
              <h4 className="font-bold uppercase text-xs mb-2 text-accent flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> AI Insight
              </h4>
              <p className="text-sm text-foreground">{aiAnalysis.feedback}</p>
            </div>

            {/* Threat Level */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase text-muted-foreground">Threat Level:</span>
              <span className={`text-xs uppercase px-3 py-1 border font-bold ${getThreatColor(aiAnalysis.threat_level)}`}>
                {aiAnalysis.threat_level}
              </span>
            </div>

            {/* Real World Impact */}
            <div className="bg-destructive/10 p-4 border border-destructive/30">
              <h4 className="font-bold uppercase text-xs mb-2 text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Real World Impact
              </h4>
              <p className="text-sm text-foreground">{aiAnalysis.real_world_impact}</p>
            </div>

            {/* Tips */}
            <div>
              <h4 className="font-bold uppercase text-xs mb-3 text-muted-foreground">Quick Tips</h4>
              <div className="grid gap-2">
                {aiAnalysis.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-border">
          <Button onClick={onBack} variant="outline">
            Back to Scenarios
          </Button>
          <Button onClick={onNext} variant="cyber">
            Next Scenario →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioResult;
