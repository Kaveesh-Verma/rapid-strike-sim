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
  ArrowLeft
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
}

interface GmailEmailUIProps {
  email: EmailContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'link_click' | 'reply' | 'forward' | 'correct_safe_action') => void;
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
  const [clickedLink, setClickedLink] = useState(false);

  // Extract sender name and email
  const senderMatch = email.from.match(/^(.+?)\s*<(.+)>$/);
  const senderName = senderMatch ? senderMatch[1] : email.from;
  const senderEmail = senderMatch ? senderMatch[2] : email.from;
  
  // Get initials for avatar
  const initials = senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Extract link from email body if present
  const extractLink = () => {
    const urlMatch = email.body.match(/https?:\/\/[^\s\n]+/);
    return urlMatch ? urlMatch[0] : email.link || null;
  };

  const emailLink = extractLink();

  const handleLinkClick = () => {
    if (isPhishing) {
      // Show warning for phishing emails
      setShowLinkWarning(true);
      setClickedLink(true);
    } else {
      // For legitimate emails, clicking link is correct
      onAction('correct_safe_action');
    }
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

  return (
    <>
      <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm">
        {/* Gmail-style Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Archive className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onAction('report')}
            disabled={showResult}
            title="Mark as Phishing"
          >
            <AlertTriangle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="h-5 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Subject Line */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-xl font-normal text-foreground">{email.subject}</h2>
        </div>

        {/* Sender Info */}
        <div className="p-4 flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary">{initials}</span>
          </div>

          {/* Sender Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">{senderName}</span>
              <span className="text-sm text-muted-foreground">&lt;{senderEmail}&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>to me</span>
              <button 
                onClick={() => setShowHeaders(!showHeaders)}
                className="hover:text-foreground flex items-center"
              >
                {showHeaders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {showHeaders && (
              <div className="mt-2 p-3 bg-muted/50 rounded text-xs font-mono space-y-1 text-muted-foreground">
                <div>from: {email.from}</div>
                <div>to: {email.to}</div>
                <div>date: {email.date}</div>
                <div>subject: {email.subject}</div>
              </div>
            )}
          </div>

          {/* Date & Star */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-muted-foreground">{email.date}</span>
            <button 
              onClick={() => setStarred(!starred)}
              className="text-muted-foreground hover:text-yellow-500"
            >
              <Star className={`w-5 h-5 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Attachment */}
        {email.hasAttachment && (
          <div className="px-4 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded border border-border text-sm">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
              <span>{email.attachmentName || 'attachment.pdf'}</span>
            </div>
          </div>
        )}

        {/* Email Body */}
        <div className="px-4 py-6 min-h-[200px]">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {formatBody()}
          </div>
        </div>

        {/* Action Buttons (Gmail-style) */}
        {!showResult && (
          <div className="px-4 pb-4 flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleReply}
            >
              <Reply className="w-4 h-4" />
              Reply
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleForward}
            >
              <Forward className="w-4 h-4" />
              Forward
            </Button>
            {emailLink && (
              <Button 
                variant="outline" 
                className="gap-2 text-blue-600 border-blue-600/30 hover:bg-blue-600/10"
                onClick={handleLinkClick}
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </Button>
            )}
            <div className="flex-1" />
            <Button 
              variant="outline" 
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => onAction('report')}
            >
              <AlertTriangle className="w-4 h-4" />
              Mark as Phishing
            </Button>
          </div>
        )}

        {/* Result Section */}
        {showResult && (
          <div className={`p-4 border-t-2 ${userCorrect ? 'border-primary bg-primary/5' : 'border-destructive bg-destructive/5'}`}>
            <div className="flex items-center gap-3 mb-3">
              {userCorrect ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <span className="font-bold">
                {userCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
              <span className={`text-xs uppercase px-2 py-1 rounded ${
                isPhishing 
                  ? 'bg-destructive/10 text-destructive border border-destructive/30' 
                  : 'bg-primary/10 text-primary border border-primary/30'
              }`}>
                This was {isPhishing ? 'PHISHING' : 'LEGITIMATE'}
              </span>
            </div>
            
            {explanation && (
              <p className="text-sm mb-4 text-muted-foreground">{explanation}</p>
            )}
            
            {isPhishing && redFlags && redFlags.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <div className="grid gap-1">
                  {redFlags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-destructive">•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!isPhishing && trustIndicators && trustIndicators.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Trust Indicators
                </h4>
                <div className="grid gap-1">
                  {trustIndicators.map((indicator, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              ⚠️ Oh no! This was a phishing email!
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                You clicked on a malicious link. In a real scenario, this could have:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Stolen your login credentials</li>
                <li>Downloaded malware to your device</li>
                <li>Compromised your personal information</li>
                <li>Given attackers access to your accounts</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Always verify email senders and hover over links before clicking.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="destructive"
              onClick={handleWarningContinue}
            >
              I understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GmailEmailUI;
