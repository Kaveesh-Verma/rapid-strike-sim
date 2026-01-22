// Advanced Fraud Scenarios - Conference, Investment, and Telegram Scams
import { Scenario, ScenarioContent, Difficulty } from './scenarioGenerator';

const generateDate = (): string => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 48);
  now.setHours(now.getHours() - hours);
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// =============== CONFERENCE FRAUD SCENARIOS ===============
export const conferencePhishingScenarios: Scenario[] = [
  {
    id: 'conf-phish-1',
    type: 'email',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'IEEE Conference Registration Scam',
    content: {
      from: 'registration@ieee-conference-2024.org',
      to: 'you@university.edu',
      subject: 'URGENT: IEEE International Conference - Final Registration Deadline TODAY',
      body: `Dear Esteemed Researcher,

We are pleased to inform you that your abstract for IEEE International Conference on Advanced Computing (ICAC 2024) has been CONDITIONALLY ACCEPTED!

However, to secure your presentation slot, you MUST complete your registration and pay the early bird fee of $450 USD within the next 24 HOURS.

After this deadline, the registration fee increases to $750 USD and your slot may be given to another researcher on the waitlist.

Payment Methods:
- Wire Transfer (preferred - 10% discount)
- Western Union
- Bitcoin/Cryptocurrency

Click here to complete registration: https://ieee-conference-2024.org/register-now

IMPORTANT: Your abstract ID is #IC2024-8847. Keep this for your records.

Looking forward to your participation!

Prof. Dr. James Anderson
Conference Chair, ICAC 2024
IEEE Computer Society`,
      date: generateDate(),
      hasAttachment: true,
      attachmentName: 'Registration_Form_ICAC2024.pdf',
    },
    explanation: 'This is a conference scam. IEEE does not use domains like "ieee-conference-2024.org". Real IEEE conferences are hosted on ieee.org. The payment methods (wire transfer, Western Union, crypto) are major red flags. Legitimate conferences never demand urgent payment via untraceable methods.',
    redFlags: [
      'Fake domain (not ieee.org)',
      'Urgency pressure with 24-hour deadline',
      'Suspicious payment methods (wire, Western Union, crypto)',
      'Conditional acceptance requiring immediate payment',
      'Generic email not personalized to your submitted work'
    ],
    aiAnalysisHints: {
      threatLevel: 'high',
      attackVector: 'Advance Fee Fraud',
      targetedAssets: ['Payment information', 'Personal data', 'Academic credentials'],
      realWorldImpact: 'Victims lose registration fees ($450-750+) with no conference. Personal data may be used for identity theft.'
    }
  },
  {
    id: 'conf-phish-2',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Springer Nature Journal Invitation',
    content: {
      from: 'editor@springer-nature-journals.com',
      to: 'you@university.edu',
      subject: 'Invitation to Submit - Special Issue on AI & Machine Learning',
      body: `Dear Dr. [Researcher],

On behalf of the Editorial Board of the International Journal of Advanced AI Research (Impact Factor: 4.832), I am writing to invite you to submit a manuscript for our upcoming Special Issue on "Advances in Machine Learning and Artificial Intelligence."

Based on your previous publications in this field, we believe your expertise would make a valuable contribution to this issue.

Submission Benefits:
✓ Fast-track peer review (2-3 weeks)
✓ Immediate online publication upon acceptance
✓ Waived article processing charges for invited authors
✓ High visibility in Scopus and Web of Science

To accept this invitation and secure your slot, please register at:
https://springer-nature-journals.com/submit/special-issue

Registration fee: $199 (fully refundable upon acceptance)

Deadline: 5 days from receipt of this email.

We look forward to your valuable contribution.

Best regards,
Dr. Sarah Mitchell
Guest Editor
springer-nature-journals.com`,
      date: generateDate(),
    },
    explanation: 'Predatory journal scam impersonating Springer Nature. The real domain is springer.com or nature.com, not "springer-nature-journals.com". Legitimate journals never charge registration fees, and reputable publishers do not pressure authors with short deadlines.',
    redFlags: [
      'Fake domain (not springer.com or nature.com)',
      'Registration fee request (legitimate journals do not do this)',
      'Generic greeting with placeholder',
      'Artificial urgency (5-day deadline)',
      'Unsolicited invitation based on vague "previous publications"'
    ],
    aiAnalysisHints: {
      threatLevel: 'high',
      attackVector: 'Academic Credential Fraud',
      targetedAssets: ['Research manuscripts', 'Registration fees', 'Academic reputation'],
      realWorldImpact: 'Loss of money, unpublished research may be stolen or leaked, damage to academic reputation.'
    }
  },
  {
    id: 'conf-phish-3',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Fake Elsevier Conference Alert',
    content: {
      from: 'conference-alert@elsevier-events.net',
      to: 'you@email.com',
      subject: '🎉 CONGRATULATIONS! Your Paper is ACCEPTED - Pay Now to Confirm',
      body: `CONGRATULATIONS!!!

Your paper has been ACCEPTED to the Elsevier International Scientific Conference 2024!!!

Paper ID: EISC-2024-RANDOM
Title: [Your Submitted Paper]

ACTION REQUIRED - PAY WITHIN 48 HOURS OR LOSE YOUR SPOT!!!

Registration Fee: $595 USD

PAY NOW: https://elsevier-events.net/pay-registration

Payment Options:
💳 Credit Card
💰 Bitcoin
💸 Gift Cards (Apple, Amazon, Google Play)

DON'T MISS THIS OPPORTUNITY!!!

Elsevier Conference Team`,
      date: generateDate(),
    },
    explanation: 'Obvious conference scam with multiple red flags. Elsevier uses elsevier.com, not "elsevier-events.net". Legitimate conferences never accept gift cards as payment. The excessive excitement and urgency are classic social engineering tactics.',
    redFlags: [
      'Fake domain (not elsevier.com)',
      'Excessive excitement and all-caps urgency',
      'Gift cards as payment method',
      'No specific paper title mentioned',
      'Generic "random" paper ID'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Advance Fee Fraud',
      targetedAssets: ['Payment card details', 'Gift card codes', 'Registration fees'],
      realWorldImpact: 'Direct financial loss through untraceable payment methods.'
    }
  },
];

