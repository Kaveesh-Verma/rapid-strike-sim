// Scenario Generator with mixed phishing/legitimate scenarios
// 50% phishing, 50% legitimate across various types

export type ScenarioType = 'email' | 'sms' | 'website' | 'social' | 'voice' | 'qrcode';
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
  
  // SMS fields
  sender?: string;
  message?: string;
  
  // Website fields
  url?: string;
  websiteTitle?: string;
  websiteContent?: string;
  
  // Social media fields
  platform?: string;
  username?: string;
  profilePic?: string;
  post?: string;
  
  // Voice call fields
  callerNumber?: string;
  transcript?: string;
  
  // QR code fields
  qrContext?: string;
  qrDestination?: string;
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
  const hours = Math.floor(Math.random() * 24);
  now.setHours(now.getHours() - hours);
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// === PHISHING SCENARIOS (15) ===
const phishingScenarios: Scenario[] = [
  // Email Phishing
  {
    id: 'phish-1',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Password Expiry Notice',
    content: {
      from: 'security@amaz0n-verify.com',
      to: 'you@company.com',
      subject: '⚠️ PASSWORD EXPIRES IN 2 HOURS!!!',
      body: `URGENT: Your password is about to expire!\n\nClick here immediately to reset: https://amaz0n-verify.com/reset\n\nIf you don't act NOW, your account will be LOCKED!\n\nIT Support`,
      date: generateDate(),
    },
    explanation: 'Fake domain (amaz0n-verify.com), excessive urgency, threatening language, and suspicious link.',
    redFlags: ['Fake domain with character substitution', 'Excessive urgency and threats', 'Generic signature', 'Suspicious external link'],
  },
  {
    id: 'phish-2',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'CEO Wire Transfer Request',
    content: {
      from: 'john.smith@company-secure.net',
      to: 'you@company.com',
      subject: 'Urgent: Wire Transfer Needed',
      body: `Hi,\n\nI need you to process a wire transfer of $15,000 immediately. I'm in a meeting and can't call.\n\nDon't tell anyone - it's for a confidential acquisition.\n\nJohn Smith\nCEO`,
      date: generateDate(),
    },
    explanation: 'CEO fraud attempt. Real executives never request secret wire transfers via email.',
    redFlags: ['Request for secrecy', 'Urgent wire transfer via email', 'External domain pretending to be internal', 'Can\'t verify via phone'],
  },
  {
    id: 'phish-3',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Prize Winner SMS',
    content: {
      sender: '+1-555-WINNER',
      message: 'CONGRATS! You won $1,000,000! Claim now: bit.ly/cl4im-pr1ze Reply STOP to opt out',
    },
    explanation: 'Classic prize scam. You can\'t win contests you didn\'t enter.',
    redFlags: ['Unsolicited prize notification', 'Shortened/suspicious URL', 'Too good to be true', 'Unknown sender'],
  },
  {
    id: 'phish-4',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Bank Alert SMS',
    content: {
      sender: 'CHASE-ALERT',
      message: 'Chase: Unusual activity detected on your account ending 4521. Verify immediately: chase-secure-verify.com or call 1-800-555-0199',
    },
    explanation: 'Fake bank alert with lookalike domain. Real banks use their official domains.',
    redFlags: ['Lookalike domain (not chase.com)', 'Unknown phone number', 'Urgency tactic', 'Sender name can be spoofed'],
  },
  {
    id: 'phish-5',
    type: 'website',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Fake PayPal Login',
    content: {
      url: 'https://paypa1-secure.com/login',
      websiteTitle: 'PayPal - Log In',
      websiteContent: 'Log in to your PayPal account to verify recent activity. Enter your email and password below.',
    },
    explanation: 'Phishing website with lookalike domain (paypa1 with number 1 instead of L).',
    redFlags: ['Fake domain (paypa1 not paypal)', 'Asking for credentials', 'No https lock or padlock icon faked', 'Unsolicited login request'],
  },
  {
    id: 'phish-6',
    type: 'social',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Fake LinkedIn Job Offer',
    content: {
      platform: 'LinkedIn',
      username: 'Sarah_HR_Recruiter2024',
      post: `Hi! I noticed your profile and we have a REMOTE position paying $150k+! No experience needed!\n\nClick here to apply: linkedin-jobs-apply.net\n\nHurry, only 3 spots left! 🔥`,
    },
    explanation: 'Fake recruiter with suspicious account name and external link promising unrealistic salary.',
    redFlags: ['Too-good-to-be-true salary', 'External link (not linkedin.com)', 'Urgency tactics', 'Generic outreach', 'Suspicious username pattern'],
  },
  {
    id: 'phish-7',
    type: 'voice',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'IRS Phone Scam',
    content: {
      callerNumber: '+1-202-555-0147',
      transcript: `"This is Officer James Wilson from the Internal Revenue Service. Our records show you owe $4,892 in back taxes. If you don't pay immediately via gift cards, a warrant will be issued for your arrest. Press 1 to speak with an agent."`,
    },
    explanation: 'The IRS never demands immediate payment via gift cards or threatens arrest over the phone.',
    redFlags: ['IRS never calls demanding immediate payment', 'Gift card payment request', 'Arrest threats', 'Pressure to act immediately'],
  },
  {
    id: 'phish-8',
    type: 'qrcode',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Parking Meter QR Code',
    content: {
      qrContext: 'QR code sticker placed over the official parking meter payment code',
      qrDestination: 'parkingpay-city.net (redirects to payment form asking for credit card)',
    },
    explanation: 'Scammers place fake QR codes over legitimate ones to steal payment information.',
    redFlags: ['QR code looks like a sticker placed over another', 'Destination URL is not the official city website', 'Asks for full credit card details'],
  },
  {
    id: 'phish-9',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Vendor Invoice Change',
    content: {
      from: 'accounts@vendor-company.com',
      to: 'accounts@yourcompany.com',
      subject: 'Updated Banking Details - Invoice #INV-2024-8847',
      body: `Dear Accounts Payable,\n\nPlease note our banking details have changed for future payments. Update our account information for Invoice #INV-2024-8847:\n\nNew Bank: First National Trust\nAccount: 8472910563\nRouting: 026009593\n\nThank you for your continued partnership.\n\nAccounts Department\nVendor Company Inc.`,
      date: generateDate(),
    },
    explanation: 'Vendor email compromise - always verify banking changes via phone using known numbers.',
    redFlags: ['Banking detail change request', 'Should be verified via phone', 'Check if domain matches known vendor exactly'],
  },
  {
    id: 'phish-10',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Package Delivery Scam',
    content: {
      from: 'delivery@fedex-tracking-update.com',
      to: 'you@email.com',
      subject: 'FedEx: Delivery Failed - Action Required',
      body: `Your package could not be delivered.\n\nTracking #: 7849201856321\n\nReason: Incomplete address\n\nConfirm your address now: https://fedex-tracking-update.com/confirm\n\nIf not confirmed within 24 hours, package will be returned to sender.`,
      date: generateDate(),
    },
    explanation: 'Fake FedEx domain. Real FedEx uses fedex.com only.',
    redFlags: ['Fake domain (not fedex.com)', 'Urgency with 24-hour deadline', 'Generic tracking format', 'Unsolicited delivery notice'],
  },
  {
    id: 'phish-11',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Two-Factor Code Request',
    content: {
      sender: 'Google',
      message: 'Your Google verification code is 847291. If you did not request this, someone may be trying to access your account. Reply STOP to block them.',
    },
    explanation: 'Scammer trying to get you to share a 2FA code. Never share verification codes.',
    redFlags: ['Asking for reaction to unsolicited 2FA code', 'Real services never ask you to reply with codes', 'Social engineering to "block" attacker'],
  },
  {
    id: 'phish-12',
    type: 'website',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Microsoft 365 Login',
    content: {
      url: 'https://login.microsoft.com.auth-verify.net/oauth',
      websiteTitle: 'Sign in - Microsoft 365',
      websiteContent: 'Sign in with your organizational account to access SharePoint documents shared with you.',
    },
    explanation: 'Subdomain spoofing - the real domain is auth-verify.net, not microsoft.com.',
    redFlags: ['Domain is auth-verify.net, not microsoft.com', 'Microsoft domain used as subdomain', 'Often linked from phishing emails'],
  },
  {
    id: 'phish-13',
    type: 'social',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Crypto Giveaway Scam',
    content: {
      platform: 'Twitter/X',
      username: 'EIonMuskOfficial',
      post: `I'm giving back to the community! 🎉\n\nSend 0.1 BTC to the address below and receive 1 BTC back!\n\nOnly for the next 30 minutes! Don't miss out!\n\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`,
    },
    explanation: 'No one gives away free crypto. The username has a capital I instead of lowercase L.',
    redFlags: ['Impersonator account (EIon not Elon)', 'Too good to be true', 'Crypto giveaway scam', 'Artificial urgency'],
  },
  {
    id: 'phish-14',
    type: 'voice',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'Tech Support Scam Call',
    content: {
      callerNumber: '+1-888-555-0123',
      transcript: `"Hello, this is Microsoft Technical Support. We've detected a virus on your computer that is sending your personal data to hackers. We need remote access to fix this immediately. Please go to anydesk.com and give me the access code."`,
    },
    explanation: 'Microsoft never makes unsolicited calls. This is a tech support scam.',
    redFlags: ['Microsoft doesn\'t call unsolicited', 'Request for remote access', 'Fear tactics about viruses', 'Urgency to act now'],
  },
  {
    id: 'phish-15',
    type: 'qrcode',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Free WiFi QR Code',
    content: {
      qrContext: 'Flyer at coffee shop: "SCAN FOR FREE PREMIUM WIFI - No password needed!"',
      qrDestination: 'Redirects to a page asking for email and credit card "for verification"',
    },
    explanation: 'Legitimate free WiFi doesn\'t require credit card "verification".',
    redFlags: ['Free WiFi shouldn\'t need credit card', 'Unknown QR code source', 'Too convenient offer', 'Data harvesting attempt'],
  },
];

