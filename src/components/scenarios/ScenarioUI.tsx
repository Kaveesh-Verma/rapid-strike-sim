import { useState } from "react";
import { Mail, MessageSquare, Globe, Users, Phone, QrCode, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { Scenario } from "@/lib/scenarioGenerator";
import { Button } from "@/components/ui/button";

interface ScenarioUIProps {
  scenario: Scenario;
  onAnswer: (answer: 'phishing' | 'legitimate') => void;
  showResult?: boolean;
  userCorrect?: boolean;
}

const ScenarioUI = ({ scenario, onAnswer, showResult, userCorrect }: ScenarioUIProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = () => {
    switch (scenario.type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'sms': return <MessageSquare className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      case 'social': return <Users className="w-5 h-5" />;
      case 'voice': return <Phone className="w-5 h-5" />;
      case 'qrcode': return <QrCode className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (scenario.type) {
      case 'email': return 'Email';
      case 'sms': return 'SMS Message';
      case 'website': return 'Website';
      case 'social': return 'Social Media';
      case 'voice': return 'Voice Call';
      case 'qrcode': return 'QR Code';
    }
  };

  const renderContent = () => {
    const { content } = scenario;
    
    switch (scenario.type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 border-b border-border space-y-2 text-sm">
              <div className="flex"><span className="w-20 text-muted-foreground">From:</span><span className="font-medium">{content.from}</span></div>
              <div className="flex"><span className="w-20 text-muted-foreground">To:</span><span>{content.to}</span></div>
              <div className="flex"><span className="w-20 text-muted-foreground">Date:</span><span>{content.date}</span></div>
              <div className="flex"><span className="w-20 text-muted-foreground">Subject:</span><span className="font-bold">{content.subject}</span></div>
            </div>
            <div className="p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{content.body}</pre>
            </div>
          </div>
        );
        
      case 'sms':
        return (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
              <MessageSquare className="w-4 h-4" />
              From: {content.sender}
            </div>
            <div className="bg-muted p-4 rounded-lg max-w-md">
              <p className="text-sm">{content.message}</p>
            </div>
          </div>
        );
        
      case 'website':
        return (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 bg-muted p-2 rounded border border-border">
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <span className="text-xs font-mono flex-1 overflow-hidden text-ellipsis">{content.url}</span>
            </div>
            <div className="border border-border p-4">
              <h3 className="font-bold mb-2">{content.websiteTitle}</h3>
              <p className="text-sm text-muted-foreground">{content.websiteContent}</p>
            </div>
          </div>
        );
        
      case 'social':
        return (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-bold text-sm">{content.username}</div>
                <div className="text-xs text-muted-foreground">{content.platform}</div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded border border-border">
              <p className="text-sm whitespace-pre-wrap">{content.post}</p>
            </div>
          </div>
        );
        
      case 'voice':
        return (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>Incoming call from: <span className="font-mono">{content.callerNumber}</span></span>
            </div>
            <div className="bg-muted p-4 rounded border border-border">
              <div className="text-xs text-muted-foreground mb-2 uppercase">Call Transcript:</div>
              <p className="text-sm italic">{content.transcript}</p>
            </div>
          </div>
        );
        
      case 'qrcode':
        return (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-center p-8 bg-muted border border-border">
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">[QR Code Image]</p>
              </div>
            </div>
            <div className="text-sm">
              <p><strong>Context:</strong> {content.qrContext}</p>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-2 text-xs text-primary flex items-center gap-1 hover:underline"
              >
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showDetails ? 'Hide Destination' : 'Scan to reveal destination'}
              </button>
              {showDetails && (
                <div className="mt-2 p-2 bg-muted border border-border text-xs font-mono">
                  Destination: {content.qrDestination}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="border-2 border-border bg-card">
      {/* Header */}
      <div className="bg-muted p-3 border-b-2 border-border flex items-center gap-3">
        <span className="text-primary">{getTypeIcon()}</span>
        <span className="font-bold uppercase text-sm">{getTypeLabel()}</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 border border-muted-foreground" />
          <div className="w-3 h-3 border border-muted-foreground" />
          <div className="w-3 h-3 border border-destructive bg-destructive/30" />
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Result */}
      {showResult && (
        <div className={`p-4 border-t-2 ${userCorrect ? 'border-primary bg-primary/10' : 'border-destructive bg-destructive/10'}`}>
          <div className="flex items-center gap-3 mb-3">
            {userCorrect ? (
              <CheckCircle className="w-6 h-6 text-primary" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
            <span className="font-bold uppercase">
              {userCorrect ? 'Correct!' : 'Incorrect!'}
            </span>
            <span className={`text-xs uppercase px-2 py-1 border ${
              scenario.correctAnswer === 'phishing' ? 'border-destructive text-destructive' : 'border-primary text-primary'
            }`}>
              This was {scenario.correctAnswer === 'phishing' ? 'PHISHING' : 'LEGITIMATE'}
            </span>
          </div>
          
          <p className="text-sm mb-4">{scenario.explanation}</p>
          
          {scenario.correctAnswer === 'phishing' && scenario.redFlags && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Red Flags
              </h4>
              <div className="grid gap-1">
                {scenario.redFlags.map((flag, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-destructive">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scenario.correctAnswer === 'legitimate' && scenario.trustIndicators && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" /> Trust Indicators
              </h4>
              <div className="grid gap-1">
                {scenario.trustIndicators.map((indicator, i) => (
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

      {/* Action Buttons */}
      {!showResult && (
        <div className="p-4 border-t-2 border-border bg-muted/30">
          <h3 className="font-bold uppercase text-sm mb-3">Is this phishing or legitimate?</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-center py-6 border-2 border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
              onClick={() => onAnswer('phishing')}
            >
              <span className="text-lg mr-2">🚨</span> Report Phishing
            </Button>
            <Button 
              variant="outline" 
              className="justify-center py-6 border-2 border-primary/50 hover:bg-primary/10 hover:border-primary"
              onClick={() => onAnswer('legitimate')}
            >
              <span className="text-lg mr-2">✓</span> Mark Safe
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioUI;
