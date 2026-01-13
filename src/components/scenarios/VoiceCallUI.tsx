import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  Phone,
  PhoneOff,
  PhoneIncoming,
  Mic,
  MicOff,
  Volume2,
  User,
  Voicemail
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceCallContent {
  callerNumber: string;
  callerName?: string;
  transcript: string;
}

interface VoiceCallUIProps {
  call: VoiceCallContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'answer' | 'hangup' | 'callback' | 'correct_safe_action') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const VoiceCallUI = ({ 
  call, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: VoiceCallUIProps) => {
  const [callState, setCallState] = useState<'ringing' | 'answered' | 'ended'>('ringing');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [ringTime, setRingTime] = useState(0);

  useEffect(() => {
    if (callState === 'ringing' && !showResult) {
      const timer = setInterval(() => {
        setRingTime(t => t + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callState, showResult]);

  const handleAnswer = () => {
    setCallState('answered');
  };

  const handleHangup = () => {
    setCallState('ended');
    if (isPhishing) {
      // Correctly hanging up on a scam call
      onAction('hangup');
    } else {
      // Hanging up on a legitimate call
      onAction('hangup');
    }
  };

  const handleReport = () => {
    setCallState('ended');
    onAction('report');
  };

  // Format caller display
  const getCallerDisplay = () => {
    if (call.callerName) return call.callerName;
    if (call.callerNumber.includes('(')) return call.callerNumber;
    return call.callerNumber;
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* Phone Screen */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-black rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="px-8 py-2 flex items-center justify-between text-white text-xs">
            <span>9:41</span>
            <div className="w-32 h-6 bg-black rounded-full" /> {/* Notch */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm relative">
                <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }} />
              </div>
            </div>
          </div>

          {/* Call Screen */}
          <div className="px-8 py-6 text-center min-h-[500px] flex flex-col">
            {/* Caller Info */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                callState === 'ringing' ? 'bg-gray-700 animate-pulse' : 'bg-gray-700'
              }`}>
                <User className="w-12 h-12 text-gray-400" />
              </div>
              
              <h2 className="text-white text-2xl font-light mb-2">
                {getCallerDisplay()}
              </h2>
              
              <p className="text-gray-400 text-sm mb-1">{call.callerNumber}</p>
              
              {callState === 'ringing' && (
                <p className="text-green-400 text-sm animate-pulse flex items-center gap-2">
                  <PhoneIncoming className="w-4 h-4" />
                  Incoming call...
                </p>
              )}
              
              {callState === 'answered' && (
                <p className="text-green-400 text-sm">
                  Connected
                </p>
              )}
              
              {callState === 'ended' && (
                <p className="text-red-400 text-sm">
                  Call Ended
                </p>
              )}

              {/* Transcript (shown when answered) */}
              {callState === 'answered' && (
                <div className="mt-6 bg-gray-800/50 rounded-2xl p-4 text-left max-w-full">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <Voicemail className="w-4 h-4" />
                    <span>Live Transcript</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed italic">
                    "{call.transcript}"
                  </p>
                </div>
              )}
            </div>

            {/* Call Controls */}
            {callState === 'ringing' && !showResult && (
              <div className="space-y-6">
                <div className="flex justify-center gap-16">
                  {/* Decline */}
                  <button 
                    onClick={handleHangup}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="w-8 h-8 text-white" />
                  </button>
                  
                  {/* Answer */}
                  <button 
                    onClick={handleAnswer}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors animate-bounce"
                  >
                    <Phone className="w-8 h-8 text-white" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs">slide to answer</p>
              </div>
            )}

            {callState === 'answered' && !showResult && (
              <div className="space-y-4">
                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setMuted(!muted)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl ${muted ? 'bg-gray-600' : 'bg-gray-800'}`}
                  >
                    {muted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                    <span className="text-white text-xs">mute</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-800">
                    <div className="w-6 h-6 grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-white rounded-sm" />
                      ))}
                    </div>
                    <span className="text-white text-xs">keypad</span>
                  </button>
                  <button 
                    onClick={() => setSpeaker(!speaker)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl ${speaker ? 'bg-gray-600' : 'bg-gray-800'}`}
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                    <span className="text-white text-xs">speaker</span>
                  </button>
                </div>

                {/* End Call */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleHangup}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff className="w-8 h-8 text-white" />
                  </button>
                </div>

                {/* Report as scam */}
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-400 hover:bg-red-900/30 gap-2"
                  onClick={handleReport}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report as Scam & Hang Up
                </Button>
              </div>
            )}

            {callState === 'ended' && !showResult && (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm mb-4">What do you think about this call?</p>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500 text-red-400 hover:bg-red-900/30 gap-2"
                  onClick={() => onAction('report')}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report as Scam
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-400 hover:bg-green-900/30 gap-2"
                  onClick={() => onAction('correct_safe_action')}
                >
                  <Phone className="w-4 h-4" />
                  Legitimate Call
                </Button>
              </div>
            )}
          </div>

          {/* Result Section */}
          {showResult && (
            <div className={`p-6 ${userCorrect ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
              <div className="flex items-center gap-3 mb-3">
                {userCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <span className="font-bold text-white">
                  {userCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
                <span className={`text-xs uppercase px-2 py-1 rounded-full ${
                  isPhishing ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'
                }`}>
                  {isPhishing ? 'SCAM CALL' : 'LEGITIMATE'}
                </span>
              </div>
              
              {explanation && (
                <p className="text-sm mb-3 text-gray-200">{explanation}</p>
              )}
              
              {isPhishing && redFlags && redFlags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-gray-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" /> Red Flags
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
              
              {!isPhishing && trustIndicators && trustIndicators.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-gray-400 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" /> Trust Indicators
                  </h4>
                  <div className="space-y-1">
                    {trustIndicators.map((indicator, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                        <span className="text-green-400">✓</span>
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Home Indicator */}
          <div className="py-2 flex justify-center">
            <div className="w-32 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallUI;