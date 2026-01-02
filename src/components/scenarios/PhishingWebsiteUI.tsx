import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  Lock,
  Globe,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  Star,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WebsiteContent {
  url: string;
  websiteTitle: string;
  websiteContent: string;
  brandName?: string;
  logoColor?: string;
  hasLoginForm?: boolean;
}

interface PhishingWebsiteUIProps {
  website: WebsiteContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'submit_credentials' | 'leave' | 'correct_safe_action') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const PhishingWebsiteUI = ({ 
  website, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: PhishingWebsiteUIProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [credentialsEntered, setCredentialsEntered] = useState(false);

  // Determine brand styling
  const getBrandStyle = () => {
    const brandLower = website.brandName?.toLowerCase() || website.websiteTitle.toLowerCase();
    if (brandLower.includes('paypal')) {
      return { color: 'text-blue-600', bg: 'bg-blue-600', light: 'bg-blue-50' };
    }
    if (brandLower.includes('microsoft') || brandLower.includes('365')) {
      return { color: 'text-blue-500', bg: 'bg-blue-500', light: 'bg-gray-50' };
    }
    if (brandLower.includes('google')) {
      return { color: 'text-blue-500', bg: 'bg-blue-500', light: 'bg-white' };
    }
    if (brandLower.includes('amazon')) {
      return { color: 'text-orange-500', bg: 'bg-orange-500', light: 'bg-gray-100' };
    }
    if (brandLower.includes('netflix')) {
      return { color: 'text-red-600', bg: 'bg-red-600', light: 'bg-black' };
    }
    if (brandLower.includes('chase') || brandLower.includes('bank')) {
      return { color: 'text-blue-800', bg: 'bg-blue-800', light: 'bg-blue-50' };
    }
    return { color: 'text-gray-700', bg: 'bg-gray-700', light: 'bg-gray-50' };
  };

  const brand = getBrandStyle();
  const isSecure = website.url.startsWith('https://');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setCredentialsEntered(true);
      if (isPhishing) {
        setShowWarning(true);
      } else {
        onAction('correct_safe_action');
      }
    }
  };

  const handleWarningContinue = () => {
    setShowWarning(false);
    onAction('submit_credentials');
  };

  const handleLeave = () => {
    if (!isPhishing) {
      // Leaving a legitimate site when you should complete the action
      onAction('leave');
    } else {
      // Correctly leaving a phishing site
      onAction('report');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Browser Chrome */}
        <div className="bg-gray-100 border-b border-gray-200">
          {/* Tab Bar */}
          <div className="flex items-center px-2 pt-2">
            <div className="flex items-center bg-white rounded-t-lg px-4 py-2 border border-b-0 border-gray-200 max-w-xs">
              <Globe className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm truncate text-gray-700">{website.websiteTitle}</span>
              <button className="ml-2 text-gray-400 hover:text-gray-600">×</button>
            </div>
            <button className="ml-1 px-2 py-1 text-gray-400 hover:bg-gray-200 rounded">+</button>
          </div>
          
          {/* Navigation Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <Home className="w-4 h-4" />
              </Button>
            </div>
            
            {/* URL Bar */}
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-1.5 gap-2">
              {isSecure ? (
                <Lock className="w-4 h-4 text-gray-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-mono text-gray-700 truncate flex-1">
                {website.url}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Website Content */}
        <div className={`min-h-[400px] ${brand.light}`}>
          {/* Brand Header */}
          <div className={`py-6 text-center ${brand.light}`}>
            <div className={`text-3xl font-bold ${brand.color} mb-2`}>
              {website.brandName || website.websiteTitle.split(' ')[0]}
            </div>
          </div>

          {/* Login Form */}
          {website.hasLoginForm !== false && (
            <div className="max-w-md mx-auto px-6 pb-8">
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-xl font-normal text-center text-gray-800 mb-6">
                  Sign in
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                  {website.websiteContent}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email or phone"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={showResult}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded pr-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      disabled={showResult}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input type="checkbox" className="rounded" />
                      Remember me
                    </label>
                    <a href="#" className={`${brand.color} hover:underline`}>Forgot password?</a>
                  </div>

                  {!showResult && (
                    <Button 
                      type="submit"
                      className={`w-full ${brand.bg} hover:opacity-90 text-white py-3`}
                    >
                      Sign in
                    </Button>
                  )}
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <span>Don't have an account? </span>
                  <a href="#" className={`${brand.color} hover:underline`}>Sign up</a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-3">What do you do on this website?</p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                className="gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                onClick={handleLeave}
              >
                <ChevronLeft className="w-4 h-4" />
                Leave Site
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onAction('report')}
              >
                <AlertTriangle className="w-4 h-4" />
                Report as Phishing
              </Button>
            </div>
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
                {isPhishing ? 'PHISHING SITE' : 'LEGITIMATE SITE'}
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

      {/* Credential Theft Warning */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span>Your credentials were stolen!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4 text-gray-600">
              <p>You entered your credentials on a phishing website. The attacker now has:</p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 font-mono text-sm">
                <div><span className="text-gray-500">Email:</span> {email}</div>
                <div><span className="text-gray-500">Password:</span> {'•'.repeat(password.length)}</div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>They can access your accounts</li>
                <li>They may try these credentials on other sites</li>
                <li>Your data could be sold on the dark web</li>
              </ul>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Always check the URL carefully before entering credentials.
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

export default PhishingWebsiteUI;