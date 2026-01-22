// Quiz questions for training modules
export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Phishing Identification Module
  {
    id: 'quiz-phishing-1',
    moduleId: 'phishing-identification',
    question: 'Which of the following is a common red flag in phishing emails?',
    options: [
      'Email from a known colleague',
      'Urgent language threatening account suspension',
      'Standard company signature',
      'Links to official company website'
    ],
    correctOptionIndex: 1,
    explanation: 'Phishing emails commonly use urgent, threatening language to pressure victims into acting quickly without thinking.'
  },
  {
    id: 'quiz-phishing-2',
    moduleId: 'phishing-identification',
    question: 'What should you check first when you receive a suspicious email?',
    options: [
      'The email body content',
      'The sender\'s email address and domain',
      'The attachments',
      'The date it was sent'
    ],
    correctOptionIndex: 1,
    explanation: 'Always verify the sender\'s email address. Phishers often use domains that look similar to legitimate ones (e.g., amaz0n.com instead of amazon.com).'
  },
  {
    id: 'quiz-phishing-3',
    moduleId: 'phishing-identification',
    question: 'A legitimate bank would NEVER:',
    options: [
      'Send you transaction notifications',
      'Ask you to verify your identity via email link',
      'Provide customer service phone numbers',
      'Send account balance updates'
    ],
    correctOptionIndex: 1,
    explanation: 'Banks and financial institutions never ask customers to verify identity or provide sensitive information through email links.'
  },
  {
    id: 'quiz-phishing-4',
    moduleId: 'phishing-identification',
    question: 'What is "spear phishing"?',
    options: [
      'Random mass email attacks',
      'Targeted attacks using personal information about the victim',
      'Phishing via text message',
      'Voice-based phishing calls'
    ],
    correctOptionIndex: 1,
    explanation: 'Spear phishing is a targeted attack where attackers research their victims and craft personalized messages to increase success rates.'
  },
  {
    id: 'quiz-phishing-5',
    moduleId: 'phishing-identification',
    question: 'If you\'re unsure about an email from your IT department, what should you do?',
    options: [
      'Click the link to verify it works',
      'Reply to the email asking if it\'s legitimate',
      'Contact IT through a separate, known channel',
      'Forward it to all colleagues for their opinion'
    ],
    correctOptionIndex: 2,
    explanation: 'Always verify suspicious communications through a separate, known channel. Never use contact information provided in the suspicious email itself.'
  },

  // Urgency Tactics Module
  {
    id: 'quiz-urgency-1',
    moduleId: 'urgency-tactics',
    question: 'Why do attackers create a sense of urgency?',
    options: [
      'To be helpful and save time',
      'To bypass critical thinking and force quick decisions',
      'Because they\'re actually in a hurry',
      'To test response times'
    ],
    correctOptionIndex: 1,
    explanation: 'Urgency is a psychological manipulation tactic. When people feel pressured, they\'re more likely to make mistakes and skip verification steps.'
  },
  {
    id: 'quiz-urgency-2',
    moduleId: 'urgency-tactics',
    question: 'Which phrase is most commonly used in social engineering attacks?',
    options: [
      '"When you have time, please review"',
      '"Act now or your account will be suspended!"',
      '"No rush, just wanted to share"',
      '"For your records"'
    ],
    correctOptionIndex: 1,
    explanation: 'Threatening language combined with immediate deadlines is a classic social engineering tactic designed to create panic and bypass rational thinking.'
  },
  {
    id: 'quiz-urgency-3',
    moduleId: 'urgency-tactics',
    question: 'What is the BEST response to any urgent request for sensitive information?',
    options: [
      'Respond quickly to resolve the issue',
      'Ignore all urgent emails',
      'Pause, verify through official channels, then respond',
      'Forward to your manager'
    ],
    correctOptionIndex: 2,
    explanation: 'The best defense against urgency tactics is to pause and verify. Legitimate organizations will understand if you take time to verify requests.'
  },
  {
    id: 'quiz-urgency-4',
    moduleId: 'urgency-tactics',
    question: '"Authority" as a manipulation tactic involves:',
    options: [
      'Threatening legal action',
      'Impersonating executives, IT staff, or officials',
      'Offering rewards',
      'Creating long-term relationships'
    ],
    correctOptionIndex: 1,
    explanation: 'Attackers often impersonate authority figures (CEO, IT admin, government officials) because people tend to comply with requests from perceived authority.'
  },

  // Domain Spoofing Module
  {
    id: 'quiz-domain-1',
    moduleId: 'domain-spoofing',
    question: 'Which of these is an example of typosquatting?',
    options: [
      'google.com',
      'googIe.com (with capital I)',
      'www.google.com',
      'mail.google.com'
    ],
    correctOptionIndex: 1,
    explanation: 'Typosquatting uses look-alike characters. "googIe.com" uses a capital I instead of lowercase L, which looks nearly identical in many fonts.'
  },
  {
    id: 'quiz-domain-2',
    moduleId: 'domain-spoofing',
    question: 'In the URL "login.microsoft.com.attackersite.ru", what is the actual domain?',
    options: [
      'login.microsoft.com',
      'microsoft.com',
      'attackersite.ru',
      'com.attackersite.ru'
    ],
    correctOptionIndex: 2,
    explanation: 'The actual domain is always the last part before the path. Here, "attackersite.ru" is the real domain, and "login.microsoft.com" is just a subdomain trick.'
  },
  {
    id: 'quiz-domain-3',
    moduleId: 'domain-spoofing',
    question: 'What should you do before clicking any link in an email?',
    options: [
      'Click it to see where it goes',
      'Hover over it to preview the actual URL',
      'Open it in incognito mode',
      'Ask a colleague to click it first'
    ],
    correctOptionIndex: 1,
    explanation: 'Always hover over links to preview the actual destination URL before clicking. The visible link text can be different from the actual URL.'
  },
  {
    id: 'quiz-domain-4',
    moduleId: 'domain-spoofing',
    question: 'A legitimate company website would have:',
    options: [
      'Free hosting subdomain (e.g., company.wordpress.com)',
      'Their official domain with HTTPS',
      'Any domain with the company name in it',
      'HTTP is fine for login pages'
    ],
    correctOptionIndex: 1,
    explanation: 'Legitimate companies use their official domains with HTTPS. Be suspicious of free hosting, unusual TLDs, or missing HTTPS on login pages.'
  },

  // Fake Login Pages Module
  {
    id: 'quiz-fakelogin-1',
    moduleId: 'fake-login-pages',
    question: 'What is the primary goal of fake login pages?',
    options: [
      'To test website security',
      'To harvest user credentials',
      'To display advertisements',
      'To spread malware directly'
    ],
    correctOptionIndex: 1,
    explanation: 'Fake login pages are designed to capture credentials (usernames and passwords) which attackers can then use to access real accounts.'
  },
  {
    id: 'quiz-fakelogin-2',
    moduleId: 'fake-login-pages',
    question: 'After entering credentials on a suspected fake site, what should you do?',
    options: [
      'Nothing, wait and see',
      'Immediately change your password on the real site',
      'Clear your browser history',
      'Delete the email that led you there'
    ],
    correctOptionIndex: 1,
    explanation: 'If you suspect you\'ve entered credentials on a fake site, immediately change your password on the legitimate site and enable 2FA if available.'
  },
  {
    id: 'quiz-fakelogin-3',
    moduleId: 'fake-login-pages',
    question: 'The SAFEST way to access your bank account is:',
    options: [
      'Click the link in the bank\'s email',
      'Search for the bank on Google',
      'Type the bank\'s official URL directly in your browser',
      'Use a bookmark you created from an email link'
    ],
    correctOptionIndex: 2,
    explanation: 'Typing the official URL directly is safest. Search results can include ads for fake sites, and email links can be malicious.'
  },

  // Two-Factor Authentication Module
  {
    id: 'quiz-2fa-1',
    moduleId: 'two-factor-auth',
    question: 'Which 2FA method is most secure?',
    options: [
      'SMS codes',
      'Email codes',
      'Hardware security keys (YubiKey)',
      'Security questions'
    ],
    correctOptionIndex: 2,
    explanation: 'Hardware security keys are the most secure 2FA method because they can\'t be phished, intercepted, or remotely compromised.'
  },
  {
    id: 'quiz-2fa-2',
    moduleId: 'two-factor-auth',
    question: 'Why is SMS-based 2FA considered less secure?',
    options: [
      'It\'s too slow',
      'Codes are vulnerable to SIM swapping attacks',
      'It requires a phone',
      'The codes are too short'
    ],
    correctOptionIndex: 1,
    explanation: 'SMS codes can be intercepted through SIM swapping, where attackers convince your carrier to transfer your number to their SIM card.'
  },
  {
    id: 'quiz-2fa-3',
    moduleId: 'two-factor-auth',
    question: 'Which accounts should have 2FA enabled FIRST?',
    options: [
      'Gaming accounts',
      'Email and financial accounts',
      'Streaming services',
      'Social media only'
    ],
    correctOptionIndex: 1,
    explanation: 'Email accounts are critical because they\'re used for password resets. Financial accounts contain money. Both should be the highest priority for 2FA.'
  },
  {
    id: 'quiz-2fa-4',
    moduleId: 'two-factor-auth',
    question: 'An authenticator app like Google Authenticator generates codes using:',
    options: [
      'Your location',
      'Time-based one-time passwords (TOTP)',
      'Your phone number',
      'Your email address'
    ],
    correctOptionIndex: 1,
    explanation: 'Authenticator apps use TOTP (Time-based One-Time Password) algorithm, generating new codes every 30 seconds based on a shared secret and current time.'
  },

  // Ransomware Module
  {
    id: 'quiz-ransomware-1',
    moduleId: 'ransomware-basics',
    question: 'How does ransomware typically infect systems?',
    options: [
      'Only through physical USB drives',
      'Phishing emails, malicious downloads, or unpatched vulnerabilities',
      'Only through network cables',
      'By visiting any website'
    ],
    correctOptionIndex: 1,
    explanation: 'Ransomware commonly spreads through phishing emails with malicious attachments, drive-by downloads, and exploitation of software vulnerabilities.'
  },
  {
    id: 'quiz-ransomware-2',
    moduleId: 'ransomware-basics',
    question: 'What does modern ransomware often do BEFORE encrypting files?',
    options: [
      'Ask for permission',
      'Steal and exfiltrate data',
      'Improve system performance',
      'Update itself'
    ],
    correctOptionIndex: 1,
    explanation: 'Modern ransomware often steals data before encrypting, enabling "double extortion" - threatening to leak data even if you have backups.'
  },
  {
    id: 'quiz-ransomware-3',
    moduleId: 'ransom-payment-risks',
    question: 'Why should you NOT pay ransomware demands?',
    options: [
      'It\'s always illegal',
      'There\'s no guarantee of getting your data back',
      'The amount is always too high',
      'Ransomware is a myth'
    ],
    correctOptionIndex: 1,
    explanation: 'Paying ransom doesn\'t guarantee decryption. Many victims pay but never receive working decryption keys, or find their data is already corrupted.'
  },
  {
    id: 'quiz-ransomware-4',
    moduleId: 'backup-recovery',
    question: 'What is the 3-2-1 backup rule?',
    options: [
      '3 passwords, 2 emails, 1 phone',
      '3 copies, 2 different media types, 1 offsite',
      '3 computers, 2 networks, 1 cloud',
      '3 days, 2 weeks, 1 month backup schedule'
    ],
    correctOptionIndex: 1,
    explanation: 'The 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 copy stored offsite or offline for disaster recovery.'
  },

  // Social Engineering Psychology Module
  {
    id: 'quiz-social-1',
    moduleId: 'social-engineering-psychology',
    question: 'The principle of "reciprocity" in social engineering means:',
    options: [
      'Attackers reciprocate your kindness',
      'People feel obligated to return favors',
      'Two-way communication',
      'Mutual authentication'
    ],
    correctOptionIndex: 1,
    explanation: 'Attackers exploit reciprocity by doing small favors first, making victims feel obligated to comply with later requests.'
  },
  {
    id: 'quiz-social-2',
    moduleId: 'social-engineering-psychology',
    question: '"Social proof" attacks work because:',
    options: [
      'Attackers have ID badges',
      'People tend to follow what others are doing',
      'Social media is involved',
      'Multiple attackers are used'
    ],
    correctOptionIndex: 1,
    explanation: 'Attackers claim "everyone else did this" or "your colleagues already complied" to trigger our tendency to follow group behavior.'
  },

  // Incident Reporting Module
  {
    id: 'quiz-incident-1',
    moduleId: 'incident-reporting',
    question: 'When you suspect a security incident, you should FIRST:',
    options: [
      'Try to fix it yourself',
      'Delete the suspicious email',
      'Report it to IT/Security immediately',
      'Wait to see if it happens again'
    ],
    correctOptionIndex: 2,
    explanation: 'Immediate reporting allows security teams to respond quickly, potentially preventing spread and minimizing damage.'
  },
  {
    id: 'quiz-incident-2',
    moduleId: 'incident-reporting',
    question: 'Why should you NOT delete suspicious emails?',
    options: [
      'They might be important',
      'They contain evidence for investigation',
      'Your inbox will be too empty',
      'You should forward them to everyone first'
    ],
    correctOptionIndex: 1,
    explanation: 'Suspicious emails contain valuable forensic evidence. Security teams analyze headers, links, and attachments to understand and prevent future attacks.'
  },
];

// Get quiz questions for a specific module
export const getQuizQuestionsForModule = (moduleId: string): QuizQuestion[] => {
  return QUIZ_QUESTIONS.filter(q => q.moduleId === moduleId);
};

// Calculate quiz score
export const calculateQuizScore = (
  questions: QuizQuestion[],
  answers: number[]
): { score: number; percentage: number; passed: boolean } => {
  const correct = questions.reduce((acc, question, index) => {
    return acc + (question.correctOptionIndex === answers[index] ? 1 : 0);
  }, 0);
  
  const percentage = Math.round((correct / questions.length) * 100);
  
  return {
    score: correct,
    percentage,
    passed: percentage >= 70,
  };
};
