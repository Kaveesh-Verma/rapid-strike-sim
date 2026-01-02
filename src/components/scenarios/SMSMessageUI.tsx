import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  Phone,
  Video,
  Info,
  ChevronLeft,
  Send,
  Plus,
  Camera,
  Mic,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SMSContent {
  sender: string;
  message: string;
  timestamp?: string;
}

interface SMSMessageUIProps {
  sms: SMSContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'link_click' | 'reply' | 'call' | 'correct_safe_action' | 'task_complete') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const SMSMessageUI = ({ 
  sms, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: SMSMessageUIProps) => {
  const [showLinkWarning, setShowLinkWarning] = useState(false);
  const [showTaskPage, setShowTaskPage] = useState(false);

  // Extract link from message
  const extractLink = () => {
    const urlMatch = sms.message.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|[a-zA-Z0-9-]+\.[a-z]{2,}\/[^\s]*/i);
    return urlMatch ? urlMatch[0] : null;
  };

  const messageLink = extractLink();
  const timestamp = sms.timestamp || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Get sender initials
  const getSenderDisplay = () => {
    if (sms.sender.match(/^\+?\d/)) {
      return sms.sender;
    }
    return sms.sender.split(' ')[0];
  };

  const handleLinkClick = () => {
    if (isPhishing) {
      setShowLinkWarning(true);
    } else {
      setShowTaskPage(true);
    }
  };

  const handleTaskComplete = () => {
    setShowTaskPage(false);
    onAction('task_complete');
  };

  const handleWarningContinue = () => {
    setShowLinkWarning(false);
    onAction('link_click');
  };

  const handleReply = () => {
    if (!isPhishing) {
      onAction('correct_safe_action');
    } else {
      onAction('reply');
    }
  };

  // Format message with clickable links
  const formatMessage = () => {
    if (!messageLink) return sms.message;
    
    const parts = sms.message.split(messageLink);
    if (parts.length === 1) return sms.message;
    
    return (
      <>
        {parts[0]}
        <button 
          onClick={handleLinkClick}
          className="text-blue-500 underline cursor-pointer"
          disabled={showResult}
        >
          {messageLink}
        </button>
        {parts.slice(1).join(messageLink)}
      </>
    );
  };

  return (
    <>
      <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg max-w-sm mx-auto">
        {/* iPhone-style Status Bar */}
        <div className="bg-gray-100 px-6 py-2 flex items-center justify-between text-xs">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 17h2v4H2v-4zm4-5h2v9H6v-9zm4-4h2v13h-2V8zm4-4h2v17h-2V4zm4 7h2v10h-2V11z" />
            </svg>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
            <div className="flex items-center">
              <div className="w-6 h-3 border border-current rounded-sm relative">
                <div className="absolute inset-0.5 bg-current rounded-sm" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Messages Header */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <button className="flex items-center gap-1 text-blue-500">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Messages</span>
          </button>
          <div className="text-center">
            <div className="font-semibold text-sm text-gray-900">{getSenderDisplay()}</div>
            <div className="text-xs text-gray-500">
              {sms.sender.match(/^\d/) ? 'Maybe: Unknown' : 'Contact'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white min-h-[300px] p-4 space-y-3">
          {/* Date Header */}
          <div className="text-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Today</span>
          </div>

          {/* Message Bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-900">
                {formatMessage()}
              </div>
              <div className="text-xs text-gray-400 mt-1 ml-2">{timestamp}</div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 flex-shrink-0">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 flex-shrink-0">
              <Camera className="w-5 h-5" />
            </Button>
            <div className="flex-1 bg-white rounded-full px-4 py-2 border border-gray-300">
              <span className="text-gray-400 text-sm">iMessage</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 flex-shrink-0">
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="bg-gray-100 p-4 border-t border-gray-200 space-y-2">
            <p className="text-xs text-center text-gray-500 mb-3">How do you respond to this message?</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-10"
                onClick={handleReply}
              >
                <Send className="w-4 h-4" />
                Reply
              </Button>
              {messageLink && (
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 text-sm h-10"
                  onClick={handleLinkClick}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </Button>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 bg-white text-red-600 border-red-200 hover:bg-red-50 text-sm h-10"
              onClick={() => onAction('report')}
            >
              <AlertTriangle className="w-4 h-4" />
              Report as Phishing
            </Button>
          </div>
        )}

        {/* Result Section */}
        {showResult && (
          <div className={`p-4 border-t-2 ${userCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              {userCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span className="font-bold text-gray-900">
                {userCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
              <span className={`text-xs uppercase px-2 py-1 rounded-full font-medium ${
                isPhishing 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {isPhishing ? 'PHISHING' : 'LEGITIMATE'}
              </span>
            </div>
            
            {explanation && (
              <p className="text-sm mb-3 text-gray-700">{explanation}</p>
            )}
            
            {isPhishing && redFlags && redFlags.length > 0 && (
              <div className="space-y-2 mb-3">
                <h4 className="text-xs uppercase font-bold text-gray-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Red Flags
                </h4>
                <div className="space-y-1">
                  {redFlags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-red-500">•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!isPhishing && trustIndicators && trustIndicators.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold text-gray-500 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" /> Trust Indicators
                </h4>
                <div className="space-y-1">
                  {trustIndicators.map((indicator, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phishing Warning Dialog */}
      <Dialog open={showLinkWarning} onOpenChange={setShowLinkWarning}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span>Dangerous Link Detected!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4 text-gray-600">
              <p>You clicked on a suspicious link in an SMS. This could lead to:</p>
              <ul className="list-disc list-inside space-y-2 text-sm bg-red-50 p-4 rounded-lg">
                <li>Fake websites stealing your credentials</li>
                <li>Malware being installed on your phone</li>
                <li>Premium SMS charges</li>
                <li>Identity theft</li>
              </ul>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Never click links in unexpected SMS messages. Go directly to official websites.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleWarningContinue}
            >
              I understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Completion Page */}
      <Dialog open={showTaskPage} onOpenChange={setShowTaskPage}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-green-600">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <span>Verified Link</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  This is a legitimate link from a trusted source. You can safely proceed.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowTaskPage(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleTaskComplete}>
              Complete Action
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SMSMessageUI;