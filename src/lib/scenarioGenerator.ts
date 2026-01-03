// Advanced Scenario Generator with Zero-Repetition & True Difficulty Separation
// Enterprise-grade cyber attack simulation engine

export type ScenarioType = 'email' | 'sms' | 'website' | 'social' | 'voice' | 'qrcode' | 'ransomware';
export type ScenarioAnswer = 'phishing' | 'legitimate';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Scenario {
  id: string;
  type: ScenarioType;
  difficulty: Difficulty;
  correctAnswer: ScenarioAnswer;
  title: string;
  content: ScenarioContent;
  explanation: string;
  redFlags?: string[];
  trustIndicators?: string[];
  aiAnalysisHints?: AIAnalysisHints;
}

export interface AIAnalysisHints {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  attackVector?: string;
  targetedAssets?: string[];
  realWorldImpact?: string;
}

export interface ScenarioContent {
  // Email fields
  from?: string;
  to?: string;
  subject?: string;
  body?: string;
  date?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  taskAction?: string;
  
  // SMS fields
  sender?: string;
  message?: string;
  
  // Website fields
  url?: string;
  websiteTitle?: string;
  websiteContent?: string;
  brandName?: string;
  hasLoginForm?: boolean;
  
  // Social media fields
  platform?: string;
  username?: string;
  displayName?: string;
  profilePic?: string;
  post?: string;
  verified?: boolean;
  
  // Voice call fields
  callerNumber?: string;
  callerName?: string;
  transcript?: string;
  
  // QR code fields
  qrContext?: string;
  qrDestination?: string;
  location?: string;
  
  // Ransomware fields
  title?: string;
  demandAmount?: string;
  cryptocurrency?: string;
  phoneNumber?: string;
  countdown?: number;
  variant?: 'ransomware' | 'tech_support' | 'fake_alert';
}

// Fisher-Yates shuffle
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateDate = (): string => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 48);
  now.setHours(now.getHours() - hours);
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Dynamic content generators for infinite variety
const dynamicGenerators = {
  domains: {
    legitimate: ['amazon.com', 'google.com', 'microsoft.com', 'apple.com', 'paypal.com', 'chase.com', 'bankofamerica.com', 'wellsfargo.com'],
    phishing: {
      easy: ['amaz0n-verify.com', 'g00gle-security.net', 'paypa1-secure.com', 'micr0soft-login.com', 'app1e-id-verify.com'],
      medium: ['amazon-account-services.com', 'google-docs-share.net', 'microsoft365-portal.com', 'secure-chase-banking.com'],
      hard: ['amazon.com.account-verify.net', 'login.microsoft.com.auth-portal.net', 'secure.paypal.com.verify-id.co']
    }
  },
  senders: {
    corporate: ['IT Support', 'HR Department', 'Security Team', 'Accounts Payable', 'CEO Office', 'Legal Department'],
    personal: ['Mom', 'Dad', 'Best Friend', 'Colleague', 'Former Boss'],
    services: ['Netflix', 'Spotify', 'Amazon Prime', 'Adobe', 'Dropbox', 'Slack', 'Zoom']
  },
  urgencyPhrases: {
    easy: ['URGENT!!!', 'ACT NOW!!!', 'IMMEDIATE ACTION REQUIRED!!!', 'YOUR ACCOUNT WILL BE DELETED!!!'],
    medium: ['Please respond within 24 hours', 'Time-sensitive matter', 'Requires your attention today'],
    hard: ['When you have a moment', 'At your earliest convenience', 'Following up on our discussion']
  },
  contexts: [
    'healthcare', 'banking', 'ecommerce', 'social', 'corporate', 'government', 
    'education', 'travel', 'insurance', 'utilities', 'tech_support', 'crypto'
  ]
};

