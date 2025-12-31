import { useState } from "react";
import { Mail, Paperclip, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { GeneratedEmail } from "@/lib/phishingGenerator";
import { Button } from "@/components/ui/button";

interface PhishingEmailUIProps {
  email: GeneratedEmail;
  onAction: (action: 'report' | 'click' | 'reply' | 'delete') => void;
  showResult?: boolean;
  userCorrect?: boolean;
}

const PhishingEmailUI = ({ email, onAction, showResult, userCorrect }: PhishingEmailUIProps) => {
  const [showHeaders, setShowHeaders] = useState(false);

  return (
    <div className="border-2 border-border bg-card">
      {/* Email Client Header */}
      <div className="bg-muted p-3 border-b-2 border-border flex items-center gap-3">
        <Mail className="w-5 h-5 text-primary" />
        <span className="font-bold uppercase text-sm">Inbox</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 border border-muted-foreground" />
          <div className="w-3 h-3 border border-muted-foreground" />
          <div className="w-3 h-3 border border-destructive bg-destructive/30" />
        </div>
      </div>

      {/* Email Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-20 text-muted-foreground">From:</span>
            <span className="font-medium">{email.from}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-muted-foreground">To:</span>
            <span>{email.to}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-muted-foreground">Date:</span>
            <span>{email.date}</span>
          </div>
          <div className="flex">
            <span className="w-20 text-muted-foreground">Subject:</span>
            <span className="font-bold">{email.subject}</span>
          </div>
          {email.hasAttachment && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-muted border border-border">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{email.attachmentName}</span>
            </div>
          )}
        </div>

        {/* View Headers Toggle */}
        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="mt-3 text-xs text-primary flex items-center gap-1 hover:underline"
        >
          {showHeaders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showHeaders ? 'Hide Headers' : 'View Headers'}
        </button>

        {showHeaders && (
          <div className="mt-2 p-3 bg-background border border-border font-mono text-xs space-y-1 overflow-x-auto">
            <div><span className="text-muted-foreground">Received:</span> {email.headers.received}</div>
            {email.headers.replyTo && <div><span className="text-muted-foreground">Reply-To:</span> {email.headers.replyTo}</div>}
            <div><span className="text-muted-foreground">X-Originating-IP:</span> [{email.headers.xOriginatingIp}]</div>
            <div><span className="text-muted-foreground">Authentication-Results:</span> spf={email.headers.spf}; dkim={email.headers.dkim}</div>
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="p-6">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{email.body}</pre>
      </div>

      {/* Result Overlay */}
      {showResult && (
        <div className={`p-4 border-t-2 ${userCorrect ? 'border-primary bg-primary/10' : 'border-destructive bg-destructive/10'}`}>
          <div className="flex items-center gap-3 mb-3">
            {userCorrect ? (
              <CheckCircle className="w-6 h-6 text-primary" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
            <span className="font-bold uppercase">
              {userCorrect ? 'Correct! This was a phishing email.' : 'Incorrect! This was a phishing email.'}
            </span>
          </div>
          
          <p className="text-sm mb-4">{email.explanation}</p>
          
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Red Flags You Should Spot
            </h4>
            <div className="grid gap-1">
              {email.redFlags.map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-destructive">•</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!showResult && (
        <div className="p-4 border-t-2 border-border bg-muted/30">
          <h3 className="font-bold uppercase text-sm mb-3">What would you do?</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start" onClick={() => onAction('report')}>
              🚨 Report as Phishing
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onAction('click')}>
              🔗 Click the Link
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onAction('reply')}>
              ↩️ Reply to Email
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onAction('delete')}>
              🗑️ Delete Email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingEmailUI;