// === LEGITIMATE SCENARIOS (15) ===
const legitimateScenarios: Scenario[] = [
  {
    id: 'legit-1',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'IT Password Reset',
    content: {
      from: 'it-helpdesk@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Password expiration reminder',
      body: `Hi,\n\nYour network password will expire in 14 days. Please visit the internal IT portal at https://it.yourcompany.com/password to reset it.\n\nIf you have questions, contact the Help Desk at ext. 4357.\n\nIT Department`,
      date: generateDate(),
    },
    explanation: 'Legitimate IT email from your company domain with reasonable timeline and internal portal link.',
    trustIndicators: ['Sent from company domain', 'Links to internal portal', 'Reasonable 14-day timeline', 'Contact info provided'],
  },
  {
    id: 'legit-2',
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
    },
    explanation: 'Legitimate Amazon email from official domain confirming a real order.',
    trustIndicators: ['Official amazon.com domain', 'Specific order details', 'Links to amazon.com', 'No urgency or threats'],
  },
  {
    id: 'legit-3',
    type: 'sms',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Bank Transaction Alert',
    content: {
      sender: '73748 (Chase)',
      message: 'Chase: A $42.50 purchase was made at STARBUCKS on card ending 1234. If you don\'t recognize this, call 1-800-935-9935.',
    },
    explanation: 'Legitimate bank alert from official short code with the real Chase fraud number.',
    trustIndicators: ['Official Chase short code', 'Specific transaction details', 'Official Chase phone number', 'No links to click'],
  },
  {
    id: 'legit-4',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Zoom Meeting Invite',
    content: {
      from: 'no-reply@zoom.us',
      to: 'you@company.com',
      subject: 'Sarah Johnson invited you to a Zoom meeting',
      body: `Hi,\n\nSarah Johnson is inviting you to a scheduled Zoom meeting.\n\nTopic: Q4 Planning Session\nTime: Tomorrow at 2:00 PM EST\n\nJoin Zoom Meeting:\nhttps://zoom.us/j/84729105632\n\nMeeting ID: 847 2910 5632\nPasscode: 482910`,
      date: generateDate(),
    },
    explanation: 'Legitimate Zoom invite from official domain with proper meeting details.',
    trustIndicators: ['Official zoom.us domain', 'Specific meeting details', 'Known colleague name', 'Standard Zoom format'],
  },
  {
    id: 'legit-5',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Doctor Appointment Reminder',
    content: {
      sender: '74839 (HealthCare)',
      message: 'Reminder: You have an appointment with Dr. Smith tomorrow at 10:30 AM. Reply C to confirm or call 555-123-4567 to reschedule.',
    },
    explanation: 'Legitimate appointment reminder from healthcare provider you have a relationship with.',
    trustIndicators: ['Expected reminder for existing appointment', 'Real doctor name', 'Office phone number', 'No links or urgent demands'],
  },
  {
    id: 'legit-6',
    type: 'website',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Official Bank Website',
    content: {
      url: 'https://www.chase.com/personal/banking',
      websiteTitle: 'Personal Banking | Chase',
      websiteContent: 'Access your accounts, pay bills, and manage your finances with Chase Online Banking.',
    },
    explanation: 'Official Chase website with correct domain and HTTPS.',
    trustIndicators: ['Official chase.com domain', 'HTTPS secure connection', 'Standard banking features', 'No typos in URL'],
  },
  {
    id: 'legit-7',
    type: 'social',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Verified Company Update',
    content: {
      platform: 'LinkedIn',
      username: 'Microsoft (Verified ✓)',
      post: `We're excited to announce the general availability of Microsoft 365 Copilot! Learn more about AI-powered productivity at microsoft.com/copilot`,
    },
    explanation: 'Verified company account posting about their own product with official link.',
    trustIndicators: ['Verified company account', 'Links to official domain', 'Announcement matches public news', 'No personal info requests'],
  },
  {
    id: 'legit-8',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Colleague File Share',
    content: {
      from: 'mike.johnson@yourcompany.com',
      to: 'you@yourcompany.com',
      subject: 'Shared: Q4 Budget Spreadsheet',
      body: `Hi,\n\nI've shared the Q4 budget spreadsheet we discussed in yesterday's meeting.\n\nAccess it here: https://yourcompany.sharepoint.com/sites/finance/q4-budget\n\nLet me know if you have questions.\n\nMike`,
      date: generateDate(),
    },
    explanation: 'Legitimate file share from known colleague through company SharePoint.',
    trustIndicators: ['From known colleague', 'Company email domain', 'References recent meeting', 'Internal SharePoint link'],
  },
  {
    id: 'legit-9',
    type: 'voice',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Pharmacy Prescription Ready',
    content: {
      callerNumber: '+1-555-456-7890 (CVS Pharmacy)',
      transcript: `"This is CVS Pharmacy calling for [Your Name]. Your prescription is ready for pickup at our Main Street location. The pharmacy closes at 9 PM. If you have questions, call us at 555-456-7890."`,
    },
    explanation: 'Legitimate pharmacy call from location where you have prescriptions.',
    trustIndicators: ['Expected call (you have a prescription)', 'Specific pharmacy location', 'Call-back number provided', 'No urgent demands or threats'],
  },
  {
    id: 'legit-10',
    type: 'qrcode',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Restaurant Menu QR',
    content: {
      qrContext: 'QR code printed on the table at a restaurant with their logo',
      qrDestination: 'Opens the restaurant\'s official website menu page',
    },
    explanation: 'Legitimate QR code at a restaurant for viewing their menu.',
    trustIndicators: ['Printed with restaurant branding', 'Goes to official restaurant website', 'Standard practice post-COVID', 'No personal info required'],
  },
  {
    id: 'legit-11',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Password Reset You Requested',
    content: {
      from: 'noreply@github.com',
      to: 'you@email.com',
      subject: 'Reset your GitHub password',
      body: `Hey there!\n\nWe heard you need a password reset. Click the button below to reset it:\n\nhttps://github.com/password_reset/abcd1234...\n\nThis link expires in 24 hours.\n\nIf you didn't request this, you can safely ignore this email.\n\nThanks,\nThe GitHub Team`,
      date: generateDate(),
    },
    explanation: 'Legitimate password reset email that YOU initiated from official GitHub.',
    trustIndicators: ['You requested this reset', 'Official github.com domain', 'Standard reset format', 'Option to ignore if not requested'],
  },
  {
    id: 'legit-12',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Two-Factor Authentication Code',
    content: {
      sender: 'Google',
      message: 'G-847291 is your Google verification code.',
    },
    explanation: 'Legitimate 2FA code you requested while logging in.',
    trustIndicators: ['You just tried to log in', 'Standard Google code format (G-XXXXXX)', 'No links or requests', 'Short and simple'],
  },
  {
    id: 'legit-13',
    type: 'website',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Google Search Results',
    content: {
      url: 'https://www.google.com/search?q=cybersecurity+training',
      websiteTitle: 'cybersecurity training - Google Search',
      websiteContent: 'Standard Google search results page showing various cybersecurity training resources.',
    },
    explanation: 'Official Google website performing a search.',
    trustIndicators: ['Official google.com domain', 'Standard search results', 'HTTPS connection', 'You initiated the search'],
  },
  {
    id: 'legit-14',
    type: 'social',
    difficulty: 'medium',
    correctAnswer: 'legitimate',
    title: 'Friend\'s Facebook Post',
    content: {
      platform: 'Facebook',
      username: 'John Smith (Your Friend)',
      post: `Just got back from an amazing vacation in Hawaii! 🌴 Check out these sunset photos. Hawaii is definitely on my bucket list now! #vacation #hawaii`,
    },
    explanation: 'Normal social media post from a friend you know in real life.',
    trustIndicators: ['Known friend\'s account', 'Personal content matching their life', 'No links or requests', 'Normal social behavior'],
  },
  {
    id: 'legit-15',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'legitimate',
    title: 'Newsletter You Subscribed To',
    content: {
      from: 'newsletter@techcrunch.com',
      to: 'you@email.com',
      subject: 'TechCrunch Daily: Top Stories',
      body: `Good morning!\n\nHere are today's top tech stories:\n\n1. Apple announces new product lineup\n2. AI startup raises $50M in funding\n3. New cybersecurity threats emerging\n\nRead more at techcrunch.com\n\nUnsubscribe: techcrunch.com/unsubscribe`,
      date: generateDate(),
    },
    explanation: 'Newsletter from a publication you subscribed to with easy unsubscribe option.',
    trustIndicators: ['You subscribed to this', 'Official domain', 'Unsubscribe option provided', 'Expected content'],
  },
];