// =============== EASY PHISHING SCENARIOS ===============
const easyPhishingScenarios: Scenario[] = [
  {
    id: 'easy-phish-1',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Obvious Password Scam',
    content: {
      from: 'security@amaz0n-verify.com',
      to: 'you@company.com',
      subject: '⚠️ PASSWORD EXPIRES IN 2 HOURS!!!',
      body: `URGENT: Your password is about to expire!\n\nClick here immediately to reset: https://amaz0n-verify.com/reset\n\nIf you don't act NOW, your account will be LOCKED FOREVER!\n\nAmazon Security`,
      date: generateDate(),
    },
    explanation: 'Classic phishing with fake domain (amaz0n with zero), excessive urgency, and threatening language.',
    redFlags: ['Fake domain with number substitution (0 for o)', 'Excessive urgency and threats', 'Generic sender', 'Suspicious external link'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Credential Harvesting', targetedAssets: ['Email credentials', 'Personal data'] }
  },
  {
    id: 'easy-phish-2',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Prize Winner Scam',
    content: {
      sender: '+1-555-WINNER',
      message: 'CONGRATS!!! You won $1,000,000!!! Claim your prize NOW: bit.ly/cl4im-pr1ze Reply STOP to opt out',
    },
    explanation: 'Classic prize scam. You cannot win contests you never entered.',
    redFlags: ['Unsolicited prize notification', 'Shortened/suspicious URL', 'Too good to be true', 'Unknown sender'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Advance Fee Fraud', targetedAssets: ['Banking details', 'Personal information'] }
  },
  {
    id: 'easy-phish-3',
    type: 'website',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Fake PayPal Login',
    content: {
      url: 'https://paypa1-secure.com/login',
      websiteTitle: 'PayPal - Log In',
      websiteContent: 'Log in to your PayPal account to verify recent suspicious activity. Enter your email and password below.',
      brandName: 'PayPal',
      hasLoginForm: true,
    },
    explanation: 'Phishing website with lookalike domain (paypa1 with number 1 instead of L).',
    redFlags: ['Fake domain (paypa1 not paypal)', 'Credential harvesting attempt', 'Unsolicited login request'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Credential Theft', targetedAssets: ['PayPal credentials', 'Financial data'] }
  },
  {
    id: 'easy-phish-4',
    type: 'social',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Crypto Giveaway Scam',
    content: {
      platform: 'Twitter/X',
      username: 'EIonMuskOfficial',
      displayName: 'Elon Musk',
      verified: false,
      post: `🎉 I'm giving back to the community! 🎉\n\nSend 0.1 BTC to the address below and receive 1 BTC back INSTANTLY!\n\nOnly for the next 30 minutes! Don't miss out!\n\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`,
    },
    explanation: 'No one gives away free crypto. The username has a capital I instead of lowercase L (EIon not Elon).',
    redFlags: ['Impersonator account (EIon not Elon)', 'Too good to be true', 'Crypto giveaway scam', 'Artificial urgency'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Cryptocurrency Scam', targetedAssets: ['Cryptocurrency', 'Wallet credentials'] }
  },
  {
    id: 'easy-phish-5',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Package Delivery Scam',
    content: {
      from: 'delivery@fedex-tracking-update.com',
      to: 'you@email.com',
      subject: 'FedEx: Delivery Failed - Action Required NOW',
      body: `Your package could not be delivered.\n\nTracking #: 7849201856321\n\nReason: Incomplete address\n\nConfirm your address NOW: https://fedex-tracking-update.com/confirm\n\nIf not confirmed within 24 hours, package will be returned to sender.`,
      date: generateDate(),
    },
    explanation: 'Fake FedEx domain. Real FedEx uses fedex.com only.',
    redFlags: ['Fake domain (not fedex.com)', 'Urgency with 24-hour deadline', 'Generic tracking format', 'Unsolicited delivery notice'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Phishing Link', targetedAssets: ['Personal address', 'Payment details'] }
  },
  {
    id: 'easy-phish-6',
    type: 'qrcode',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Free WiFi QR Code',
    content: {
      qrContext: 'Handwritten flyer at coffee shop: "SCAN FOR FREE PREMIUM WIFI - No password needed! FREE FOREVER!"',
      qrDestination: 'Redirects to a page asking for email and credit card "for verification purposes only"',
      location: 'Coffee Shop',
    },
    explanation: 'Legitimate free WiFi never requires credit card "verification".',
    redFlags: ['Free WiFi should not need credit card', 'Unknown QR code source', 'Handwritten unofficial flyer', 'Data harvesting attempt'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Credential Harvesting via QR', targetedAssets: ['Credit card details', 'Email credentials'] }
  },
  {
    id: 'easy-phish-7',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'IRS Tax Refund Scam',
    content: {
      sender: 'IRS-REFUND',
      message: 'IRS: Your tax refund of $3,847.00 is ready! Claim immediately at irs-refund-claim.com or it will be forfeited. Reply STOP to cancel.',
    },
    explanation: 'The IRS never sends text messages about refunds. They communicate only by mail.',
    redFlags: ['IRS never texts about refunds', 'Fake domain (not irs.gov)', 'Urgency to claim immediately', 'Government impersonation'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Government Impersonation', targetedAssets: ['SSN', 'Banking details', 'Tax information'] }
  },
  {
    id: 'easy-phish-8',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Nigerian Prince Scam',
    content: {
      from: 'prince.abdullah@gmail.com',
      to: 'you@email.com',
      subject: 'URGENT: $15,000,000 Inheritance Waiting For You!!!',
      body: `Dear Beloved Friend,\n\nI am Prince Abdullah of Nigeria. My late father left $15,000,000 USD which I cannot access without your help.\n\nI will give you 40% ($6,000,000) if you help me transfer this money. I only need your bank details and a small processing fee of $500.\n\nPlease respond urgently as time is running out!\n\nYour Friend,\nPrince Abdullah`,
      date: generateDate(),
    },
    explanation: 'Classic 419 advance fee fraud. No legitimate prince contacts strangers for money transfers.',
    redFlags: ['Nigerian prince scheme', 'Unsolicited money offer', 'Request for bank details', 'Advance fee request'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Advance Fee Fraud', targetedAssets: ['Banking details', 'Personal funds'] }
  },
  {
    id: 'easy-phish-9',
    type: 'voice',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'IRS Arrest Threat Call',
    content: {
      callerNumber: '+1-202-555-0147',
      callerName: 'IRS Enforcement',
      transcript: `"This is Officer James Wilson from the Internal Revenue Service. Our records show you owe $4,892 in back taxes. If you don't pay immediately via gift cards, a warrant will be issued for your arrest today. Press 1 to speak with an agent immediately."`,
    },
    explanation: 'The IRS never demands immediate payment via gift cards or threatens arrest over the phone.',
    redFlags: ['IRS never calls demanding immediate payment', 'Gift card payment request', 'Arrest threats', 'Pressure to act immediately'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Vishing (Voice Phishing)', targetedAssets: ['Personal funds', 'Gift card codes'] }
  },
  {
    id: 'easy-phish-10',
    type: 'ransomware',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Obvious Fake Virus Alert',
    content: {
      title: 'YOUR COMPUTER IS INFECTED!!!',
      message: 'CRITICAL WARNING!!! Your computer has 847 viruses!!! Call Microsoft Support NOW at 1-888-555-0199 or your computer will EXPLODE!!!',
      phoneNumber: '1-888-555-0199',
      variant: 'tech_support',
    },
    explanation: 'Microsoft never displays popups demanding you call them. This is a tech support scam.',
    redFlags: ['Microsoft never shows popups like this', 'Fake urgency', 'Request to call unknown number', 'Impossible claims (explode)'],
    aiAnalysisHints: { threatLevel: 'medium', attackVector: 'Tech Support Scam', targetedAssets: ['Remote access', 'Payment details'] }
  },
];

// =============== MEDIUM PHISHING SCENARIOS ===============
const mediumPhishingScenarios: Scenario[] = [
  {
    id: 'med-phish-1',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'CEO Wire Transfer Request',
    content: {
      from: 'john.smith@company-secure.net',
      to: 'you@company.com',
      subject: 'Urgent: Confidential Wire Transfer',
      body: `Hi,\n\nI need you to process a wire transfer of $15,000 immediately. I'm currently in a meeting with investors and can't call.\n\nPlease keep this confidential - it's for a surprise acquisition we're working on.\n\nLet me know once it's done.\n\nJohn Smith\nCEO`,
      date: generateDate(),
    },
    explanation: 'Business Email Compromise (BEC). Executives never request secret wire transfers via email.',
    redFlags: ['Request for secrecy', 'Urgent wire transfer via email', 'External domain pretending to be internal', 'Cannot verify via phone'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Business Email Compromise', targetedAssets: ['Company funds', 'Wire transfer'] }
  },
  {
    id: 'med-phish-2',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Bank Security Alert',
    content: {
      sender: 'CHASE-ALERT',
      message: 'Chase: Unusual activity detected on your account ending 4521. Verify your identity immediately: chase-secure-verify.com or call 1-800-555-0199',
    },
    explanation: 'Fake bank alert with lookalike domain. Real banks use their official domains only.',
    redFlags: ['Lookalike domain (not chase.com)', 'Unknown phone number', 'Urgency tactic', 'SMS sender name can be spoofed'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Smishing', targetedAssets: ['Banking credentials', 'Account access'] }
  },
  {
    id: 'med-phish-3',
    type: 'social',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'LinkedIn Job Offer Scam',
    content: {
      platform: 'LinkedIn',
      username: 'Sarah_HR_Recruiter2024',
      displayName: 'Sarah Johnson - HR Manager',
      verified: false,
      post: `Hi! I noticed your impressive profile and we have an amazing REMOTE position that would be perfect for you!\n\n💰 $150,000+ salary\n🏠 100% Remote\n✨ No experience required!\n\nClick here to apply: linkedin-jobs-apply.net/position/847291\n\nHurry, only 3 spots remaining! 🔥`,
    },
    explanation: 'Fake recruiter with suspicious account name, external link, and unrealistic salary for "no experience".',
    redFlags: ['Too-good-to-be-true salary', 'External link (not linkedin.com)', 'Urgency tactics', 'Generic outreach', 'Suspicious username'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Job Scam', targetedAssets: ['Personal information', 'Resume data', 'Banking details'] }
  },
  {
    id: 'med-phish-4',
    type: 'qrcode',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Parking Meter QR Overlay',
    content: {
      qrContext: 'QR code sticker placed over the official parking meter payment code. The sticker edges are slightly visible.',
      qrDestination: 'parkingpay-city.net (redirects to payment form asking for full credit card details)',
      location: 'City Parking Meter',
    },
    explanation: 'Scammers place fake QR codes over legitimate ones to steal payment information.',
    redFlags: ['QR code looks like a sticker placed over another', 'Destination URL is not the official city website', 'Asks for full credit card details'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'QR Code Overlay Attack', targetedAssets: ['Credit card details', 'Payment information'] }
  },
  {
    id: 'med-phish-5',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Vendor Invoice Banking Change',
    content: {
      from: 'accounts@vendor-company.com',
      to: 'accounts@yourcompany.com',
      subject: 'Updated Banking Details - Invoice #INV-2024-8847',
      body: `Dear Accounts Payable Team,\n\nPlease note that our banking details have changed effective immediately. Kindly update our account information for Invoice #INV-2024-8847 and all future payments:\n\nNew Bank: First National Trust\nAccount Name: Vendor Company Inc.\nAccount: 8472910563\nRouting: 026009593\n\nThank you for your continued partnership.\n\nBest regards,\nAccounts Department\nVendor Company Inc.`,
      date: generateDate(),
    },
    explanation: 'Vendor email compromise. Always verify banking changes via phone using known numbers.',
    redFlags: ['Banking detail change request', 'Should be verified via phone', 'Check if domain matches known vendor exactly', 'No phone verification mentioned'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Vendor Email Compromise', targetedAssets: ['Company funds', 'Payment redirect'] }
  },
  {
    id: 'med-phish-6',
    type: 'voice',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Tech Support Scam Call',
    content: {
      callerNumber: '+1-888-555-0123',
      callerName: 'Microsoft Technical Support',
      transcript: `"Hello, this is Microsoft Technical Support. We've detected suspicious activity on your computer that indicates a serious virus infection. Your personal data, including banking information, is being sent to hackers in Russia. We need remote access to your computer immediately to fix this. Please go to anydesk.com and give me the access code."`,
    },
    explanation: 'Microsoft never makes unsolicited calls about virus infections. This is a tech support scam.',
    redFlags: ['Microsoft doesn\'t call unsolicited', 'Request for remote access', 'Fear tactics about hackers', 'Urgency to act now'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Tech Support Scam', targetedAssets: ['Computer access', 'Banking credentials', 'Personal data'] }
  },
  {
    id: 'med-phish-7',
    type: 'website',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Fake DocuSign Document',
    content: {
      url: 'https://docusign-documents.com/sign/document847291',
      websiteTitle: 'DocuSign - Please Review and Sign',
      websiteContent: 'You have received a document to sign. Please enter your email and password to access the document.',
      brandName: 'DocuSign',
      hasLoginForm: true,
    },
    explanation: 'Fake DocuSign domain. Real DocuSign uses docusign.net or docusign.com.',
    redFlags: ['Fake domain (docusign-documents.com)', 'Asking for password (DocuSign uses email verification)', 'Unsolicited document'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Credential Phishing', targetedAssets: ['Email credentials', 'Business documents'] }
  },
  {
    id: 'med-phish-8',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Fake 2FA Code Request',
    content: {
      sender: 'Google',
      message: 'Your Google verification code is 847291. WARNING: If you did not request this code, someone is trying to access your account. Reply STOP to block the hacker now.',
    },
    explanation: 'Scammer trying to trick you into sharing a 2FA code. Real services never ask you to reply with codes.',
    redFlags: ['Unsolicited 2FA code', 'Asking for reaction to block hacker', 'Real services never ask you to reply STOP', 'Social engineering tactic'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: '2FA Interception', targetedAssets: ['Google account access', '2FA bypass'] }
  },
  {
    id: 'med-phish-9',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'HR Benefits Update',
    content: {
      from: 'hr-benefits@company-portal.net',
      to: 'you@company.com',
      subject: 'Action Required: Update Your Benefits Selection',
      body: `Dear Employee,\n\nOpen enrollment ends in 48 hours. You must update your benefits selection to avoid losing coverage.\n\nClick here to access the benefits portal: https://company-portal.net/benefits\n\nNote: If you do not complete this by Friday, you will be automatically enrolled in the minimum coverage plan.\n\nHuman Resources`,
      date: generateDate(),
    },
    explanation: 'Fake HR email from external domain impersonating internal HR.',
    redFlags: ['External domain (not company.com)', 'Urgency with deadline', 'Threat of losing benefits', 'Generic signature'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Internal Impersonation', targetedAssets: ['Employee credentials', 'Personal/financial data'] }
  },
  {
    id: 'med-phish-10',
    type: 'ransomware',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Fake Windows Security Alert',
    content: {
      title: 'Windows Defender Security Center',
      message: 'CRITICAL: Your computer has been compromised. Trojan_Spyware detected. Your banking credentials and personal photos are at risk. Do NOT close this window. Call Microsoft certified technicians immediately.',
      phoneNumber: '1-855-555-0147',
      variant: 'tech_support',
    },
    explanation: 'Windows Defender never displays browser popups asking you to call a phone number.',
    redFlags: ['Windows Defender doesn\'t show browser popups', 'Request to call unknown number', 'Fear tactics', 'Preventing window close'],
    aiAnalysisHints: { threatLevel: 'medium', attackVector: 'Tech Support Scam', targetedAssets: ['Remote access', 'Payment details'] }
  },
];

// =============== HARD PHISHING SCENARIOS ===============
const hardPhishingScenarios: Scenario[] = [
  {
    id: 'hard-phish-1',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Sophisticated Spear Phishing',
    content: {
      from: 'michael.chen@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Re: Q4 Budget Review - Updated Projections',
      body: `Hi,\n\nFollowing up on yesterday's meeting with the finance team. I've updated the Q4 projections based on Sarah's feedback.\n\nPlease review the attached spreadsheet and let me know your thoughts before tomorrow's leadership sync.\n\nAlso, I noticed some discrepancies in the vendor payments. Can you verify your credentials on our new finance portal? The IT team migrated it last week: https://finance.yourcompany.com.portal-secure.net/verify\n\nThanks,\nMichael\n\nMichael Chen | Senior Financial Analyst\nYourCompany Inc. | Finance Department`,
      date: generateDate(),
      hasAttachment: true,
      attachmentName: 'Q4_Budget_Projections_v3.xlsx',
    },
    explanation: 'Sophisticated spear phishing using context from real company activities. The link domain is actually portal-secure.net.',
    redFlags: ['Subdomain spoofing (domain is portal-secure.net)', 'Request for credential verification', 'Urgency before meeting', 'Attachment could be malicious'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Spear Phishing with Subdomain Spoofing', targetedAssets: ['Corporate credentials', 'Financial systems access'] }
  },
  {
    id: 'hard-phish-2',
    type: 'website',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Microsoft 365 OAuth Phishing',
    content: {
      url: 'https://login.microsoft.com.auth-verify.net/oauth/authorize',
      websiteTitle: 'Sign in - Microsoft 365',
      websiteContent: 'Sign in with your organizational account to access the shared SharePoint documents.',
      brandName: 'Microsoft',
      hasLoginForm: true,
    },
    explanation: 'Subdomain spoofing attack. The actual domain is auth-verify.net, not microsoft.com. Microsoft.com is used as a subdomain to deceive.',
    redFlags: ['Domain is auth-verify.net (subdomain spoofing)', 'microsoft.com used as subdomain', 'Often linked from phishing emails', 'Perfect visual clone'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'OAuth Phishing with Subdomain Spoofing', targetedAssets: ['Microsoft 365 credentials', 'Corporate email access', 'SharePoint data'] }
  },
  {
    id: 'hard-phish-3',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Supply Chain Attack Email',
    content: {
      from: 'security@github.com',
      to: 'developer@yourcompany.com',
      subject: 'Security Advisory: Dependency Vulnerability in your repository',
      body: `Dear Developer,\n\nGitHub Security has detected a critical vulnerability (CVE-2024-8847) in a dependency used by your repository "yourcompany/backend-api".\n\nThis vulnerability allows remote code execution and requires immediate patching.\n\nReview and apply the security patch: https://github.com.security-advisories.dev/patch/CVE-2024-8847\n\nIf you believe this is a false positive, you can dismiss the alert in your security settings.\n\nGitHub Security Team`,
      date: generateDate(),
    },
    explanation: 'Supply chain attack disguised as GitHub security advisory. Domain is security-advisories.dev, not github.com.',
    redFlags: ['Domain is security-advisories.dev (not github.com)', 'Creates urgency around security', 'Targets developers specifically', 'Could lead to malicious code execution'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Supply Chain Phishing', targetedAssets: ['Developer credentials', 'Source code access', 'CI/CD pipeline'] }
  },
  {
    id: 'hard-phish-4',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Law Firm Legal Notice',
    content: {
      from: 'partner@smithjones-legal.com',
      to: 'you@company.com',
      subject: 'Confidential: Legal Matter Requiring Immediate Attention',
      body: `Dear Sir/Madam,\n\nWe represent a client in a matter involving your organization. Our client has authorized us to reach out regarding a confidential settlement opportunity.\n\nDue to the sensitive nature of this matter, we are unable to disclose details via email. Please schedule a call with our office at your earliest convenience.\n\nAlternatively, review the preliminary documents here: https://smithjones-legal.com/matters/confidential-847291\n\nThis matter requires a response within 5 business days.\n\nRespectfully,\nJames Morrison\nPartner | Smith & Jones LLP\n+1 (212) 555-0184`,
      date: generateDate(),
    },
    explanation: 'Fake legal threat designed to create fear and urgency. Law firms typically send formal letters, not emails.',
    redFlags: ['Vague legal threat', 'Pressure to respond quickly', 'Unknown law firm', 'No specific case details', 'Initial contact via email suspicious'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Authority Impersonation', targetedAssets: ['Business information', 'Executive contacts', 'Settlement payments'] }
  },
  {
    id: 'hard-phish-5',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Legitimate-Looking Bank Alert',
    content: {
      sender: '73748',
      message: 'Chase Fraud Alert: A $847.21 purchase was attempted at BEST BUY in Miami, FL. If you did not authorize this, reply YES to block and verify.',
    },
    explanation: 'Sophisticated smishing that mimics real Chase alerts but asks you to reply, which initiates the scam.',
    redFlags: ['Real Chase alerts don\'t ask you to reply YES', 'Replying initiates social engineering', 'Short code can be spoofed', 'Should call official number instead'],
    aiAnalysisHints: { threatLevel: 'high', attackVector: 'Sophisticated Smishing', targetedAssets: ['Banking credentials', 'Account verification codes'] }
  },
  {
    id: 'hard-phish-6',
    type: 'voice',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'AI Voice Clone Scam',
    content: {
      callerNumber: '+1-555-847-2910',
      callerName: 'Your Boss (Maybe)',
      transcript: `"Hey, it's [Boss Name]. I'm in a meeting with investors and my phone died. I'm borrowing someone's phone. Look, I need you to do me a quick favor - can you purchase some Apple gift cards for client appreciation gifts? I'll reimburse you when I'm back. Just text the codes to this number. It's urgent, we need them before the meeting ends in 30 minutes."`,
    },
    explanation: 'AI voice clone or impersonation scam. Bosses never ask employees to buy gift cards.',
    redFlags: ['Gift card request', 'Urgency', 'Unusual phone number', 'Request to text codes', 'Cannot verify identity'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'AI Voice Impersonation', targetedAssets: ['Personal funds', 'Gift card codes'] }
  },
  {
    id: 'hard-phish-7',
    type: 'social',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Verified Account Compromise',
    content: {
      platform: 'LinkedIn',
      username: 'JohnDoe_TechRecruiter',
      displayName: 'John Doe - Tech Recruiter @ Google',
      verified: true,
      post: `Exciting opportunity at Google! 🚀\n\nWe're looking for talented engineers for a new stealth project. Competitive salary + equity.\n\nDue to the confidential nature, please apply through our secure portal:\nhttps://careers.google.com.apply-portal.io/stealth-project\n\nDM me for details!`,
    },
    explanation: 'Compromised verified account posting phishing links. Domain is apply-portal.io, not google.com.',
    redFlags: ['Subdomain spoofing on external domain', 'Stealth/secret project urgency', 'DM for details unusual for official recruiting', 'Verified accounts can be compromised'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Account Takeover + Phishing', targetedAssets: ['Resume data', 'Personal information', 'Google credentials'] }
  },
  {
    id: 'hard-phish-8',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Board Meeting Invite',
    content: {
      from: 'board-secretary@yourcompany.com',
      to: 'executive@yourcompany.com',
      subject: 'Confidential: Emergency Board Meeting - Please Confirm Attendance',
      body: `Dear Board Member,\n\nAn emergency board meeting has been scheduled for tomorrow at 3:00 PM EST regarding a potential acquisition opportunity.\n\nDue to the confidential nature of this matter, please access the meeting materials through our secure board portal:\n\nhttps://board.yourcompany.com.secure-meeting.net/materials\n\nPlease confirm your attendance by EOD.\n\nBest regards,\nExecutive Assistant to the Board`,
      date: generateDate(),
      hasAttachment: true,
      attachmentName: 'Board_Meeting_Agenda_CONFIDENTIAL.pdf',
    },
    explanation: 'Whaling attack targeting executives. Domain is secure-meeting.net with subdomain spoofing.',
    redFlags: ['Subdomain spoofing', 'Targets executives specifically', 'Emergency meeting creates urgency', 'Attachment could be malicious'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Whaling (Executive Phishing)', targetedAssets: ['Executive credentials', 'Board materials', 'M&A information'] }
  },
  {
    id: 'hard-phish-9',
    type: 'website',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'SSO Portal Clone',
    content: {
      url: 'https://sso.okta.com.enterprise-auth.net/login',
      websiteTitle: 'Okta - Single Sign-On',
      websiteContent: 'Sign in with your corporate credentials to access enterprise applications.',
      brandName: 'Okta',
      hasLoginForm: true,
    },
    explanation: 'SSO phishing targeting enterprise credentials. Domain is enterprise-auth.net, not okta.com.',
    redFlags: ['Domain is enterprise-auth.net', 'okta.com is subdomain', 'Perfect visual clone', 'Would capture corporate SSO credentials'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'SSO Credential Phishing', targetedAssets: ['Corporate SSO credentials', 'Access to all enterprise apps'] }
  },
  {
    id: 'hard-phish-10',
    type: 'ransomware',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Corporate Ransomware',
    content: {
      title: 'YOUR NETWORK HAS BEEN COMPROMISED',
      message: 'All files on this network have been encrypted with AES-256 encryption. We have also exfiltrated 847GB of sensitive data including customer records, financial documents, and employee information. Pay 5 BTC within 72 hours or data will be published on our leak site.',
      demandAmount: '5 BTC (~$250,000)',
      countdown: 259200,
      variant: 'ransomware',
    },
    explanation: 'Double extortion ransomware threatening data leak. Never pay ransom - report to IT security immediately.',
    redFlags: ['Ransomware attack', 'Double extortion threat', 'Cryptocurrency payment demand', 'Data leak threat'],
    aiAnalysisHints: { threatLevel: 'critical', attackVector: 'Double Extortion Ransomware', targetedAssets: ['All network data', 'Customer records', 'Business continuity'] }
  },
];

// =============== EASY LEGITIMATE SCENARIOS ===============
const easyLegitimateScenarios: Scenario[] = [
  {
    id: 'easy-legit-1',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Amazon Order Confirmation',
    content: {
      from: 'auto-confirm@amazon.com',
      to: 'you@email.com',
      subject: 'Your Amazon.com order #112-4847291-8472910',
      body: `Hello,\n\nThank you for your order!\n\nOrder #112-4847291-8472910\nItem: Wireless Mouse\nTotal: $24.99\n\nTrack your package at amazon.com/orders\n\nThank you for shopping with us.\n\nAmazon.com`,
      date: generateDate(),
      taskAction: 'Track Order',
    },
    explanation: 'Legitimate Amazon email from official domain confirming a real order.',
    trustIndicators: ['Official amazon.com domain', 'Specific order details', 'Links to amazon.com', 'No urgency or threats'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-2',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Doctor Appointment Reminder',
    content: {
      sender: '74839 (HealthCare)',
      message: 'Reminder: You have an appointment with Dr. Smith tomorrow at 10:30 AM at Main Street Clinic. Reply C to confirm or call 555-123-4567 to reschedule.',
    },
    explanation: 'Legitimate appointment reminder from healthcare provider you have a relationship with.',
    trustIndicators: ['Expected reminder for existing appointment', 'Specific doctor name and location', 'Office phone number provided', 'No links or urgent demands'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-3',
    type: 'website',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Google Search Page',
    content: {
      url: 'https://www.google.com/search?q=cybersecurity+training',
      websiteTitle: 'cybersecurity training - Google Search',
      websiteContent: 'Standard Google search results page showing various cybersecurity training resources.',
      brandName: 'Google',
      hasLoginForm: false,
    },
    explanation: 'Official Google website performing a search you initiated.',
    trustIndicators: ['Official google.com domain', 'Standard search results', 'HTTPS secure connection', 'You initiated the search'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-4',
    type: 'qrcode',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Restaurant Menu QR',
    content: {
      qrContext: 'QR code printed on a professional table tent at an Italian restaurant with their logo and "Scan for Menu" text.',
      qrDestination: 'Opens the restaurant\'s official website menu page',
      location: 'Restaurant Table',
    },
    explanation: 'Legitimate QR code at a restaurant for viewing their digital menu.',
    trustIndicators: ['Professionally printed with restaurant branding', 'Goes to official restaurant website', 'Standard practice at restaurants', 'No personal info required'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-5',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Newsletter Subscription',
    content: {
      from: 'newsletter@techcrunch.com',
      to: 'you@email.com',
      subject: 'TechCrunch Daily: Today\'s Top Stories',
      body: `Good morning!\n\nHere are today's top tech stories:\n\n1. Apple announces new product lineup\n2. AI startup raises $50M in funding\n3. New cybersecurity regulations proposed\n\nRead more at techcrunch.com\n\nUnsubscribe: techcrunch.com/unsubscribe`,
      date: generateDate(),
    },
    explanation: 'Newsletter from a publication you subscribed to with easy unsubscribe option.',
    trustIndicators: ['You subscribed to this newsletter', 'Official techcrunch.com domain', 'Clear unsubscribe option', 'Expected content type'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-6',
    type: 'social',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Friend\'s Vacation Post',
    content: {
      platform: 'Facebook',
      username: 'JohnSmith_YourFriend',
      displayName: 'John Smith',
      verified: false,
      post: `Just got back from an amazing vacation in Hawaii! 🌴🌺 The sunsets were incredible. Already planning the next trip! #vacation #hawaii #travel`,
    },
    explanation: 'Normal social media post from a friend sharing their vacation photos.',
    trustIndicators: ['Known friend\'s account', 'Personal content matching their life', 'No links or requests', 'Normal social media behavior'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-7',
    type: 'voice',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Pharmacy Prescription Ready',
    content: {
      callerNumber: '+1-555-456-7890',
      callerName: 'CVS Pharmacy',
      transcript: `"This is CVS Pharmacy calling for [Your Name]. Your prescription is ready for pickup at our Main Street location. The pharmacy closes at 9 PM today. If you have questions, please call us at 555-456-7890. Thank you."`,
    },
    explanation: 'Legitimate pharmacy call from location where you have prescriptions.',
    trustIndicators: ['Expected call (you have a prescription)', 'Specific pharmacy location', 'Call-back number provided', 'No urgent demands or threats'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-8',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Package Delivery Update',
    content: {
      sender: 'USPS',
      message: 'USPS: Your package is out for delivery today. Expected by 5:00 PM. Track at usps.com with #9400111899223847291847',
    },
    explanation: 'Legitimate USPS delivery notification with official tracking number format.',
    trustIndicators: ['Official USPS short code', 'Links to usps.com (official)', 'Standard tracking number format', 'You were expecting a package'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-9',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Spotify Receipt',
    content: {
      from: 'no-reply@spotify.com',
      to: 'you@email.com',
      subject: 'Your Spotify Premium receipt',
      body: `Hi there,\n\nThanks for your payment!\n\nSpotify Premium - $10.99/month\nDate: ${new Date().toLocaleDateString()}\n\nManage your subscription at spotify.com/account\n\nEnjoy the music!\nThe Spotify Team`,
      date: generateDate(),
    },
    explanation: 'Legitimate Spotify payment receipt for your active subscription.',
    trustIndicators: ['Official spotify.com domain', 'Expected monthly charge', 'Links to official site', 'Matches your subscription'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'easy-legit-10',
    type: 'website',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Official Bank Website',
    content: {
      url: 'https://www.chase.com/personal/banking',
      websiteTitle: 'Personal Banking | Chase',
      websiteContent: 'Access your accounts, pay bills, and manage your finances with Chase Online Banking.',
      brandName: 'Chase',
      hasLoginForm: true,
    },
    explanation: 'Official Chase website with correct domain and HTTPS.',
    trustIndicators: ['Official chase.com domain', 'HTTPS secure connection', 'Standard banking features', 'No typos in URL'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
];

// =============== MEDIUM LEGITIMATE SCENARIOS ===============
const mediumLegitimateScenarios: Scenario[] = [
  {
    id: 'med-legit-1',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'IT Password Expiration Notice',
    content: {
      from: 'it-helpdesk@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Password expiration reminder - 14 days remaining',
      body: `Hi,\n\nYour network password will expire in 14 days. Please visit the internal IT portal at https://it.yourcompany.com/password to reset it when convenient.\n\nIf you have questions, contact the Help Desk at ext. 4357 or visit us in Room 215.\n\nThank you,\nIT Department`,
      date: generateDate(),
      taskAction: 'Reset Password',
    },
    explanation: 'Legitimate IT email from your company domain with reasonable timeline and internal portal link.',
    trustIndicators: ['Sent from company domain', 'Links to internal portal', 'Reasonable 14-day timeline', 'Contact info provided', 'No urgent threats'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-2',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Bank Transaction Alert',
    content: {
      sender: '73748 (Chase)',
      message: 'Chase: A $42.50 purchase was made at STARBUCKS on card ending 1234 on 12/15. If you don\'t recognize this, call 1-800-935-9935.',
    },
    explanation: 'Legitimate bank alert from official short code with the real Chase fraud number.',
    trustIndicators: ['Official Chase short code 73748', 'Specific transaction details', 'Official Chase phone number', 'No links to click', 'Matches your recent purchase'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-3',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Zoom Meeting Invitation',
    content: {
      from: 'no-reply@zoom.us',
      to: 'you@company.com',
      subject: 'Sarah Johnson invited you to a Zoom meeting',
      body: `Hi,\n\nSarah Johnson is inviting you to a scheduled Zoom meeting.\n\nTopic: Q4 Planning Session\nTime: Tomorrow at 2:00 PM EST\n\nJoin Zoom Meeting:\nhttps://zoom.us/j/84729105632\n\nMeeting ID: 847 2910 5632\nPasscode: 482910`,
      date: generateDate(),
      taskAction: 'Join Meeting',
    },
    explanation: 'Legitimate Zoom invite from official domain with proper meeting details.',
    trustIndicators: ['Official zoom.us domain', 'Specific meeting details', 'Known colleague name', 'Standard Zoom invitation format'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-4',
    type: 'social',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Verified Company Announcement',
    content: {
      platform: 'LinkedIn',
      username: 'Microsoft',
      displayName: 'Microsoft',
      verified: true,
      post: `We're excited to announce the general availability of Microsoft 365 Copilot! 🚀\n\nLearn more about AI-powered productivity at microsoft.com/copilot\n\n#Microsoft365 #AI #Productivity`,
    },
    explanation: 'Verified company account posting about their own product with official link.',
    trustIndicators: ['Verified company account', 'Links to official microsoft.com domain', 'Announcement matches public news', 'No personal info requests'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-5',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Colleague File Share',
    content: {
      from: 'mike.johnson@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Shared: Q4 Budget Spreadsheet',
      body: `Hi,\n\nI've shared the Q4 budget spreadsheet we discussed in yesterday's meeting.\n\nAccess it here: https://yourcompany.sharepoint.com/sites/finance/q4-budget\n\nLet me know if you have questions or need any changes.\n\nThanks,\nMike`,
      date: generateDate(),
      taskAction: 'View Document',
    },
    explanation: 'Legitimate file share from known colleague through company SharePoint.',
    trustIndicators: ['From known colleague', 'Company email domain', 'References recent meeting context', 'Internal SharePoint link'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-6',
    type: 'voice',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Bank Fraud Prevention Call',
    content: {
      callerNumber: '+1-800-935-9935',
      callerName: 'Chase Fraud Prevention',
      transcript: `"Hello, this is Chase Bank fraud prevention. We detected an unusual transaction on your account and wanted to verify it was you. A $847 purchase was made at Best Buy in Miami, FL. Can you confirm if you made this purchase? If not, we will block the card immediately."`,
    },
    explanation: 'Legitimate fraud prevention call from official Chase number you can verify.',
    trustIndicators: ['Official Chase fraud number (verifiable)', 'Asking to confirm, not demanding info', 'Specific transaction details', 'Offering to protect your account'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-7',
    type: 'qrcode',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Conference Badge QR',
    content: {
      qrContext: 'QR code on your conference badge at a tech conference. Sign says "Scan badge to network with other attendees".',
      qrDestination: 'Opens the official conference app with your attendee profile',
      location: 'Tech Conference',
    },
    explanation: 'Legitimate conference networking QR code on your official badge.',
    trustIndicators: ['Official conference badge you received at registration', 'Links to conference app', 'Standard networking feature', 'You registered for this conference'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-8',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Software License Renewal',
    content: {
      from: 'renewals@adobe.com',
      to: 'you@company.com',
      subject: 'Your Adobe Creative Cloud subscription renews soon',
      body: `Hello,\n\nYour Adobe Creative Cloud subscription will automatically renew on January 15, 2025.\n\nPlan: Creative Cloud All Apps\nPrice: $599.88/year\n\nNo action needed if you want to continue. To manage your subscription, visit account.adobe.com\n\nThank you for being an Adobe customer.\n\nAdobe`,
      date: generateDate(),
    },
    explanation: 'Legitimate subscription renewal notice from Adobe for your active license.',
    trustIndicators: ['Official adobe.com domain', 'Matches your subscription', 'No urgent action required', 'Links to official account portal'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-9',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: '2FA Verification Code',
    content: {
      sender: 'Google',
      message: 'G-847291 is your Google verification code.',
    },
    explanation: 'Legitimate 2FA code you requested while logging into your Google account.',
    trustIndicators: ['You just tried to log in', 'Standard Google code format (G-XXXXXX)', 'No links or requests', 'Short and simple'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'med-legit-10',
    type: 'website',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'GitHub Login Page',
    content: {
      url: 'https://github.com/login',
      websiteTitle: 'Sign in to GitHub',
      websiteContent: 'Sign in to GitHub to access your repositories, contribute to projects, and manage your account.',
      brandName: 'GitHub',
      hasLoginForm: true,
    },
    explanation: 'Official GitHub login page with correct domain.',
    trustIndicators: ['Official github.com domain', 'HTTPS secure connection', 'Standard login page', 'You navigated here directly'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
];

// =============== HARD LEGITIMATE SCENARIOS ===============
const hardLegitimateScenarios: Scenario[] = [
  {
    id: 'hard-legit-1',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'GitHub Password Reset',
    content: {
      from: 'noreply@github.com',
      to: 'you@email.com',
      subject: 'Reset your GitHub password',
      body: `Hey there!\n\nWe heard you need a password reset. Click the button below to reset it:\n\nhttps://github.com/password_reset/abcd1234efgh5678...\n\nThis link will expire in 24 hours.\n\nIf you didn't request this, you can safely ignore this email.\n\nThanks,\nThe GitHub Team`,
      date: generateDate(),
      taskAction: 'Reset Password',
    },
    explanation: 'Legitimate password reset email that YOU initiated from official GitHub domain.',
    trustIndicators: ['You just requested this reset', 'Official github.com domain', 'Standard reset format', 'Option to ignore if not requested', 'Reasonable expiration time'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-2',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Security Alert - New Device Login',
    content: {
      from: 'no-reply@accounts.google.com',
      to: 'you@email.com',
      subject: 'Security alert: New sign-in on Windows',
      body: `Hi,\n\nYour Google Account was just signed in to from a new Windows device.\n\nNew sign-in\nDevice: Windows Computer\nLocation: New York, United States (approximate based on IP)\nTime: Today at 3:45 PM EST\n\nIf this was you, you can ignore this email.\n\nIf this wasn't you, your account may be compromised. Please secure your account: https://myaccount.google.com/security\n\nGoogle Accounts Team`,
      date: generateDate(),
    },
    explanation: 'Legitimate security alert from Google about your new device login.',
    trustIndicators: ['Official accounts.google.com domain', 'You just signed in from this device', 'Specific device and location details', 'Links to official Google account page', 'Gives option if it was you'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-3',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Airline Flight Update',
    content: {
      sender: 'DELTA',
      message: 'Delta: Flight DL847 to LAX on 12/20 gate changed to B42. Boarding 2:15PM. Reply HELP for assistance or STOP to opt out.',
    },
    explanation: 'Legitimate flight update for a trip you booked.',
    trustIndicators: ['You booked this flight', 'Specific flight details match your booking', 'Standard airline notification', 'HELP/STOP options provided'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-4',
    type: 'voice',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Doctor Office Callback',
    content: {
      callerNumber: '+1-555-123-4567',
      callerName: 'Dr. Johnson\'s Office',
      transcript: `"Hi, this is Sarah from Dr. Johnson's office returning your call about scheduling a follow-up appointment. We have availability next Thursday at 2 PM or Friday at 10 AM. Please call us back at 555-123-4567 to confirm. Thank you."`,
    },
    explanation: 'Legitimate callback from your doctor\'s office responding to your earlier call.',
    trustIndicators: ['You called them earlier today', 'Specific doctor name you see', 'Offering appointment times', 'Asking you to call back (not demanding info)'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-5',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Vendor Contract Renewal',
    content: {
      from: 'contracts@salesforce.com',
      to: 'procurement@yourcompany.com',
      subject: 'Your Salesforce Enterprise Agreement - Renewal Discussion',
      body: `Dear Valued Customer,\n\nYour Salesforce Enterprise Agreement is coming up for renewal on March 15, 2025.\n\nYour current agreement:\n- Salesforce Enterprise Edition\n- 250 User Licenses\n- Current ARR: $175,000\n\nYour Account Executive, Jennifer Martinez, would like to schedule a call to discuss renewal options and any changes to your needs.\n\nBook a meeting: https://calendly.com/jmartinez-salesforce\nOr reply to this email.\n\nThank you for your partnership.\n\nSalesforce`,
      date: generateDate(),
    },
    explanation: 'Legitimate contract renewal from your existing vendor Salesforce.',
    trustIndicators: ['Official salesforce.com domain', 'Account Executive name you know', 'Accurate contract details', 'Reasonable timeline for renewal', 'Multiple contact options'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-6',
    type: 'social',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Professional Connection Request',
    content: {
      platform: 'LinkedIn',
      username: 'JenniferChen_ProductLead',
      displayName: 'Jennifer Chen - Product Lead @ Stripe',
      verified: false,
      post: `Hi! We met at the TechCrunch Disrupt conference last week. Great chatting about API design patterns. Would love to stay connected and continue the conversation. Let me know if you'd like to grab coffee sometime!`,
    },
    explanation: 'Legitimate LinkedIn connection from someone you actually met at a conference.',
    trustIndicators: ['You attended this conference', 'Remember this conversation', 'No suspicious links', 'Professional networking behavior', 'Specific shared context'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-7',
    type: 'website',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Bank Wire Transfer Page',
    content: {
      url: 'https://secure.chase.com/web/oao/wire-transfer',
      websiteTitle: 'Wire Transfer | Chase',
      websiteContent: 'Send a domestic or international wire transfer from your Chase account.',
      brandName: 'Chase',
      hasLoginForm: true,
    },
    explanation: 'Official Chase wire transfer page you navigated to from your banking dashboard.',
    trustIndicators: ['Official secure.chase.com subdomain', 'You logged in and navigated here', 'Standard banking feature', 'Matches expected functionality'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-8',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Board Compensation Package',
    content: {
      from: 'compensation@yourcompany.com',
      to: 'executive@yourcompany.com',
      subject: 'Confidential: 2025 Executive Compensation Package',
      body: `Dear [Executive Name],\n\nAttached please find your 2025 compensation package for board review and approval.\n\nThis includes:\n- Base salary adjustment\n- Bonus structure\n- Equity grants\n- Benefits summary\n\nPlease review and provide feedback by January 15. The compensation committee meets on January 20.\n\nView documents: https://hr.yourcompany.com/compensation/2025\n\nConfidential - Internal Use Only\n\nHR Department`,
      date: generateDate(),
      hasAttachment: true,
      attachmentName: '2025_Executive_Compensation.pdf',
    },
    explanation: 'Legitimate HR communication about annual compensation review.',
    trustIndicators: ['Internal company domain', 'Expected annual process', 'Links to internal HR portal', 'Reasonable timeline', 'Appropriate confidentiality'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-9',
    type: 'qrcode',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Hotel Check-in QR',
    content: {
      qrContext: 'QR code on official hotel email confirmation for mobile check-in at Marriott. Email is from @marriott.com',
      qrDestination: 'Opens Marriott Bonvoy app for digital room key',
      location: 'Hotel Email',
    },
    explanation: 'Legitimate mobile check-in QR from Marriott for your confirmed reservation.',
    trustIndicators: ['Email from official @marriott.com', 'You have a reservation', 'Opens official Marriott app', 'Standard hotel digital key feature'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate' }
  },
  {
    id: 'hard-legit-10',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Suspicious Login - Real Alert',
    content: {
      sender: 'MSFT',
      message: 'Microsoft account security code: 847291. If you didn\'t request this code, someone may be trying to access your account. Change your password at account.microsoft.com',
    },
    explanation: 'Legitimate security alert. You should verify and potentially change password, but this is a real Microsoft security notification.',
    trustIndicators: ['You may have triggered this or it\'s a real attempt', 'Links to official account.microsoft.com', 'Provides security guidance', 'Standard Microsoft format'],
    aiAnalysisHints: { threatLevel: 'low', attackVector: 'None - Legitimate Security Alert' }
  },
];

// Combine scenarios by difficulty
const scenariosByDifficulty = {
  easy: {
    phishing: easyPhishingScenarios,
    legitimate: easyLegitimateScenarios,
  },
  medium: {
    phishing: mediumPhishingScenarios,
    legitimate: mediumLegitimateScenarios,
  },
  hard: {
    phishing: hardPhishingScenarios,
    legitimate: hardLegitimateScenarios,
  },
};

// Session tracking
const SESSION_KEY = 'cyber_scenarios_session';
const STATS_KEY = 'cyber_scenarios_stats';

interface SessionData {
  seenIds: string[];
  lastDifficulty: Difficulty | null;
  lastType: ScenarioType | null;
  lastAnswer: ScenarioAnswer | null;
}

export interface SessionStats {
  correct: number;
  total: number;
  accuracy: number;
}

const getSessionData = (): SessionData => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { seenIds: [], lastDifficulty: null, lastType: null, lastAnswer: null };
};

const updateSessionData = (scenario: Scenario): void => {
  const data = getSessionData();
  if (!data.seenIds.includes(scenario.id)) {
    data.seenIds.push(scenario.id);
  }
  data.lastDifficulty = scenario.difficulty;
  data.lastType = scenario.type;
  data.lastAnswer = scenario.correctAnswer;
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

export const getSessionStats = (): SessionStats => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { correct: 0, total: 0, accuracy: 0 };
};

export const updateSessionStats = (isCorrect: boolean): SessionStats => {
  const current = getSessionStats();
  const newStats = {
    correct: current.correct + (isCorrect ? 1 : 0),
    total: current.total + 1,
    accuracy: 0,
  };
  newStats.accuracy = Math.round((newStats.correct / newStats.total) * 100);
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats;
};

export const resetSessionStats = (): void => {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(SESSION_KEY);
};

export const generateUniqueScenario = (difficultyFilter?: Difficulty): Scenario | null => {
  const session = getSessionData();
  
  // Determine difficulty to use
  const difficulty = difficultyFilter || randomFrom<Difficulty>(['easy', 'medium', 'hard']);
  
  // Get scenarios for this difficulty
  const pool = scenariosByDifficulty[difficulty];
  const allForDifficulty = [...pool.phishing, ...pool.legitimate];
  
  // Filter out seen scenarios
  let available = allForDifficulty.filter(s => !session.seenIds.includes(s.id));
  
  // Anti-repetition: avoid same type and answer as last scenario
  if (available.length > 1 && session.lastType && session.lastAnswer) {
    const varied = available.filter(s => 
      s.type !== session.lastType || s.correctAnswer !== session.lastAnswer
    );
    if (varied.length > 0) {
      available = varied;
    }
  }
  
  // If all scenarios seen for this difficulty, reset just that difficulty
  if (available.length === 0) {
    // Remove all IDs from this difficulty from session
    const idsToRemove = new Set(allForDifficulty.map(s => s.id));
    session.seenIds = session.seenIds.filter(id => !idsToRemove.has(id));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    available = allForDifficulty;
  }
  
  // Balance phishing vs legitimate (roughly 50/50)
  const phishingAvailable = available.filter(s => s.correctAnswer === 'phishing');
  const legitAvailable = available.filter(s => s.correctAnswer === 'legitimate');
  
  let selectedPool = available;
  if (phishingAvailable.length > 0 && legitAvailable.length > 0) {
    // Prefer opposite of last answer for variety
    if (session.lastAnswer === 'phishing' && legitAvailable.length > 0) {
      selectedPool = legitAvailable;
    } else if (session.lastAnswer === 'legitimate' && phishingAvailable.length > 0) {
      selectedPool = phishingAvailable;
    } else {
      selectedPool = Math.random() > 0.5 ? phishingAvailable : legitAvailable;
    }
  }
  
  // Shuffle and pick one
  const shuffled = shuffle(selectedPool);
  const scenario = shuffled[0];
  
  if (scenario) {
    // Add fresh date
    if (scenario.content.date !== undefined) {
      scenario.content.date = generateDate();
    }
    updateSessionData(scenario);
  }
  
  return scenario || null;
};

// Get total scenario count
export const getScenarioCount = (): number => {
  return Object.values(scenariosByDifficulty).reduce((total, pool) => {
    return total + pool.phishing.length + pool.legitimate.length;
  }, 0);
};

export const getPhishingCount = (): number => {
  return Object.values(scenariosByDifficulty).reduce((total, pool) => {
    return total + pool.phishing.length;
  }, 0);
};

export const getLegitCount = (): number => {
  return Object.values(scenariosByDifficulty).reduce((total, pool) => {
    return total + pool.legitimate.length;
  }, 0);
};
