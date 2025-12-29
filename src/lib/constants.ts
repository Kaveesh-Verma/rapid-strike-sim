// Learning modules data - 15+ real cybersecurity topics
export const LEARNING_MODULES = [
  // Phishing & Social Engineering
  {
    module_id: "phishing-identification",
    title: "Identifying Phishing Emails",
    description: "Learn to spot the telltale signs of phishing attempts",
    category: "Phishing & Social Engineering",
    attack_type: "phishing",
    content: `Phishing emails often contain these red flags:
    
• Urgent or threatening language ("Your account will be suspended!")
• Generic greetings ("Dear Customer" instead of your name)
• Suspicious sender addresses (support@amaz0n-secure.com)
• Requests for sensitive information
• Poor grammar and spelling errors
• Mismatched or suspicious links`,
    why_it_matters: "Phishing attacks account for 90% of data breaches. Learning to identify them protects you and your organization from credential theft, malware, and financial loss.",
    difficulty: "beginner",
    order_index: 1,
  },
  {
    module_id: "urgency-tactics",
    title: "Urgency & Fear Tactics",
    description: "Understand how attackers exploit emotions to bypass rational thinking",
    category: "Phishing & Social Engineering",
    attack_type: "phishing",
    content: `Social engineers use psychological manipulation:

• TIME PRESSURE: "Act within 24 hours or lose access"
• FEAR: "Your account has been compromised"
• AUTHORITY: Impersonating executives or IT staff
• SCARCITY: "Limited time offer - verify now"
• CURIOSITY: "Someone shared a document with you"

Always pause and verify through official channels.`,
    why_it_matters: "When stressed or rushed, people make poor security decisions. Recognizing these tactics gives you the mental space to respond rationally.",
    difficulty: "beginner",
    order_index: 2,
  },
  {
    module_id: "domain-spoofing",
    title: "Domain Spoofing & Look-alike URLs",
    description: "Detect fake domains designed to deceive",
    category: "Phishing & Social Engineering",
    attack_type: "phishing",
    content: `Attackers create convincing fake domains:

• TYPOSQUATTING: googIe.com (capital i), g00gle.com
• SUBDOMAIN TRICKS: google.com.malicious-site.com
• HOMOGRAPH ATTACKS: Using similar-looking characters
• TLD SWAPPING: google.net instead of google.com

Always check:
1. The full URL before clicking
2. The domain in the address bar after loading
3. SSL certificate details`,
    why_it_matters: "A single click on a spoofed domain can lead to credential theft or malware installation. URL awareness is your first line of defense.",
    difficulty: "intermediate",
    order_index: 3,
  },
  {
    module_id: "email-headers",
    title: "Email Header Analysis (Simplified)",
    description: "Basic email header inspection for authenticity verification",
    category: "Phishing & Social Engineering",
    attack_type: "phishing",
    content: `Key email header fields to check:

• FROM: Can be easily spoofed - don't trust alone
• REPLY-TO: If different from FROM, be suspicious
• RECEIVED: Shows the email's path - check originating IP
• SPF/DKIM/DMARC: Authentication results in headers

In most email clients, look for:
- "Show original" or "View headers"
- Check if SPF = pass and DKIM = pass`,
    why_it_matters: "Email headers reveal the true origin of messages. This knowledge helps verify legitimate communications from your organization.",
    difficulty: "intermediate",
    order_index: 4,
  },
  {
    module_id: "safe-link-hovering",
    title: "Safe Link-Hovering Techniques",
    description: "Preview links without risking your security",
    category: "Phishing & Social Engineering",
    attack_type: "phishing",
    content: `Before clicking any link:

1. HOVER (don't click) to preview the URL
2. Check the STATUS BAR at the bottom of your browser
3. Look for HTTPS and the correct domain
4. Be wary of URL SHORTENERS (bit.ly, tinyurl)
5. Use LINK SCANNERS for suspicious URLs

On mobile:
- Long-press to preview links
- Copy and paste into a URL checker`,
    why_it_matters: "One wrong click can compromise your entire system. Link verification takes seconds but prevents hours of incident response.",
    difficulty: "beginner",
    order_index: 5,
  },
  // Credential Safety
  {
    module_id: "fake-login-pages",
    title: "Fake Login Pages & Credential Harvesting",
    description: "Identify cloned login pages designed to steal credentials",
    category: "Credential Safety",
    attack_type: "credential_theft",
    content: `Signs of a fake login page:

• URL doesn't match the official site
• Missing or invalid SSL certificate
• Slightly different design or logos
• Unusual form behavior (no password masking)
• Redirects from suspicious links

ALWAYS:
- Type the URL directly or use bookmarks
- Check for HTTPS and the padlock icon
- Verify the certificate details`,
    why_it_matters: "Credential harvesting is the primary goal of most phishing attacks. Your username and password are the keys to your digital identity.",
    difficulty: "beginner",
    order_index: 6,
  },
  {
    module_id: "https-explained",
    title: "HTTPS vs HTTP Explained",
    description: "Understand encryption and its security implications",
    category: "Credential Safety",
    attack_type: "credential_theft",
    content: `HTTP vs HTTPS:

HTTP (Insecure):
- Data sent in plain text
- Anyone can intercept credentials
- No identity verification

HTTPS (Secure):
- Encrypted connection
- Protects data in transit
- Verifies site identity

BUT HTTPS doesn't mean the site is safe!
- Attackers can get SSL certificates too
- Always verify the domain is correct`,
    why_it_matters: "HTTPS protects your data from interception, but it doesn't guarantee the site is legitimate. Understanding this nuance is crucial.",
    difficulty: "beginner",
    order_index: 7,
  },
  {
    module_id: "password-reuse-risks",
    title: "Password Reuse Risks",
    description: "Why unique passwords are essential for security",
    category: "Credential Safety",
    attack_type: "credential_theft",
    content: `The Password Reuse Problem:

When you reuse passwords:
1. One breach exposes all accounts
2. Attackers use "credential stuffing"
3. Automated tools test stolen creds everywhere

SOLUTION:
- Use a password manager
- Generate unique passwords for each site
- Enable 2FA wherever possible
- Check haveibeenpwned.com regularly`,
    why_it_matters: "Billions of credentials are leaked annually. If you reuse passwords, a breach anywhere becomes a breach everywhere.",
    difficulty: "beginner",
    order_index: 8,
  },
  {
    module_id: "two-factor-auth",
    title: "Two-Factor Authentication Importance",
    description: "Add an extra layer of security beyond passwords",
    category: "Credential Safety",
    attack_type: "credential_theft",
    content: `Types of 2FA (from weakest to strongest):

1. SMS CODES - Better than nothing, vulnerable to SIM swap
2. EMAIL CODES - Risky if email is compromised
3. AUTHENTICATOR APPS - Much more secure (TOTP)
4. HARDWARE KEYS - Most secure (YubiKey, etc.)

Enable 2FA on:
- Email accounts (most critical!)
- Banking and financial accounts
- Social media
- Work accounts`,
    why_it_matters: "Even if your password is stolen, 2FA blocks unauthorized access. It's your last line of defense against credential theft.",
    difficulty: "beginner",
    order_index: 9,
  },
  // Malware & Ransomware
  {
    module_id: "ransomware-basics",
    title: "What Ransomware Actually Is",
    description: "Understanding the ransomware threat landscape",
    category: "Malware & Ransomware",
    attack_type: "ransomware",
    content: `Ransomware is malware that:

1. ENCRYPTS your files with a secret key
2. DEMANDS payment (usually cryptocurrency)
3. THREATENS to delete or leak data

Common infection vectors:
- Phishing email attachments
- Malicious downloads
- Exploited vulnerabilities
- Compromised websites

Modern ransomware often:
- Spreads across networks
- Steals data before encrypting
- Targets backups first`,
    why_it_matters: "Ransomware can destroy entire organizations. Understanding how it works is the first step to preventing infection.",
    difficulty: "intermediate",
    order_index: 10,
  },
  {
    module_id: "ransom-payment-risks",
    title: "Why Paying Ransom is Dangerous",
    description: "The risks and consequences of ransom payments",
    category: "Malware & Ransomware",
    attack_type: "ransomware",
    content: `Why you should NOT pay ransom:

1. NO GUARANTEE of decryption key
2. FUNDS criminal operations
3. MARKS you as a paying target
4. May VIOLATE laws (OFAC sanctions)
5. Decryptors may be FAULTY

Instead:
- Report to law enforcement
- Check for free decryptors (nomoreransom.org)
- Restore from backups
- Engage incident response experts`,
    why_it_matters: "Paying ransom perpetuates the criminal ecosystem and doesn't guarantee recovery. Prevention and backups are your best defense.",
    difficulty: "intermediate",
    order_index: 11,
  },
  {
    module_id: "backup-recovery",
    title: "Backup & Recovery Basics",
    description: "Protect your data with proper backup strategies",
    category: "Malware & Ransomware",
    attack_type: "ransomware",
    content: `The 3-2-1 Backup Rule:

3 - Keep THREE copies of data
2 - On TWO different media types
1 - With ONE copy offsite/offline

Backup best practices:
- Test restores regularly
- Keep backups OFFLINE (air-gapped)
- Encrypt backup data
- Automate the process
- Document recovery procedures`,
    why_it_matters: "Good backups make ransomware attacks an inconvenience rather than a catastrophe. They're your insurance policy against data loss.",
    difficulty: "beginner",
    order_index: 12,
  },
  // General Cyber Awareness
  {
    module_id: "social-engineering-psychology",
    title: "Social Engineering Psychology",
    description: "The human vulnerabilities attackers exploit",
    category: "General Cyber Awareness",
    attack_type: "social_engineering",
    content: `Psychological principles attackers use:

• RECIPROCITY: "I helped you, now help me"
• AUTHORITY: Impersonating bosses or IT
• SOCIAL PROOF: "Everyone else did this"
• LIKING: Building rapport before the ask
• COMMITMENT: Small requests leading to big ones
• SCARCITY: Limited time or availability

Defense: Always verify through separate channels.`,
    why_it_matters: "Humans are the weakest link in security. Understanding manipulation tactics makes you resistant to social engineering.",
    difficulty: "intermediate",
    order_index: 13,
  },
  {
    module_id: "zero-trust-mindset",
    title: "Zero-Trust Mindset (Simplified)",
    description: "Never trust, always verify - even inside your network",
    category: "General Cyber Awareness",
    attack_type: "general",
    content: `Zero Trust Principles:

1. VERIFY EXPLICITLY
   - Always authenticate and authorize
   - Don't assume trust based on location

2. LEAST PRIVILEGE ACCESS
   - Give minimum necessary permissions
   - Remove access when not needed

3. ASSUME BREACH
   - Act as if attackers are already inside
   - Segment networks and limit blast radius`,
    why_it_matters: "Traditional perimeter security is obsolete. Zero trust acknowledges that threats can come from anywhere, even inside.",
    difficulty: "intermediate",
    order_index: 14,
  },
  {
    module_id: "incident-reporting",
    title: "Incident Reporting Best Practices",
    description: "How to report security incidents effectively",
    category: "General Cyber Awareness",
    attack_type: "general",
    content: `When you suspect an incident:

1. DON'T PANIC or try to fix it yourself
2. DON'T DELETE evidence or forward suspicious emails
3. DO report immediately to IT/Security
4. DO document what you saw and when
5. DO disconnect if instructed (but don't power off)

What to report:
- Suspicious emails or messages
- Unexpected system behavior
- Unusual access requests
- Lost or stolen devices`,
    why_it_matters: "Quick reporting limits damage. Security teams can't respond to threats they don't know about. Your vigilance protects everyone.",
    difficulty: "beginner",
    order_index: 15,
  },
];