// Combine all scenarios
const allScenarios = [...phishingScenarios, ...legitimateScenarios];

// Session tracking
const SESSION_KEY = 'cyber_scenarios_seen';
const STATS_KEY = 'cyber_scenarios_stats';

export interface SessionStats {
  correct: number;
  total: number;
  accuracy: number;
}

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

const getSeenScenarios = (): string[] => {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : [];
};

const markScenarioSeen = (id: string): void => {
  const seen = getSeenScenarios();
  if (!seen.includes(id)) {
    seen.push(id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(seen));
  }
};

export const generateUniqueScenario = (difficultyFilter?: Difficulty): Scenario | null => {
  const seen = getSeenScenarios();
  
  // Filter available scenarios
  let available = allScenarios.filter(s => !seen.includes(s.id));
  
  if (difficultyFilter) {
    available = available.filter(s => s.difficulty === difficultyFilter);
  }
  
  // If all scenarios seen, reset
  if (available.length === 0) {
    localStorage.removeItem(SESSION_KEY);
    available = difficultyFilter 
      ? allScenarios.filter(s => s.difficulty === difficultyFilter)
      : allScenarios;
  }
  
  // Shuffle and pick one
  const shuffled = shuffle(available);
  const scenario = shuffled[0];
  
  if (scenario) {
    markScenarioSeen(scenario.id);
  }
  
  return scenario || null;
};

export const getScenarioCount = (): number => allScenarios.length;
export const getPhishingCount = (): number => phishingScenarios.length;
export const getLegitCount = (): number => legitimateScenarios.length;