// =============== INVESTMENT FRAUD SCENARIOS ===============
export const investmentPhishingScenarios: Scenario[] = [
  {
    id: 'invest-phish-1',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'WhatsApp Investment Group Invitation',
    content: {
      from: 'investments@profit-masters-global.com',
      to: 'you@email.com',
      subject: 'Exclusive VIP Investment Group - Guaranteed 500% Returns',
      body: `Hello Valued Investor!

You have been specially selected to join our EXCLUSIVE WhatsApp investment group where our expert traders share:

💰 Daily trading signals with 95% success rate
📈 Guaranteed returns of 300-500% monthly
🎯 Zero risk strategies used by Wall Street insiders
⚡ Instant withdrawals - get your profits anytime!

Our members have already earned MILLIONS!

Join now (only 10 spots remaining):
WhatsApp Group: https://wa.me/+1987654321?text=JOIN_VIP

Minimum investment: Only $250 to start!

Don't miss this LIFE-CHANGING opportunity!

Best regards,
Marcus Chen
Senior Investment Advisor
Profit Masters Global`,
      date: generateDate(),
    },
    explanation: 'Classic investment scam. No legitimate investment offers "guaranteed" returns of 300-500%. The "zero risk" claim is impossible - all investments carry risk. The artificial scarcity ("10 spots remaining") is a pressure tactic.',
    redFlags: [
      'Guaranteed returns (impossible in legitimate investing)',
      'Unrealistic return percentages (300-500%)',
      '"Zero risk" claim',
      'Artificial scarcity pressure',
      'Unsolicited investment offer',
      'WhatsApp for "professional" investing'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Investment Fraud / Ponzi Scheme',
      targetedAssets: ['Personal savings', 'Bank account access', 'Identity information'],
      realWorldImpact: 'Complete loss of invested funds. Scammers often disappear with all money. Recovery is nearly impossible.'
    }
  },
  {
    id: 'invest-phish-2',
    type: 'social',
    difficulty: 'medium',
    correctAnswer: 'phishing',
    title: 'LinkedIn Crypto Investment Opportunity',
    content: {
      platform: 'LinkedIn',
      username: 'SophiaWilliams_Investments',
      displayName: 'Sophia Williams | Goldman Sachs Alumni',
      verified: false,
      post: `🚀 Life-changing opportunity alert! 🚀

After leaving Goldman Sachs, I've been helping everyday people achieve financial freedom through strategic crypto investments.

In the last month alone, my mentees have seen:
• $500 → $15,000 in 2 weeks
• $1,000 → $45,000 in 1 month

I'm opening 5 more spots in my exclusive mentorship program.

✅ No experience needed
✅ I do all the trading for you
✅ Guaranteed minimum 200% returns
✅ Start with as little as $100

DM me "CRYPTO" to secure your spot before it's too late!

#CryptoWealth #FinancialFreedom #PassiveIncome #Investing`,
    },
    explanation: 'Crypto romance/investment scam using fake authority (Goldman Sachs). No real investment professional guarantees returns or trades on behalf of random LinkedIn connections. The unrealistic returns and "I do all the trading" are major red flags.',
    redFlags: [
      'Guaranteed returns (impossible)',
      'Unrealistic profit claims',
      '"I trade for you" is unlicensed securities activity',
      'Unsolicited investment offers via social media',
      'Fake authority claims (unverifiable Goldman Sachs connection)',
      'Artificial urgency with limited spots'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Pig Butchering / Investment Fraud',
      targetedAssets: ['Crypto wallets', 'Bank accounts', 'Personal funds'],
      realWorldImpact: 'Victims often lose their entire savings. Scammers use "pig butchering" tactics - building trust before the big scam.'
    }
  },
  {
    id: 'invest-phish-3',
    type: 'sms',
    difficulty: 'hard',
    correctAnswer: 'phishing',
    title: 'Professional-Looking Investment Alert',
    content: {
      sender: 'FIDELITY',
      message: 'Fidelity Alert: Market opportunity detected. Our AI analysis indicates high-growth stocks available for early investors. Limited allocation for qualified clients. Review at fidelity-investments.co/opportunity Reply STOP to opt out.',
    },
    explanation: 'SMS spoofing impersonating Fidelity. The real domain is fidelity.com, not "fidelity-investments.co". Legitimate brokerages never send unsolicited investment opportunities via text message.',
    redFlags: [
      'Fake domain (.co instead of .com)',
      'Unsolicited investment opportunity',
      'SMS from "financial institution"',
      'Urgency with "limited allocation"',
      'Fidelity doesn\'t send such promotional texts'
    ],
    aiAnalysisHints: {
      threatLevel: 'high',
      attackVector: 'Smishing with Domain Spoofing',
      targetedAssets: ['Brokerage credentials', 'Investment accounts', 'Personal information'],
      realWorldImpact: 'Account takeover leading to unauthorized trades or fund transfers.'
    }
  },
];

