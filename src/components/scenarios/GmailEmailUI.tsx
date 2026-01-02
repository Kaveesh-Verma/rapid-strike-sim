import { useState } from "react";
import { 
  Star, 
  Reply, 
  Forward, 
  MoreVertical, 
  Paperclip, 
  Printer,
  Trash2,
  Archive,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  XCircle,
  Shield,
  ArrowLeft,
  Inbox,
  Clock,
  Search,
  Menu,
  Settings,
  HelpCircle,
  Grid3X3,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface EmailContent {
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  link?: string;
  taskAction?: string;
}

interface GmailEmailUIProps {
  email: EmailContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'link_click' | 'reply' | 'forward' | 'correct_safe_action' | 'task_complete') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const GmailEmailUI = ({ 
  email, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: GmailEmailUIProps) => {
  const [starred, setStarred] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [showLinkWarning, setShowLinkWarning] = useState(false);
  const [showTaskPage, setShowTaskPage] = useState(false);
  const [viewMode, setViewMode] = useState<'inbox' | 'email'>('inbox');

  // Extract sender name and email
  const senderMatch = email.from.match(/^(.+?)\s*<(.+)>$/);
  const senderName = senderMatch ? senderMatch[1] : email.from.split('@')[0];
  const senderEmail = senderMatch ? senderMatch[2] : email.from;
  
  // Get initials for avatar
  const initials = senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Get avatar color based on sender
  const getAvatarColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'
    ];
    const hash = senderName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Extract link from email body if present
  const extractLink = () => {
    const urlMatch = email.body.match(/https?:\/\/[^\s\n]+/);
    return urlMatch ? urlMatch[0] : email.link || null;
  };

  const emailLink = extractLink();

  // Get preview text
  const getPreviewText = () => {
    const text = email.body.replace(/https?:\/\/[^\s\n]+/g, '').trim();
    return text.substring(0, 80) + (text.length > 80 ? '...' : '');
  };

  const handleLinkClick = () => {
    if (isPhishing) {
      setShowLinkWarning(true);
    } else {
      // For legitimate emails, show task completion page
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

  const handleForward = () => {
    if (!isPhishing) {
      onAction('correct_safe_action');
    } else {
      onAction('forward');
    }
  };

  // Format body with clickable link styling
  const formatBody = () => {
    if (!emailLink) return email.body;
    
    const parts = email.body.split(emailLink);
    if (parts.length === 1) return email.body;
    
    return (
      <>
        {parts[0]}
        <button 
          onClick={handleLinkClick}
          className="text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
          disabled={showResult}
        >
          {emailLink}
          <ExternalLink className="w-3 h-3" />
        </button>
        {parts.slice(1).join(emailLink)}
      </>
    );
  };

  // Inbox View
  if (viewMode === 'inbox') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Gmail Header */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" className="h-8 object-contain" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-xl text-gray-500 font-normal hidden sm:inline">Gmail</span>
          </div>
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 hover:bg-gray-200 hover:shadow-sm transition-all">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-500 text-sm">Search mail</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <div className={`w-8 h-8 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-sm font-medium ml-2`}>
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sidebar + Content */}
        <div className="flex min-h-[400px]">
          {/* Sidebar */}
          <div className="w-16 lg:w-56 border-r border-gray-100 pt-4 hidden sm:block">
            <div className="px-3">
              <button className="flex items-center gap-3 bg-blue-100 text-blue-700 rounded-full px-4 py-3 mb-4 hover:shadow-sm transition-shadow">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-sm font-medium hidden lg:inline">Compose</span>
              </button>
            </div>
            <nav className="space-y-0.5">
              <div className="flex items-center gap-4 px-6 py-2 bg-red-50 text-red-700 rounded-r-full mr-4 font-medium">
                <Inbox className="w-5 h-5" />
                <span className="text-sm hidden lg:inline">Inbox</span>
                <span className="ml-auto text-xs hidden lg:inline">1</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full mr-4">
                <Star className="w-5 h-5" />
                <span className="text-sm hidden lg:inline">Starred</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full mr-4">
                <Clock className="w-5 h-5" />
                <span className="text-sm hidden lg:inline">Snoozed</span>
              </div>
            </nav>
          </div>

          {/* Email List */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Email Row - Clickable */}
            <button 
              onClick={() => setViewMode('email')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:shadow-md bg-white border-b border-gray-100 text-left transition-shadow cursor-pointer"
            >
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
              <button 
                onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
                className="text-gray-400 hover:text-yellow-500"
              >
                <Star className={`w-5 h-5 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </button>
              <div className={`w-8 h-8 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm truncate">{senderName}</span>
                  {email.hasAttachment && <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-medium text-gray-900 text-sm truncate">{email.subject}</span>
                  <span className="text-gray-500 text-sm truncate"> - {getPreviewText()}</span>
                </div>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">{email.date.split(',')[0]}</span>
            </button>

            {/* Empty space */}
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <Inbox className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>No other emails</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Email View
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Gmail Header */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl text-gray-700 font-normal">Gmail</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-600">
              <Settings className="w-5 h-5" />
            </Button>
            <div className={`w-8 h-8 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-sm font-medium ml-2`}>
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Email Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-gray-600"
            onClick={() => setViewMode('inbox')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
            <Archive className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onAction('report')}
            disabled={showResult}
            title="Mark as Phishing"
          >
            <AlertTriangle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="h-5 w-px bg-gray-300 mx-1" />
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Subject Line */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-normal text-gray-900">{email.subject}</h1>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-4 flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full ${getAvatarColor()} flex items-center justify-center flex-shrink-0`}>
            <span className="text-sm font-medium text-white">{initials}</span>
          </div>

          {/* Sender Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{senderName}</span>
              <span className="text-sm text-gray-500">&lt;{senderEmail}&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>to me</span>
              <button 
                onClick={() => setShowHeaders(!showHeaders)}
                className="hover:text-gray-700 flex items-center"
              >
                {showHeaders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {showHeaders && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs font-mono space-y-1 text-gray-600 border border-gray-200">
                <div>from: {email.from}</div>
                <div>to: {email.to}</div>
                <div>date: {email.date}</div>
                <div>subject: {email.subject}</div>
              </div>
            )}
          </div>

          {/* Date & Star */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-gray-500">{email.date}</span>
            <button 
              onClick={() => setStarred(!starred)}
              className="text-gray-400 hover:text-yellow-500"
            >
              <Star className={`w-5 h-5 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <Reply className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Attachment */}
        {email.hasAttachment && (
          <div className="px-6 pb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm hover:bg-gray-100 cursor-pointer">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{email.attachmentName || 'attachment.pdf'}</span>
            </div>
          </div>
        )}

        {/* Email Body */}
        <div className="px-6 py-6 min-h-[200px]">
          <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {formatBody()}
          </div>
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleReply}
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleForward}
            >
              <Forward className="w-4 h-4" />
              Forward
            </Button>
            {emailLink && (
              <Button 
                variant="outline" 
                className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={handleLinkClick}
              >
                <ExternalLink className="w-4 h-4" />
                {email.taskAction || 'Open Link'}
              </Button>
            )}
            <div className="flex-1" />
            <Button 
              variant="outline" 
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onAction('report')}
            >
              <AlertTriangle className="w-4 h-4" />
              Mark as Phishing
            </Button>
          </div>
        )}

        {/* Result Section */}
        {showResult && (
          <div className={`p-6 border-t-2 ${userCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center gap-3 mb-4">
              {userCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <span className="font-bold text-gray-900">
                {userCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
              <span className={`text-xs uppercase px-3 py-1 rounded-full font-medium ${
                isPhishing 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                This was {isPhishing ? 'PHISHING' : 'LEGITIMATE'}
              </span>
            </div>
            
            {explanation && (
              <p className="text-sm mb-4 text-gray-700">{explanation}</p>
            )}
            
            {isPhishing && redFlags && redFlags.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase font-bold text-gray-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Red Flags
                </h4>
                <div className="grid gap-1">
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
                <div className="grid gap-1">
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
              <span>Oh no! This was a phishing email!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4 text-gray-600">
              <p className="text-base">
                You clicked on a malicious link. In a real scenario, this could have:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm bg-red-50 p-4 rounded-lg">
                <li>Stolen your login credentials</li>
                <li>Downloaded malware to your device</li>
                <li>Compromised your personal information</li>
                <li>Given attackers access to your accounts</li>
              </ul>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Always verify email senders and hover over links before clicking.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleWarningContinue}
            >
              I understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Completion Page for Legitimate Emails */}
      <Dialog open={showTaskPage} onOpenChange={setShowTaskPage}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-green-600">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <span>Secure Page</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500 font-mono truncate">{emailLink}</span>
                </div>
                <p className="text-gray-700">
                  This is a legitimate page. You can safely complete the requested action here.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Task:</strong> {email.taskAction || 'Complete the action from the email'}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => setShowTaskPage(false)}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleTaskComplete}
            >
              Complete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GmailEmailUI;