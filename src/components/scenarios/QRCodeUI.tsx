import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  QrCode,
  Smartphone,
  ExternalLink,
  Camera,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface QRCodeContent {
  qrContext: string;
  qrDestination: string;
  location?: string;
}

interface QRCodeUIProps {
  qrCode: QRCodeContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'scan' | 'ignore' | 'correct_safe_action') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const QRCodeUI = ({ 
  qrCode, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: QRCodeUIProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setScanned(true);
      if (isPhishing) {
        setTimeout(() => {
          setShowScanner(false);
          setShowWarning(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setShowScanner(false);
          onAction('correct_safe_action');
        }, 1000);
      }
    }, 1500);
  };

  const handleWarningContinue = () => {
    setShowWarning(false);
    onAction('scan');
  };

  const handleIgnore = () => {
    if (isPhishing) {
      onAction('report');
    } else {
      onAction('ignore');
    }
  };

  return (
    <>
      {/* Physical Context Display */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Location Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">QR Code Scenario</h3>
              <p className="text-sm text-gray-500">{qrCode.location || 'Physical Location'}</p>
            </div>
          </div>
        </div>

        {/* Scene Description */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">Scenario</h4>
            <p className="text-gray-800 leading-relaxed">{qrCode.qrContext}</p>
          </div>

          {/* QR Code Visual */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200">
                {/* Simulated QR code pattern */}
                <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                  {[...Array(64)].map((_, i) => {
                    const isCorner = (i < 24 && (i % 8 < 3 || Math.floor(i / 8) < 3)) ||
                                     (i > 39 && i < 64 && i % 8 < 3) ||
                                     (i < 24 && i % 8 > 4);
                    const random = Math.random() > 0.5;
                    return (
                      <div 
                        key={i} 
                        className={`${isCorner || random ? 'bg-gray-900' : 'bg-white'} ${
                          (i === 0 || i === 5 || i === 40) ? 'rounded-sm' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-10 h-10 border-4 border-gray-900 rounded-sm">
                <div className="absolute inset-2 bg-gray-900 rounded-sm" />
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 border-4 border-gray-900 rounded-sm">
                <div className="absolute inset-2 bg-gray-900 rounded-sm" />
              </div>
              <div className="absolute bottom-4 left-4 w-10 h-10 border-4 border-gray-900 rounded-sm">
                <div className="absolute inset-2 bg-gray-900 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Instruction Text */}
          <p className="text-center text-gray-500 text-sm mb-6">
            What would you do in this situation?
          </p>
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
                onClick={handleScan}
              >
                <Camera className="w-5 h-5" />
                Scan QR Code
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-12"
                onClick={handleIgnore}
              >
                <X className="w-5 h-5" />
                Ignore / Skip
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 h-10"
              onClick={() => onAction('report')}
            >
              <AlertTriangle className="w-4 h-4" />
              Report as Suspicious
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
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {isPhishing ? 'MALICIOUS QR' : 'SAFE QR'}
              </span>
            </div>

            <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">QR Destination:</p>
              <p className="text-sm font-mono text-gray-700">{qrCode.qrDestination}</p>
            </div>
            
            {explanation && (
              <p className="text-sm mb-4 text-gray-700">{explanation}</p>
            )}
            
            {isPhishing && redFlags && redFlags.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase font-bold text-gray-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Warning Signs
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

      {/* QR Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-sm bg-black p-0 border-0">
          <div className="relative aspect-square">
            {/* Camera viewfinder simulation */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            
            {/* Scanning frame */}
            <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
              <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-green-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-green-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-green-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-green-400 rounded-br-lg" />
            </div>

            {/* Scanning line animation */}
            {!scanned && (
              <div className="absolute left-8 right-8 h-0.5 bg-green-400 animate-pulse" 
                   style={{ top: '50%', boxShadow: '0 0 10px #22c55e' }} />
            )}

            {/* Status */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              {scanned ? (
                <div className="text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>QR Code Detected!</span>
                </div>
              ) : (
                <p className="text-white/70">Scanning...</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phishing Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span>Malicious QR Code!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4 text-gray-600">
              <p>You scanned a suspicious QR code that leads to:</p>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 font-mono text-sm text-red-700">
                {qrCode.qrDestination}
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>This could steal your payment information</li>
                <li>Malicious sites may download malware</li>
                <li>Fake payment pages capture card details</li>
              </ul>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Always inspect QR codes for tampering and verify the destination URL before entering any information.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleWarningContinue}>
              I understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeUI;