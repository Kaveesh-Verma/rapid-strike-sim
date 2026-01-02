import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  Lock,
  Skull,
  Timer,
  X,
  Phone,
  CreditCard,
  Bitcoin
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RansomwareContent {
  title: string;
  message: string;
  demandAmount?: string;
  cryptocurrency?: string;
  phoneNumber?: string;
  countdown?: number;
  variant?: 'ransomware' | 'tech_support' | 'fake_alert';
}

interface RansomwarePopupUIProps {
  content: RansomwareContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'pay' | 'call' | 'close' | 'ignore' | 'correct_safe_action') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const RansomwarePopupUI = ({ 
  content, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: RansomwarePopupUIProps) => {
  const [countdown, setCountdown] = useState(content.countdown || 3600);
  const variant = content.variant || 'ransomware';

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCorrectAction = () => {
    if (isPhishing) {
      onAction('report');
    } else {
      onAction('correct_safe_action');
    }
  };

  // Ransomware Variant
  if (variant === 'ransomware') {
    return (
      <div className="relative">
        {/* Fake locked screen background */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-lg" />
        
        <div className="relative bg-gradient-to-b from-red-900 to-red-950 rounded-lg overflow-hidden shadow-2xl border-2 border-red-500">
          {/* Skull Header */}
          <div className="bg-red-800 px-6 py-4 flex items-center gap-4 border-b-2 border-red-500">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <Skull className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                {content.title || 'YOUR FILES ARE ENCRYPTED!'}
              </h1>
              <p className="text-red-300 text-sm">All your important files have been locked</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 text-white space-y-6">
            {/* Countdown Timer */}
            <div className="bg-black/50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                <Timer className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">Time Remaining</span>
              </div>
              <div className="text-4xl font-mono font-bold text-red-500">
                {formatTime(countdown)}
              </div>
              <p className="text-red-300 text-xs mt-2">
                After this time, the price will double!
              </p>
            </div>

            {/* Message */}
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-gray-200 text-sm leading-relaxed">
                {content.message || 'Your personal files have been encrypted with military-grade encryption. To recover your files, you must pay the ransom within the time limit. Do NOT attempt to decrypt files yourself or your data will be permanently destroyed.'}
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-black/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-yellow-400">
                <Bitcoin className="w-5 h-5" />
                <span className="font-bold">Payment Required</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {content.demandAmount || '0.5 BTC'}
              </div>
              <div className="text-xs text-gray-400 font-mono break-all">
                Send to: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-xs">
                DO NOT turn off your computer or try to remove this software. Your files will be PERMANENTLY DESTROYED if you do not pay within the time limit.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!showResult && (
            <div className="bg-black/50 p-4 border-t border-red-800 space-y-3">
              <p className="text-xs text-center text-gray-400 mb-2">How do you respond to this?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
                  onClick={() => onAction('pay')}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Ransom
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-900/50 gap-2"
                  onClick={() => onAction('close')}
                >
                  <X className="w-4 h-4" />
                  Close/Ignore
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-gray-500 text-gray-300 hover:bg-gray-800 gap-2"
                onClick={handleCorrectAction}
              >
                <AlertTriangle className="w-4 h-4" />
                Report & Seek IT Help
              </Button>
            </div>
          )}

          {/* Result Section */}
          {showResult && (
            <div className={`p-4 border-t-2 ${userCorrect ? 'border-green-500 bg-green-900/50' : 'border-red-500 bg-red-900/50'}`}>
              <div className="flex items-center gap-3 mb-3">
                {userCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <span className="font-bold text-white">
                  {userCorrect ? 'Correct Response!' : 'Incorrect Response!'}
                </span>
              </div>
              
              {explanation && (
                <p className="text-sm mb-3 text-gray-200">{explanation}</p>
              )}
              
              {redFlags && redFlags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-gray-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Warning Signs
                  </h4>
                  <div className="space-y-1">
                    {redFlags.map((flag, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                        <span className="text-red-400">•</span>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tech Support Scam Variant
  if (variant === 'tech_support') {
    return (
      <div className="bg-blue-900 rounded-lg overflow-hidden shadow-2xl border-2 border-blue-400">
        {/* Windows-style Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Windows Defender Security Center</span>
          </div>
          <button className="text-white hover:bg-red-500 px-2 rounded">×</button>
        </div>

        {/* Alert Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">
            {content.title || 'VIRUS DETECTED!'}
          </h2>
          
          <p className="text-yellow-300 text-lg">
            Your computer has been infected!
          </p>
          
          <div className="bg-red-900/50 border border-red-500 rounded p-4 text-left">
            <p className="text-white text-sm">
              {content.message || 'Windows Security has detected a critical threat. Your personal data, passwords, and financial information are at risk. Do NOT ignore this warning!'}
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">Call Microsoft Support Immediately:</p>
            <div className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-2">
              <Phone className="w-8 h-8" />
              {content.phoneNumber || '1-888-555-0199'}
            </div>
          </div>

          <p className="text-red-300 text-xs animate-pulse">
            ⚠️ DO NOT close this window or turn off your computer!
          </p>
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="bg-black/30 p-4 space-y-2">
            <p className="text-xs text-center text-gray-400">What's your response?</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => onAction('call')}
              >
                <Phone className="w-4 h-4" />
                Call Number
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-500 text-gray-300 hover:bg-gray-700 gap-2"
                onClick={() => onAction('close')}
              >
                <X className="w-4 h-4" />
                Close Window
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-red-500 text-red-300 hover:bg-red-900/50 gap-2"
              onClick={handleCorrectAction}
            >
              <AlertTriangle className="w-4 h-4" />
              Report as Scam
            </Button>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div className={`p-4 border-t-2 ${userCorrect ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
            <div className="flex items-center gap-3 mb-3">
              {userCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <span className="font-bold text-white">
                {userCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            {explanation && <p className="text-sm text-gray-200">{explanation}</p>}
          </div>
        )}
      </div>
    );
  }

  // Fake Alert Variant (Browser popup)
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300 max-w-md mx-auto">
      {/* Browser-style popup */}
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <span className="text-sm text-gray-600">{content.title || 'Security Alert'}</span>
        <button className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900">{content.title || 'Security Warning!'}</h3>
        
        <p className="text-gray-600 text-sm">
          {content.message || 'Suspicious activity detected on your account. Please verify your identity immediately.'}
        </p>
      </div>

      {!showResult && (
        <div className="bg-gray-50 p-4 space-y-2">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onAction('pay')}
          >
            Verify Now
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleCorrectAction}
          >
            Report as Phishing
          </Button>
        </div>
      )}

      {showResult && (
        <div className={`p-4 ${userCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            {userCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-bold">{userCorrect ? 'Correct!' : 'Incorrect!'}</span>
          </div>
          {explanation && <p className="text-sm text-gray-600">{explanation}</p>}
        </div>
      )}
    </div>
  );
};

export default RansomwarePopupUI;