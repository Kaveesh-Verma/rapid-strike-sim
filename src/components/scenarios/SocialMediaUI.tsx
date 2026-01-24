import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  ExternalLink,
  ThumbsUp,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SocialMediaContent {
  platform: string;
  username: string;
  displayName?: string;
  verified?: boolean;
  post: string;
  likes?: number;
  comments?: number;
  shares?: number;
  timestamp?: string;
}

interface SocialMediaUIProps {
  content: SocialMediaContent;
  isPhishing: boolean;
  onAction: (action: 'report' | 'click_link' | 'share' | 'ignore' | 'correct_safe_action') => void;
  showResult?: boolean;
  userCorrect?: boolean;
  explanation?: string;
  redFlags?: string[];
  trustIndicators?: string[];
}

const SocialMediaUI = ({ 
  content, 
  isPhishing,
  onAction, 
  showResult, 
  userCorrect,
  explanation,
  redFlags,
  trustIndicators
}: SocialMediaUIProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showLinkWarning, setShowLinkWarning] = useState(false);

  // Extract link from post
  const extractLink = () => {
    const urlMatch = content.post.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-z]{2,}\/[^\s]*/i);
    return urlMatch ? urlMatch[0] : null;
  };

  const postLink = extractLink();

  const handleLinkClick = () => {
    if (isPhishing) {
      setShowLinkWarning(true);
    } else {
      onAction('correct_safe_action');
    }
  };

  const handleWarningContinue = () => {
    setShowLinkWarning(false);
    onAction('click_link');
  };

  const handleShare = () => {
    if (isPhishing) {
      onAction('share');
    } else {
      onAction('correct_safe_action');
    }
  };

  const handleIgnore = () => {
    if (isPhishing) {
      onAction('report');
    } else {
      onAction('ignore');
    }
  };

  // Format post with clickable links
  const formatPost = () => {
    if (!postLink) return content.post;
    
    const parts = content.post.split(postLink);
    if (parts.length === 1) return content.post;
    
    return (
      <>
        {parts[0]}
        <button 
          onClick={handleLinkClick}
          className="text-blue-500 hover:underline cursor-pointer"
          disabled={showResult}
        >
          {postLink}
        </button>
        {parts.slice(1).join(postLink)}
      </>
    );
  };

  // Get platform-specific styling
  const getPlatformStyle = () => {
    const platform = content.platform.toLowerCase();
    if (platform.includes('twitter') || platform.includes('x')) {
      return { bg: 'bg-black', accent: 'text-blue-400', icon: '𝕏' };
    }
    if (platform.includes('facebook')) {
      return { bg: 'bg-blue-600', accent: 'text-blue-500', icon: 'f' };
    }
    if (platform.includes('linkedin')) {
      return { bg: 'bg-blue-700', accent: 'text-blue-600', icon: 'in' };
    }
    if (platform.includes('instagram')) {
      return { bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500', accent: 'text-pink-500', icon: '📷' };
    }
    return { bg: 'bg-gray-700', accent: 'text-blue-500', icon: '🌐' };
  };

  const platformStyle = getPlatformStyle();
  const likes = content.likes || Math.floor(Math.random() * 5000);
  const comments = content.comments || Math.floor(Math.random() * 200);
  const shares = content.shares || Math.floor(Math.random() * 100);

  // Get avatar background
  const getAvatarBg = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    const hash = content.username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-lg mx-auto">
        {/* Platform Header */}
        <div className={`${platformStyle.bg} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{platformStyle.icon}</span>
            <span className="text-white font-medium">{content.platform}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="p-4">
          {/* Author Info */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${getAvatarBg()} flex items-center justify-center text-white font-bold`}>
              {content.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">
                  {content.displayName || content.username}
                </span>
                {content.verified && (
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>@{content.username.replace('@', '')}</span>
                <span>•</span>
                <span>{content.timestamp || '2h ago'}</span>
              </div>
            </div>
          </div>

          {/* Post Text */}
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {formatPost()}
            </p>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{(likes + (liked ? 1 : 0)).toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.toLocaleString()}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span className="text-sm">{shares.toLocaleString()}</span>
            </button>
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 ml-auto ${bookmarked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500 transition-colors`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {!showResult && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-2">
            <p className="text-xs text-center text-gray-500 mb-3">How do you respond to this post?</p>
            <div className="grid grid-cols-2 gap-2">
              {postLink && (
                <Button 
                  variant="outline" 
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={handleLinkClick}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Link
                </Button>
              )}
              <Button 
                variant="outline" 
                className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleIgnore}
              >
                Scroll Past
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onAction('report')}
            >
              <AlertTriangle className="w-4 h-4" />
              Report as Scam
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
                isPhishing ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {isPhishing ? 'SCAM' : 'LEGITIMATE'}
              </span>
            </div>
            
            {explanation && (
              <p className="text-sm mb-3 text-gray-700">{explanation}</p>
            )}
            
            {isPhishing && redFlags && redFlags.length > 0 && (
              <div className="space-y-2">
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

      {/* Link Warning Dialog */}
      <Dialog open={showLinkWarning} onOpenChange={setShowLinkWarning}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <span>Suspicious Link!</span>
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4 text-gray-600">
              <p>You clicked on a link from a suspicious social media post. This could be:</p>
              <ul className="list-disc list-inside space-y-2 text-sm bg-red-50 p-4 rounded-lg">
                <li>A phishing site stealing your credentials</li>
                <li>A crypto scam asking for money</li>
                <li>Malware download disguised as content</li>
                <li>A fake giveaway collecting personal info</li>
              </ul>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> Be wary of posts with unrealistic promises, urgency, or unknown accounts.
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

export default SocialMediaUI;