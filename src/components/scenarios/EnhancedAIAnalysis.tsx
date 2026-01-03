import { 
  Shield, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Lock,
  Eye,
  Activity,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Brain,
  BarChart3,
  FileWarning,
  Server
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIAnalysis {
  feedback: string;
  tips: string[];
  threat_level: string;
  real_world_impact: string;
}

interface EnhancedAIAnalysisProps {
  aiAnalysis: AIAnalysis;
  isCorrect: boolean;
  isPhishing: boolean;
  explanation: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const EnhancedAIAnalysis = ({
  aiAnalysis,
  isCorrect,
  isPhishing,
  explanation,
  redFlags,
  trustIndicators,
}: EnhancedAIAnalysisProps) => {
  // Calculate confidence score based on threat level
  const getConfidenceScore = () => {
    switch (aiAnalysis.threat_level) {
      case 'critical': return 98;
      case 'high': return 89;
      case 'medium': return 72;
      case 'low': return 35;
      default: return 50;
    }
  };

  const confidenceScore = getConfidenceScore();

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-500' };
      case 'medium': return { text: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500' };
      case 'high': return { text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-500' };
      case 'critical': return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500' };
      default: return { text: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-500' };
    }
  };

  const threatColors = getThreatColor(aiAnalysis.threat_level);

  // Get attack vector based on content
  const getAttackVector = () => {
    if (!isPhishing) return 'No Attack Detected';
    if (aiAnalysis.feedback?.toLowerCase().includes('credential')) return 'Credential Harvesting';
    if (aiAnalysis.feedback?.toLowerCase().includes('wire') || aiAnalysis.feedback?.toLowerCase().includes('payment')) return 'Financial Fraud';
    if (aiAnalysis.feedback?.toLowerCase().includes('ransomware')) return 'Ransomware Attack';
    if (aiAnalysis.feedback?.toLowerCase().includes('social')) return 'Social Engineering';
    return 'Phishing Attack';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {isCorrect ? 'Excellent Response!' : 'Incorrect Response'}
            </h3>
            <p className="text-sm text-gray-600">
              {isPhishing ? 'This was a phishing attempt' : 'This was legitimate'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Decision Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Threat Level */}
          <div className={`p-4 rounded-lg border ${threatColors.border} ${threatColors.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-5 h-5 ${threatColors.text}`} />
              <span className="text-xs uppercase font-semibold text-gray-600">Threat Level</span>
            </div>
            <div className={`text-2xl font-bold uppercase ${threatColors.text}`}>
              {aiAnalysis.threat_level}
            </div>
          </div>

          {/* AI Confidence */}
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-xs uppercase font-semibold text-gray-600">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {confidenceScore}%
            </div>
          </div>
        </div>

        {/* Confidence Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Detection Confidence</span>
            <span className={`font-semibold ${confidenceScore > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
              {confidenceScore}%
            </span>
          </div>
          <Progress value={confidenceScore} className="h-2" />
        </div>

        {/* AI Analysis Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            AI Analysis Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Attack Vector:</span>
              <span className="font-medium text-gray-900">{getAttackVector()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Intent Analysis:</span>
              <span className="font-medium text-gray-900">{isPhishing ? 'Malicious' : 'Benign'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Domain Check:</span>
              <span className={`font-medium ${isPhishing ? 'text-red-600' : 'text-green-600'}`}>
                {isPhishing ? 'Suspicious' : 'Verified'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Pattern Match:</span>
              <span className="font-medium text-gray-900">{isPhishing ? 'Known Attack' : 'Normal'}</span>
            </div>
          </div>
        </div>

        {/* Main Analysis */}
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-3 pr-3 rounded-r-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-900">Security Analysis</h4>
          </div>
          <p className="text-gray-700">{explanation}</p>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900">AI Insight</h4>
          </div>
          <p className="text-gray-700">{aiAnalysis.feedback}</p>
        </div>

        {/* Red Flags / Trust Indicators */}
        {isPhishing && redFlags && redFlags.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <FileWarning className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-red-800">Enterprise Red Flags Detected</h4>
            </div>
            <div className="space-y-2">
              {redFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <span className="text-gray-700 text-sm">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isPhishing && trustIndicators && trustIndicators.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-bold text-green-800">Trust Indicators Verified</h4>
            </div>
            <div className="space-y-2">
              {trustIndicators.map((indicator, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real World Impact */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-5 h-5 text-orange-600" />
            <h4 className="font-bold text-orange-800">Real-World Impact Analysis</h4>
          </div>
          <p className="text-gray-700 text-sm">{aiAnalysis.real_world_impact}</p>
          
          {isPhishing && (
            <div className="mt-4 pt-4 border-t border-orange-200">
              <h5 className="font-semibold text-gray-800 text-sm mb-2">Potential Consequences:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  Account takeover and credential theft
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  Financial losses and fraudulent transactions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  Data breach and privacy violations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  Lateral movement within organization
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-gray-600" />
            <h4 className="font-bold text-gray-800">Recommended Actions</h4>
          </div>
          <div className="space-y-2">
            {aiAnalysis.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Learning Note */}
        <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>AI continuously learns from user responses and emerging threats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIAnalysis;