// =============== TELEGRAM SCAM SCENARIOS (AUTO-TERMINATE) ===============
export const telegramScamScenarios: Scenario[] = [
  {
    id: 'telegram-scam-1',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Telegram Job Scam',
    content: {
      sender: '+1-555-JOBS',
      message: 'Hi! We found your resume and have a part-time job for you. Earn $300-$500/day working from home. Contact us on Telegram: @EasyMoneyJobs2024 to start immediately!',
    },
    explanation: 'Known fraud pattern. Telegram job offers promising high daily pay for minimal work are consistently fraudulent. This is a task scam or money mule recruitment scheme.',
    redFlags: [
      'Unsolicited job offer',
      'Unrealistic pay for "part-time" work',
      'Communication via Telegram only',
      'Vague job description',
      '"Found your resume" without specifying where'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Task Scam / Money Mule Recruitment',
      targetedAssets: ['Personal information', 'Bank account for money laundering', 'Upfront fees'],
      realWorldImpact: 'Victims may unknowingly participate in money laundering, facing criminal charges.'
    }
  },
  {
    id: 'telegram-scam-2',
    type: 'sms',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Telegram Crypto Signal Group',
    content: {
      sender: '+1-888-CRYPTO',
      message: 'FREE CRYPTO SIGNALS! Join our Telegram: @CryptoElitePumps - We predict 1000% gains! Last week: BTC +45%, ETH +89%. VIP access: t.me/CryptoElitePumps',
    },
    explanation: 'Crypto pump-and-dump scheme recruitment. These groups manipulate prices, and followers always lose money when the organizers dump their holdings.',
    redFlags: [
      'Unrealistic return claims (1000%)',
      'Telegram-only communication',
      'Unsolicited crypto advice',
      '"Pump" language indicating manipulation',
      'Free signals leading to paid VIP'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Pump and Dump Scheme',
      targetedAssets: ['Cryptocurrency holdings', 'Exchange account credentials'],
      realWorldImpact: 'Victims buy at artificially inflated prices and lose money when organizers sell.'
    }
  },
  {
    id: 'telegram-scam-3',
    type: 'email',
    difficulty: 'easy',
    correctAnswer: 'phishing',
    title: 'Telegram Investment Bot Scam',
    content: {
      from: 'info@automated-trading-bot.io',
      to: 'you@email.com',
      subject: 'Your Passive Income Machine is Ready - Start Earning on Telegram',
      body: `Hello Future Millionaire!

Our AI-powered Telegram trading bot is now available to YOU!

🤖 Fully automated trading
💰 Average daily profit: $500-$2,000
⏰ Works 24/7 while you sleep
✅ No trading experience needed

Join our Telegram group to activate your bot:
t.me/AutoTradeBot_Official

Minimum deposit: $100 (fully refundable!)

Start your financial freedom journey TODAY!

The AutoTrade Team`,
      date: generateDate(),
    },
    explanation: 'Telegram bot scam. No trading bot guarantees $500-2000 daily profits. The "refundable" deposit is never returned. This is designed to steal your initial investment and potentially drain your crypto wallet.',
    redFlags: [
      'Guaranteed daily profits',
      'Telegram-based trading platform',
      '"Fully refundable" deposit that never is',
      'No regulation or licensing mentioned',
      'Too-good-to-be-true automation claims'
    ],
    aiAnalysisHints: {
      threatLevel: 'critical',
      attackVector: 'Fake Trading Bot Scam',
      targetedAssets: ['Initial deposits', 'Crypto wallet access', 'Personal information'],
      realWorldImpact: 'Complete loss of deposited funds. Bot may request wallet permissions to drain assets.'
    }
  },
];