// Attack scenarios for simulation - 15+ required
export const ATTACK_SCENARIOS = [
  // Phishing Scenarios (6)
  {
    scenario_id: "phishing-bank-alert",
    type: "phishing",
    title: "Urgent Bank Security Alert",
    difficulty: "easy",
    related_module_id: "phishing-identification",
    content: {
      type: "email",
      from: "security-alert@bankof-america-secure.com",
      to: "you@company.com",
      subject: "URGENT: Suspicious Activity Detected on Your Account",
      body: `Dear Valued Customer,

We have detected unusual login activity on your Bank of America account from an unrecognized device in Russia.

Your account access will be SUSPENDED within 24 hours unless you verify your identity.

Click here to verify your account immediately:
https://bankof-america-secure.com/verify-account

If you do not verify within 24 hours, your account will be permanently locked for security reasons.

Thank you for your immediate attention to this matter.

Bank of America Security Team`,
      attachments: [],
      red_flags: ["Fake domain", "Urgency tactics", "Generic greeting", "Suspicious link"],
    },
    correct_action: "report_phishing",
    explanation: "This is a classic phishing email. The domain 'bankof-america-secure.com' is not Bank of America's real domain (bankofamerica.com). The urgency and threatening language are manipulation tactics designed to bypass your critical thinking.",
  },
  {
    scenario_id: "phishing-hr-benefits",
    type: "phishing",
    title: "HR Benefits Update Request",
    difficulty: "medium",
    related_module_id: "urgency-tactics",
    content: {
      type: "email",
      from: "hr-benefits@company-portal.net",
      to: "you@company.com",
      subject: "Action Required: Update Your Benefits Information",
      body: `Hello Team Member,

As part of our annual benefits enrollment, all employees must update their direct deposit and tax information by Friday.

Please access the HR Portal to update your information:
https://company-portal.net/hr/benefits/update

Required information:
- Full legal name
- Social Security Number
- Bank account details

Failure to complete this by Friday will result in delayed paychecks.

Thank you,
Human Resources Department`,
      attachments: [],
      red_flags: ["External domain", "Requests SSN", "Urgency with deadline", "Bank details requested"],
    },
    correct_action: "report_phishing",
    explanation: "This phishing attempt impersonates HR to steal sensitive information. Legitimate HR would never ask for SSN and bank details via email link. Always access HR portals through your company's official intranet.",
  },
  {
    scenario_id: "phishing-cloud-storage",
    type: "phishing",
    title: "Cloud Storage Share Notification",
    difficulty: "medium",
    related_module_id: "domain-spoofing",
    content: {
      type: "email",
      from: "no-reply@dropbox-sharing.com",
      to: "you@company.com",
      subject: "John Smith shared 'Q4 Financial Report.pdf' with you",
      body: `John Smith shared a file with you

Q4 Financial Report.pdf (2.4 MB)

This file contains sensitive financial data for your review.

[View Document]
https://dropbox-sharing.com/view/Q4-Financial-Report

This link will expire in 7 days.

The Dropbox Team`,
      attachments: [],
      red_flags: ["Fake Dropbox domain", "Unknown sender", "Sensitive content claim"],
    },
    correct_action: "report_phishing",
    explanation: "This spoofs Dropbox (real domain: dropbox.com). The 'dropbox-sharing.com' domain is fake. Always verify shared files through the official Dropbox app or by contacting the sender directly.",
  },
  {
    scenario_id: "phishing-it-password",
    type: "phishing",
    title: "IT Department Password Expiry",
    difficulty: "hard",
    related_module_id: "safe-link-hovering",
    content: {
      type: "email",
      from: "it-helpdesk@yourcompany.com",
      to: "you@company.com",
      subject: "Password Expiry Notice - Action Required Today",
      body: `IT Security Notice

Your network password will expire in 2 hours.

To maintain access to company systems, please reset your password using the link below:

Reset Password: https://password-reset.yourcompany.com.attackersite.ru/reset

Note: You will need to enter your current password to verify your identity.

IT Help Desk
Extension: 4357`,
      attachments: [],
      red_flags: ["Subdomain trick", "Current password request", "Russian domain"],
    },
    correct_action: "report_phishing",
    explanation: "This is a sophisticated attack using subdomain spoofing. The URL appears to be yourcompany.com but is actually hosted on attackersite.ru. Always navigate directly to password reset tools through your company intranet.",
  },
  {
    scenario_id: "phishing-invoice",
    type: "phishing",
    title: "Overdue Invoice Payment",
    difficulty: "easy",
    related_module_id: "phishing-identification",
    content: {
      type: "email",
      from: "accounting@vendor-payments.biz",
      to: "you@company.com",
      subject: "OVERDUE: Invoice #INV-2024-5847 - Immediate Payment Required",
      body: `PAYMENT REMINDER

Invoice #INV-2024-5847 is now 30 days overdue!

Amount Due: $4,750.00
Due Date: PAST DUE

Your account will be sent to collections if payment is not received within 48 hours.

Click here to pay now and avoid collection fees:
https://vendor-payments.biz/pay-invoice-INV-2024-5847

Accounting Department
Vendor Solutions Inc.`,
      attachments: ["Invoice_INV-2024-5847.pdf"],
      red_flags: ["Unknown vendor", "Urgency tactics", "Threatening collections", "Generic domain"],
    },
    correct_action: "report_phishing",
    explanation: "This is a business email compromise attempt. Verify all invoice payments through your accounting department and never pay vendors you don't recognize through email links.",
  },
  {
    scenario_id: "phishing-ceo-wire",
    type: "phishing",
    title: "CEO Urgent Wire Transfer Request",
    difficulty: "hard",
    related_module_id: "social-engineering-psychology",
    content: {
      type: "email",
      from: "ceo@company.com",
      to: "you@company.com",
      subject: "Urgent - Confidential",
      body: `Hey,

I'm in a meeting and can't talk but need you to handle something urgently for me.

We're closing an acquisition deal today and I need a wire transfer processed immediately. This is highly confidential - don't discuss with anyone else yet.

Can you let me know when you're available? I'll send the details.

Sent from my iPhone`,
      attachments: [],
      red_flags: ["Urgency", "Secrecy request", "Wire transfer", "Mobile signature"],
    },
    correct_action: "report_phishing",
    explanation: "This is CEO fraud/whaling. The 'From' address can be spoofed. The combination of urgency, secrecy, and financial request is a major red flag. Always verify such requests through a separate communication channel.",
  },
  // Fake Login Scenarios (5)
  {
    scenario_id: "fake-login-google",
    type: "fake_login",
    title: "Google Account Verification",
    difficulty: "easy",
    related_module_id: "fake-login-pages",
    content: {
      type: "login_page",
      url: "https://googIe.com/accounts/signin",
      page_title: "Sign in - Google Accounts",
      form_fields: ["Email or phone", "Password"],
      visual_issues: ["Capital I instead of lowercase l in URL", "Missing security features"],
      ssl_status: "valid",
    },
    correct_action: "close_page",
    explanation: "This uses a homograph attack - 'googIe.com' (capital I) instead of 'google.com' (lowercase L). Always type important URLs directly or use bookmarks. Check the URL character by character for sensitive sites.",
  },
  {
    scenario_id: "fake-login-office365",
    type: "fake_login",
    title: "Microsoft Office 365 Login",
    difficulty: "medium",
    related_module_id: "https-explained",
    content: {
      type: "login_page",
      url: "https://login.microsoftonline.com.secure-verify.net/oauth2",
      page_title: "Sign in to your account",
      form_fields: ["Email", "Password"],
      visual_issues: ["Subdomain attack", "Slightly different styling"],
      ssl_status: "valid",
    },
    correct_action: "close_page",
    explanation: "This is a subdomain attack. The real Microsoft login is at login.microsoftonline.com, not 'login.microsoftonline.com.secure-verify.net'. The attacker's domain is 'secure-verify.net'.",
  },
  {
    scenario_id: "fake-login-erp",
    type: "fake_login",
    title: "College ERP Portal Login",
    difficulty: "medium",
    related_module_id: "credential-harvesting",
    content: {
      type: "login_page",
      url: "http://erp-portal.university-login.com/student",
      page_title: "University ERP - Student Portal",
      form_fields: ["Student ID", "Password", "Date of Birth"],
      visual_issues: ["HTTP not HTTPS", "Extra field (DOB)", "Generic domain"],
      ssl_status: "none",
    },
    correct_action: "close_page",
    explanation: "Multiple red flags: no HTTPS (data sent in plain text), requests extra personal info (DOB), and uses a generic domain instead of the university's official domain. Never enter credentials on HTTP pages.",
  },
  {
    scenario_id: "fake-login-bank",
    type: "fake_login",
    title: "Online Banking Portal",
    difficulty: "hard",
    related_module_id: "domain-spoofing",
    content: {
      type: "login_page",
      url: "https://secure.chase-verify.com/auth/login",
      page_title: "Chase - Sign in",
      form_fields: ["Username", "Password", "Social Security Number (last 4 digits)"],
      visual_issues: ["Wrong domain", "SSN request on login", "Slightly off branding"],
      ssl_status: "valid",
    },
    correct_action: "close_page",
    explanation: "Real Chase banking is at chase.com, not 'chase-verify.com'. Banks never ask for SSN during login. The valid SSL certificate proves only that the connection is encrypted - not that the site is legitimate.",
  },
  {
    scenario_id: "fake-login-vpn",
    type: "fake_login",
    title: "Corporate VPN Portal",
    difficulty: "hard",
    related_module_id: "zero-trust-mindset",
    content: {
      type: "login_page",
      url: "https://vpn-company.secure-remote.net/login",
      page_title: "Corporate VPN Access",
      form_fields: ["Username", "Password", "Hardware Token Code"],
      visual_issues: ["External domain", "Requests 2FA code upfront"],
      ssl_status: "valid",
    },
    correct_action: "close_page",
    explanation: "Corporate VPN should be on your company's domain. This page hosted on 'secure-remote.net' is attempting to capture both your credentials AND 2FA code simultaneously - a real-time phishing attack.",
  },
  // Ransomware Scenarios (4)
  {
    scenario_id: "ransomware-home",
    type: "ransomware",
    title: "Personal Computer Ransomware",
    difficulty: "easy",
    related_module_id: "ransomware-basics",
    content: {
      type: "popup",
      title: "YOUR FILES HAVE BEEN ENCRYPTED!",
      message: `All your photos, documents, and personal files have been encrypted with military-grade encryption.

To decrypt your files, you must pay 0.5 Bitcoin ($15,000) within 72 hours.

After 72 hours, your files will be permanently deleted.

DO NOT attempt to decrypt files yourself - this will destroy them.
DO NOT contact the police - we will delete everything.

Bitcoin Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

Send payment and your files will be restored within 24 hours.`,
      timer: "71:59:45",
      background_color: "red",
    },
    correct_action: "disconnect_report",
    explanation: "This is ransomware. DO NOT pay - there's no guarantee of decryption, and you'll be marked as a paying target. Disconnect from the network, report to IT/authorities, and restore from backups if available.",
  },
  {
    scenario_id: "ransomware-corporate",
    type: "ransomware",
    title: "Corporate Network Ransomware",
    difficulty: "medium",
    related_module_id: "ransom-payment-risks",
    content: {
      type: "popup",
      title: "LOCKBIT 3.0 - YOUR NETWORK IS COMPROMISED",
      message: `Attention Network Administrator,

We have encrypted all servers and workstations on your corporate network.

Additionally, we have exfiltrated 500GB of sensitive data including:
- Customer databases
- Financial records
- Employee information
- Trade secrets

RANSOM: $500,000 in Bitcoin
DEADLINE: 5 days

If payment is not received, all data will be published on our leak site.

Contact us at: lockbit@onionmail.com

DO NOT CONTACT LAW ENFORCEMENT`,
      timer: "119:59:59",
      background_color: "black",
    },
    correct_action: "disconnect_report",
    explanation: "This is double-extortion ransomware (encrypt + threaten to leak). Immediately isolate affected systems, engage incident response, and contact law enforcement. Payment funds criminal operations and doesn't guarantee data safety.",
  },
  {
    scenario_id: "ransomware-fake-support",
    type: "ransomware",
    title: "Tech Support Scam Popup",
    difficulty: "easy",
    related_module_id: "backup-recovery",
    content: {
      type: "popup",
      title: "MICROSOFT SECURITY ALERT",
      message: `⚠️ YOUR COMPUTER HAS BEEN INFECTED ⚠️

Windows has detected a critical security breach!

Your computer is infected with:
- Trojan.Win32.Generic
- Spyware.Keylogger
- Ransomware.WannaCry

DO NOT RESTART YOUR COMPUTER
Your files and banking information are at risk!

Call Microsoft Support immediately:
1-800-555-0123

Our certified technicians will remove the virus and protect your data.

CALL NOW - This line closes in 5 minutes!`,
      timer: "04:59",
      background_color: "blue",
    },
    correct_action: "close_page",
    explanation: "This is a tech support scam, not actual ransomware. Microsoft never displays phone numbers in security alerts. Close the browser (use Task Manager if needed), run a legitimate antivirus scan, and never call numbers from popups.",
  },
  {
    scenario_id: "ransomware-download",
    type: "ransomware",
    title: "Suspicious Download Prompt",
    difficulty: "medium",
    related_module_id: "incident-reporting",
    content: {
      type: "popup",
      title: "Flash Player Update Required",
      message: `Your version of Adobe Flash Player is outdated!

This website requires the latest Flash Player to display content properly.

[DOWNLOAD UPDATE NOW]

Version: 34.0.0.465
Size: 2.4 MB
Publisher: Adobe Systems

Note: This update contains critical security patches.`,
      download_file: "FlashPlayerUpdate.exe",
      background_color: "gray",
    },
    correct_action: "close_page",
    explanation: "Adobe Flash Player was discontinued in 2020. This is malware disguised as a legitimate update. Never download software from popup prompts - only from official sources. Report this to IT security.",
  },
];

// Score calculation rules
export const SCORING_RULES = {
  correct_action: {
    easy: 100,
    medium: 150,
    hard: 200,
  },
  incorrect_action: {
    easy: -50,
    medium: -75,
    hard: -100,
  },
  time_bonus: {
    fast: 25, // Under 30 seconds
    medium: 10, // Under 60 seconds
    slow: 0, // Over 60 seconds
  },
  module_completion_bonus: 50,
};

// Action types and their labels
export const ACTION_LABELS = {
  report_phishing: "Report as Phishing",
  click_link: "Click the Link",
  reply_email: "Reply to Email",
  forward_email: "Forward Email",
  delete_email: "Delete Email",
  close_page: "Close Page Immediately",
  enter_credentials: "Enter Credentials",
  call_number: "Call the Number",
  pay_ransom: "Pay Ransom",
  disconnect_report: "Disconnect & Report to IT",
  ignore: "Ignore and Continue",
};