// =============== LEGITIMATE CONFERENCE/INVESTMENT SCENARIOS ===============
export const legitimateAdvancedScenarios: Scenario[] = [
  {
    id: 'legit-conf-1',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Real IEEE Conference Notification',
    content: {
      from: 'no-reply@ieee.org',
      to: 'you@university.edu',
      subject: 'IEEE ICRA 2024 - Paper Submission Confirmation',
      body: `Dear Author,

Thank you for submitting your paper to the IEEE International Conference on Robotics and Automation (ICRA 2024).

Paper ID: ICRA24-1847
Title: [Your Actual Paper Title]
Track: Autonomous Systems

Your submission has been received and is under review. You will receive notification of the review outcome by March 15, 2024.

For questions, contact the program committee through the official ICRA portal at:
https://www.ieee-ras.org/conferences-workshops/financially-co-sponsored/icra

Thank you,
ICRA 2024 Program Committee
IEEE Robotics and Automation Society`,
      date: generateDate(),
    },
    explanation: 'This is a legitimate IEEE conference communication. The email comes from @ieee.org, links to official ieee-ras.org domain, references a specific paper with real ID, and does not demand immediate payment.',
    trustIndicators: [
      'Official @ieee.org domain',
      'Links to official ieee-ras.org',
      'References specific submitted paper',
      'No payment pressure',
      'Professional, measured communication'
    ],
    aiAnalysisHints: {
      threatLevel: 'low',
      attackVector: 'None - Legitimate',
      realWorldImpact: 'Standard academic conference communication.'
    }
  },
  {
    id: 'legit-invest-1',
    type: 'email',
    difficulty: 'hard',
    correctAnswer: 'legitimate',
    title: 'Real Brokerage Account Alert',
    content: {
      from: 'alerts@fidelity.com',
      to: 'you@email.com',
      subject: 'Account Alert: Dividend Payment Received',
      body: `Hello [Your Name],

A dividend payment has been credited to your Fidelity account.

Account: ****1234
Security: Vanguard Total Stock Market ETF (VTI)
Amount: $47.82
Payment Date: January 15, 2024

This dividend has been automatically reinvested per your account settings.

To view your transaction history, log in to your account at Fidelity.com

Questions? Call us at 800-343-3548 or visit a local branch.

Fidelity Investments`,
      date: generateDate(),
    },
    explanation: 'This is a legitimate Fidelity notification. The email comes from @fidelity.com, references a specific account and real security (VTI), does not request login via email link, and provides official phone number.',
    trustIndicators: [
      'Official @fidelity.com domain',
      'References specific account details',
      'Real ticker symbol (VTI)',
      'No clickable login link (just mentions Fidelity.com)',
      'Official customer service number provided'
    ],
    aiAnalysisHints: {
      threatLevel: 'low',
      attackVector: 'None - Legitimate',
      realWorldImpact: 'Standard brokerage account notification.'
    }
  },
];

// Get all advanced scenarios organized by difficulty
export const getAdvancedScenariosByDifficulty = () => ({
  easy: {
    phishing: [
      ...conferencePhishingScenarios.filter(s => s.difficulty === 'easy'),
      ...investmentPhishingScenarios.filter(s => s.difficulty === 'easy'),
      ...telegramScamScenarios.filter(s => s.difficulty === 'easy'),
    ],
    legitimate: [],
  },
  medium: {
    phishing: [
      ...conferencePhishingScenarios.filter(s => s.difficulty === 'medium'),
      ...investmentPhishingScenarios.filter(s => s.difficulty === 'medium'),
    ],
    legitimate: [],
  },
  hard: {
    phishing: [
      ...conferencePhishingScenarios.filter(s => s.difficulty === 'hard'),
      ...investmentPhishingScenarios.filter(s => s.difficulty === 'hard'),
    ],
    legitimate: legitimateAdvancedScenarios,
  },
});

// Check if a scenario is a Telegram scam (for auto-terminate behavior)
export const isTelegramScam = (scenarioId: string): boolean => {
  return telegramScamScenarios.some(s => s.id === scenarioId);
};

// Get all advanced scenarios as flat array
export const getAllAdvancedScenarios = (): Scenario[] => [
  ...conferencePhishingScenarios,
  ...investmentPhishingScenarios,
  ...telegramScamScenarios,
  ...legitimateAdvancedScenarios,
];
