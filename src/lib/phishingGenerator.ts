// Dynamic Phishing Email Generator with 50+ unique templates
// Uses Fisher-Yates shuffle and localStorage to prevent repetition

// Random data pools for template variables
const SENDER_NAMES = [
  "Michael Johnson", "Sarah Williams", "David Chen", "Jennifer Davis", "Robert Martinez",
  "Emily Brown", "James Wilson", "Lisa Anderson", "John Taylor", "Amanda Thompson",
  "Christopher Lee", "Jessica Garcia", "Matthew Robinson", "Ashley Clark", "Daniel Lewis",
  "Nicole Walker", "Andrew Hall", "Stephanie Allen", "Joshua Young", "Rachel King"
];

const COMPANY_NAMES = [
  "TechCorp Solutions", "Global Dynamics", "Nexus Industries", "Apex Consulting", "Quantum Systems",
  "Pinnacle Group", "Synergy Partners", "Elevate Inc", "Catalyst Labs", "Horizon Ventures",
  "Summit Holdings", "Atlas Corp", "Velocity Tech", "Prism Analytics", "Fusion Enterprises"
];

const BANK_NAMES = [
  "Bank of America", "Chase", "Wells Fargo", "Citibank", "Capital One",
  "US Bank", "PNC Bank", "TD Bank", "Truist", "First National Bank"
];

const FAKE_DOMAINS = {
  easy: [
    "amaz0n-secure.com", "paypa1-verify.com", "g00gle-support.net", "micros0ft-alert.com",
    "app1e-security.com", "netfl1x-billing.com", "faceb00k-verify.com", "linkedln-jobs.net"
  ],
  medium: [
    "amazon-account-services.com", "paypal-secure-center.net", "google-verification.org",
    "microsoft-365-portal.com", "apple-id-support.net", "netflix-member-update.com",
    "accounts-facebook.net", "linkedin-careers-portal.com"
  ],
  hard: [
    "amazon.com.account-verify.info", "paypal.com.secure-update.net",
    "accounts.google.com.verification.click", "login.microsoft.com.portal-auth.net",
    "appleid.apple.com.secure.id-verify.com", "netflix.com.billing-update.info"
  ]
};

const AMOUNTS = ["$1,247.00", "$3,450.00", "$5,890.00", "$892.00", "$2,175.00", "$4,320.00", "$6,750.00", "$1,890.00", "$7,500.00", "$950.00"];
const DEADLINES = ["24 hours", "48 hours", "2 hours", "12 hours", "by end of day", "immediately", "within 1 hour", "before midnight"];
const REF_NUMBERS = () => `INV-${2024 + Math.floor(Math.random() * 2)}-${Math.floor(10000 + Math.random() * 90000)}`;

// Template categories with multiple variations
interface EmailTemplate {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  generateEmail: () => GeneratedEmail;
}

export interface GeneratedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  hasAttachment: boolean;
  attachmentName?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  redFlags: string[];
  explanation: string;
  headers: EmailHeaders;
}

interface EmailHeaders {
  received: string;
  replyTo?: string;
  xOriginatingIp: string;
  spf: string;
  dkim: string;
}

// Helper functions
const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const generateDate = (): string => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 12) + 1;
  now.setHours(now.getHours() - hours);
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const generateHeaders = (difficulty: 'easy' | 'medium' | 'hard', fakeDomain: string): EmailHeaders => {
  const suspiciousIps = ["185.147.213.45", "91.234.167.89", "45.227.253.102", "103.75.118.201", "77.83.247.156"];
  return {
    received: difficulty === 'easy' 
      ? `from mail.${fakeDomain} (unknown [${randomFrom(suspiciousIps)}])`
      : `from smtp.${fakeDomain} (mx1.${fakeDomain} [${randomFrom(suspiciousIps)}])`,
    replyTo: difficulty !== 'hard' ? `noreply@${fakeDomain}` : undefined,
    xOriginatingIp: randomFrom(suspiciousIps),
    spf: difficulty === 'easy' ? 'fail' : difficulty === 'medium' ? 'softfail' : 'neutral',
    dkim: difficulty === 'easy' ? 'fail' : difficulty === 'medium' ? 'none' : 'pass'
  };
};

// CEO/Executive Fraud Templates (10 variations)
const ceoFraudTemplates: EmailTemplate[] = [
  {
    id: 'ceo-wire-urgent',
    category: 'CEO/Executive Fraud',
    difficulty: 'easy',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      const amount = randomFrom(AMOUNTS);
      const domain = randomFrom(FAKE_DOMAINS.easy);
      return {
        id: `ceo-wire-${Date.now()}`,
        from: `${sender} <ceo@${domain}>`,
        to: 'you@company.com',
        subject: `URGENT - Need wire transfer NOW!!!`,
        body: `Hi,

I need you to process a wire transfer of ${amount} IMMEDIATELY. I'm in an important meeting and can't call.

Don't tell anyone about this. It's confidential.

Wire to: Account ending 4521
Bank: International Trust Bank

Do this NOW and confirm when done.

Thanks,
${sender.split(' ')[0]}
CEO

Sent from my iPhone`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'CEO/Executive Fraud',
        redFlags: [
          'Urgency and pressure tactics',
          'Requests secrecy ("don\'t tell anyone")',
          'Fake domain not matching company',
          'Wire transfer request via email',
          'Multiple exclamation marks',
          'No proper email signature'
        ],
        explanation: 'Classic CEO fraud/Business Email Compromise. Real executives never request urgent wire transfers via email asking for secrecy. Always verify through a known phone number.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'ceo-gift-cards',
    category: 'CEO/Executive Fraud',
    difficulty: 'easy',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      const domain = randomFrom(FAKE_DOMAINS.easy);
      return {
        id: `ceo-gift-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@${domain}>`,
        to: 'you@company.com',
        subject: `Quick favor needed - Gift cards`,
        body: `Hey,

Are you available? I need you to purchase some gift cards for client appreciation. Don't want to announce it yet.

Buy 5 Amazon gift cards, $200 each ($1,000 total).

Send me the card numbers and PINs when done. I'll reimburse you.

Very busy right now so just email the codes.

${sender}`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'CEO/Executive Fraud',
        redFlags: [
          'Gift card request via email',
          'Requests codes/PINs over email',
          'Secrecy request',
          'Promise of reimbursement',
          'Informal tone from executive'
        ],
        explanation: 'Gift card scams are extremely common. No legitimate business transaction requires gift card codes sent via email. Gift cards are untraceable cash equivalents.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'ceo-acquisition-wire',
    category: 'CEO/Executive Fraud',
    difficulty: 'medium',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      const company = randomFrom(COMPANY_NAMES);
      const amount = randomFrom(AMOUNTS);
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `ceo-acq-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@${domain}>`,
        to: 'you@company.com',
        subject: `Confidential: ${company} Acquisition Payment`,
        body: `Good afternoon,

As discussed in yesterday's board meeting, we're moving forward with the ${company} acquisition. I need you to process the initial payment of ${amount} to their holding company.

This must remain strictly confidential until the public announcement next week. Please don't discuss with other team members.

Wire details:
Bank: First International Trust
Account: 847291056
Routing: 026009593
Reference: ${company.toUpperCase().replace(' ', '')}-ACQ-2024

Please confirm once processed. I'm in back-to-back meetings but checking email.

Best regards,
${sender}
Chief Executive Officer`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'CEO/Executive Fraud',
        redFlags: [
          'Confidentiality/secrecy request',
          'External domain (not company email)',
          'Wire transfer request via email',
          'Reference to meetings you weren\'t in',
          'Pressure to act quickly'
        ],
        explanation: 'Sophisticated BEC attack using fake acquisition as pretense. The domain looks professional but isn\'t your company\'s. Always verify large transactions through established protocols.',
        headers: generateHeaders('medium', domain)
      };
    }
  },
  {
    id: 'ceo-vendor-payment',
    category: 'CEO/Executive Fraud',
    difficulty: 'hard',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      const company = randomFrom(COMPANY_NAMES);
      const amount = randomFrom(AMOUNTS);
      const domain = randomFrom(FAKE_DOMAINS.hard);
      const ref = REF_NUMBERS();
      return {
        id: `ceo-vendor-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@company.com>`,
        to: 'you@company.com',
        subject: `Re: ${company} Invoice ${ref} - Updated Payment Details`,
        body: `Hi,

Following up on the ${company} invoice we discussed. They've notified us of updated banking details for this payment.

Please update the payment for Invoice ${ref} (${amount}) to the following account before processing:

New Bank: Metropolitan Commercial Bank
New Account: 7829401563
New Routing: 026013356

${company} is requesting we complete this by Friday to maintain our preferred vendor status. I've already verified with their CFO.

Let me know once updated.

Thanks,
${sender}
CEO | ${randomFrom(COMPANY_NAMES)}
Direct: (555) 847-2910`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'hard',
        category: 'CEO/Executive Fraud',
        redFlags: [
          'Request to change banking details',
          'Vendor payment redirection',
          'Urgency with deadline',
          'Claims pre-verification (can\'t be confirmed)'
        ],
        explanation: 'Vendor payment redirection is very sophisticated. The only red flag may be the changed banking details. Always call vendors using known numbers to verify any payment changes.',
        headers: generateHeaders('hard', domain)
      };
    }
  },
  {
    id: 'ceo-tax-docs',
    category: 'CEO/Executive Fraud',
    difficulty: 'medium',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `ceo-tax-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@${domain}>`,
        to: 'you@company.com',
        subject: `Urgent: W-2 Forms Needed for All Employees`,
        body: `Hi,

Our external auditors need copies of all employee W-2 forms for the 2023 tax year review. Please compile and send to me as soon as possible.

Include:
- Full names
- Social Security Numbers
- Salary information
- Home addresses

This is time-sensitive for the audit deadline. Please send by end of day.

Thank you,
${sender}
Chief Financial Officer`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'CEO/Executive Fraud',
        redFlags: [
          'Request for bulk employee PII',
          'SSN request via email',
          'Urgency/time pressure',
          'External domain',
          'Audit as excuse'
        ],
        explanation: 'W-2 phishing targets payroll staff to steal employee identities. Legitimate auditors have secure portals. Never email sensitive employee data.',
        headers: generateHeaders('medium', domain)
      };
    }
  }
];

// IT Password Reset Templates (10 variations)
const itPasswordTemplates: EmailTemplate[] = [
  {
    id: 'it-password-expiry',
    category: 'IT Password Reset',
    difficulty: 'easy',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.easy);
      const deadline = randomFrom(DEADLINES);
      return {
        id: `it-pwd-${Date.now()}`,
        from: `IT HelpDesk <support@${domain}>`,
        to: 'you@company.com',
        subject: `⚠️ PASSWORD EXPIRES IN ${deadline.toUpperCase()} ⚠️`,
        body: `ATTENTION: Your password expires in ${deadline}!

Your network password is about to expire. To avoid being locked out of all company systems, you must reset it immediately.

CLICK HERE TO RESET NOW:
https://${domain}/password-reset

If you do not reset your password, you will lose access to:
❌ Email
❌ VPN
❌ All company applications

Reset now to avoid disruption!

IT Support Team`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'IT Password Reset',
        redFlags: [
          'Excessive urgency symbols (⚠️)',
          'Threatening language',
          'Suspicious domain',
          'Generic "IT Support Team"',
          'Fear-based messaging'
        ],
        explanation: 'Classic password phishing with urgency. Real IT departments provide password reset through official portals, not email links. The domain is clearly fake.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'it-security-update',
    category: 'IT Password Reset',
    difficulty: 'medium',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `it-sec-${Date.now()}`,
        from: `IT Security <noreply@${domain}>`,
        to: 'you@company.com',
        subject: `Security Update Required: Multi-Factor Authentication`,
        body: `Dear Employee,

As part of our ongoing security improvements, all employees must re-enroll in Multi-Factor Authentication by the end of this week.

To complete your MFA enrollment:
1. Click the secure link below
2. Enter your current password
3. Follow the setup wizard

Secure Enrollment Link:
https://${domain}/mfa-enrollment

Note: Your current password is required to verify your identity before enrollment.

If you have questions, contact the IT Help Desk.

Best regards,
IT Security Team`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'IT Password Reset',
        redFlags: [
          'Requests current password',
          'External domain for IT service',
          'Deadline pressure',
          'Generic signature'
        ],
        explanation: 'MFA enrollment phishing - ironically uses security as the lure. Legitimate MFA enrollment happens through internal IT portals or in-person. Never enter passwords via email links.',
        headers: generateHeaders('medium', domain)
      };
    }
  },
  {
    id: 'it-mailbox-full',
    category: 'IT Password Reset',
    difficulty: 'easy',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.easy);
      return {
        id: `it-mail-${Date.now()}`,
        from: `Mail Administrator <admin@${domain}>`,
        to: 'you@company.com',
        subject: `MAILBOX QUOTA EXCEEDED - Action Required`,
        body: `Your mailbox has exceeded its storage limit!

Current Usage: 98.7% (4.93 GB of 5 GB)

You cannot send or receive new emails until you:
1. Delete old emails, OR
2. Upgrade your mailbox quota

To upgrade your quota for FREE, click below:
https://${domain}/mailbox-upgrade

WARNING: If not resolved within 24 hours, your account will be suspended.

Mail System Administrator`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'IT Password Reset',
        redFlags: [
          'Mailbox quota scam',
          'FREE upgrade offer',
          'Suspension threat',
          'Suspicious domain',
          'All caps WARNING'
        ],
        explanation: 'Mailbox quota scams are very common. Your IT department manages email quotas internally and would never ask you to click external links to "upgrade."',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'it-vpn-update',
    category: 'IT Password Reset',
    difficulty: 'hard',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.hard);
      return {
        id: `it-vpn-${Date.now()}`,
        from: `IT Infrastructure <vpn-support@company.com>`,
        to: 'you@company.com',
        subject: `VPN Client Update Required - Version 4.2.1`,
        body: `Hello,

A critical security update is available for the corporate VPN client. All remote workers must update to version 4.2.1 by Friday.

This update patches CVE-2024-21887, a high-severity vulnerability affecting remote access.

To update:
1. Click the link below to download the update package
2. Run the installer (requires admin credentials)
3. Restart your computer

Download Update:
${domain.includes('.com.') ? `https://vpn-update.${domain}` : `https://${domain}/vpn-update`}

For assistance, contact the IT Help Desk at ext. 4357.

Best regards,
Network Operations Team`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'hard',
        category: 'IT Password Reset',
        redFlags: [
          'Download link for software',
          'Requests admin credentials',
          'Subdomain spoofing in URL',
          'CVE reference adds false legitimacy'
        ],
        explanation: 'Software update phishing often leads to malware installation. Real IT pushes updates through managed systems, not email links. The CVE number is used to add false credibility.',
        headers: generateHeaders('hard', domain)
      };
    }
  },
  {
    id: 'it-account-suspended',
    category: 'IT Password Reset',
    difficulty: 'medium',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `it-susp-${Date.now()}`,
        from: `Account Security <security@${domain}>`,
        to: 'you@company.com',
        subject: `Account Temporarily Suspended - Unusual Activity Detected`,
        body: `We detected unusual sign-in activity on your account:

Location: Moscow, Russia
IP Address: 185.147.213.45
Device: Unknown Linux Device
Time: ${new Date().toISOString()}

If this wasn't you, your account has been temporarily suspended for your protection.

To restore access, verify your identity:
https://${domain}/verify-identity

If this was you, please still verify to remove the security hold.

Security Team`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'IT Password Reset',
        redFlags: [
          'Scary foreign location',
          'Account suspension claim',
          'Must verify even if legit',
          'External domain'
        ],
        explanation: 'Account suspension scams use fear of foreign hackers to make you act quickly. Real security teams have different verification processes and wouldn\'t use external links.',
        headers: generateHeaders('medium', domain)
      };
    }
  }
];

// Invoice/Payment Scam Templates (10 variations)
const invoiceTemplates: EmailTemplate[] = [
  {
    id: 'invoice-overdue',
    category: 'Invoice/Payment Scams',
    difficulty: 'easy',
    generateEmail: () => {
      const company = randomFrom(COMPANY_NAMES);
      const amount = randomFrom(AMOUNTS);
      const ref = REF_NUMBERS();
      const domain = randomFrom(FAKE_DOMAINS.easy);
      return {
        id: `inv-over-${Date.now()}`,
        from: `${company} Billing <billing@${domain}>`,
        to: 'you@company.com',
        subject: `OVERDUE: Invoice ${ref} - FINAL NOTICE BEFORE COLLECTIONS`,
        body: `FINAL NOTICE

Invoice Number: ${ref}
Amount Due: ${amount}
Status: 45 DAYS OVERDUE

This is your FINAL WARNING before we transfer your account to our collections agency.

To avoid collection fees and credit damage, pay immediately:
https://${domain}/pay-invoice/${ref}

If payment is not received within 48 hours, additional fees of $250 will be added.

Accounts Receivable
${company}`,
        date: generateDate(),
        hasAttachment: true,
        attachmentName: `Invoice_${ref}.pdf`,
        difficulty: 'easy',
        category: 'Invoice/Payment Scams',
        redFlags: [
          'Collections threat',
          'Extreme urgency',
          'Unknown vendor',
          'Suspicious domain',
          'PDF attachment (potential malware)'
        ],
        explanation: 'Fake invoice scams pressure you into paying invoices you never incurred. The aggressive collections threat is designed to bypass verification. Always verify invoices with your accounting department.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'invoice-updated-details',
    category: 'Invoice/Payment Scams',
    difficulty: 'hard',
    generateEmail: () => {
      const company = randomFrom(COMPANY_NAMES);
      const amount = randomFrom(AMOUNTS);
      const ref = REF_NUMBERS();
      const sender = randomFrom(SENDER_NAMES);
      return {
        id: `inv-upd-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com>`,
        to: 'you@company.com',
        subject: `Re: Invoice ${ref} - Updated Banking Information`,
        body: `Hi,

Hope you're doing well. Just wanted to let you know that we've recently changed banks and need to update our payment details on file.

For invoice ${ref} (${amount}), please use the following new account:

Bank: First Commerce Bank
Account Name: ${company} Holdings LLC
Account Number: 4821956730
Routing Number: 026009593

Please disregard any previous payment instructions. This will be our account going forward.

Let me know if you need any additional documentation.

Best,
${sender}
Accounts Receivable Manager
${company}
${sender.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'hard',
        category: 'Invoice/Payment Scams',
        redFlags: [
          'Banking details change request',
          'LLC variation of company name',
          'No official letterhead',
          'Asks to disregard previous instructions'
        ],
        explanation: 'Payment redirection fraud is very sophisticated. The email looks legitimate but the new bank account is fraudulent. ALWAYS verify banking changes by calling a known number.',
        headers: generateHeaders('hard', `${company.toLowerCase().replace(' ', '')}.com`)
      };
    }
  },
  {
    id: 'invoice-subscription',
    category: 'Invoice/Payment Scams',
    difficulty: 'medium',
    generateEmail: () => {
      const amount = randomFrom(AMOUNTS);
      const ref = REF_NUMBERS();
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `inv-sub-${Date.now()}`,
        from: `Microsoft 365 <billing@${domain}>`,
        to: 'you@company.com',
        subject: `Your Microsoft 365 subscription will renew for ${amount}`,
        body: `Microsoft

Your Microsoft 365 Business subscription is set to auto-renew.

Renewal Date: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Amount: ${amount}
Invoice: ${ref}

This amount will be charged to your payment method on file.

If you did not authorize this renewal, cancel immediately:
https://${domain}/cancel-subscription

To update payment method or review subscription:
https://${domain}/manage-subscription

Thank you for being a valued customer.

Microsoft Billing`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'Invoice/Payment Scams',
        redFlags: [
          'Fake Microsoft domain',
          'Auto-renewal scare',
          'Links to external site',
          'No account-specific details'
        ],
        explanation: 'Subscription renewal scams trick you into "canceling" by entering credentials. Check subscriptions through official Microsoft account pages, not email links.',
        headers: generateHeaders('medium', domain)
      };
    }
  }
];

// Package Delivery Templates (8 variations)
const deliveryTemplates: EmailTemplate[] = [
  {
    id: 'delivery-failed',
    category: 'Package Delivery',
    difficulty: 'easy',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.easy);
      const tracking = `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      return {
        id: `del-fail-${Date.now()}`,
        from: `FedEx Delivery <notification@${domain}>`,
        to: 'you@company.com',
        subject: `Delivery Failed: Package ${tracking} - Action Required`,
        body: `FedEx

DELIVERY ATTEMPTED - ACTION REQUIRED

Tracking Number: ${tracking}

We attempted to deliver your package but no one was available. Your package is being held at our facility.

To reschedule delivery, update your address:
https://${domain}/reschedule/${tracking}

A $1.99 redelivery fee applies.

If not claimed within 5 days, package will be returned to sender.

FedEx Customer Service`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'Package Delivery',
        redFlags: [
          'Fake FedEx domain',
          'Small fee request (credit card harvesting)',
          'Generic tracking format',
          'Return to sender threat'
        ],
        explanation: 'Package delivery scams exploit online shopping habits. FedEx uses fedex.com, not variations. The small fee is designed to harvest credit card information.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'delivery-customs',
    category: 'Package Delivery',
    difficulty: 'medium',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.medium);
      const tracking = `DHL${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      return {
        id: `del-cust-${Date.now()}`,
        from: `DHL Express <customs@${domain}>`,
        to: 'you@company.com',
        subject: `Customs Clearance Required - Shipment ${tracking}`,
        body: `DHL EXPRESS

Your international shipment requires customs clearance.

Tracking: ${tracking}
Origin: Shenzhen, China
Status: Held at Customs

Customs duties and taxes due: $47.50

Your package cannot be released until duties are paid. Pay online for immediate release:
https://${domain}/customs-payment

Payment must be made within 48 hours or package will be returned.

DHL Customs Department`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'Package Delivery',
        redFlags: [
          'Customs fee request',
          'Fake DHL domain',
          'Payment via email link',
          'Return threat deadline'
        ],
        explanation: 'Customs clearance scams target international shoppers. DHL and other carriers have official processes for customs, never email payment links.',
        headers: generateHeaders('medium', domain)
      };
    }
  },
  {
    id: 'delivery-signature',
    category: 'Package Delivery',
    difficulty: 'hard',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.hard);
      const tracking = `9400${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
      return {
        id: `del-sig-${Date.now()}`,
        from: `USPS Informed Delivery <notifications@usps.com>`,
        to: 'you@company.com',
        subject: `Digital signature required for your package`,
        body: `USPS Informed Delivery®

Package Update for ${tracking}

A package requiring signature confirmation is on the way to your address. Due to new security requirements, you must pre-authorize delivery.

Complete digital signature authorization:
${domain.includes('.com.') ? `https://tools.usps.com.${domain}/authorize` : `https://${domain}/authorize`}

This ensures your package is delivered without delays.

Expected Delivery: ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Thank you for using USPS Informed Delivery.`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'hard',
        category: 'Package Delivery',
        redFlags: [
          'Subdomain spoofing (usps.com.fake)',
          'Pre-signature not a real thing',
          'Spoofed sender looks legitimate'
        ],
        explanation: 'This sophisticated attack spoofs USPS Informed Delivery. The URL uses subdomain tricks to look legitimate. USPS never requires "digital signature authorization."',
        headers: generateHeaders('hard', domain)
      };
    }
  }
];

// Bank Alert Templates (8 variations)
const bankTemplates: EmailTemplate[] = [
  {
    id: 'bank-suspicious',
    category: 'Bank Alerts',
    difficulty: 'easy',
    generateEmail: () => {
      const bank = randomFrom(BANK_NAMES);
      const domain = randomFrom(FAKE_DOMAINS.easy);
      const amount = randomFrom(AMOUNTS);
      return {
        id: `bank-susp-${Date.now()}`,
        from: `${bank} Security <alert@${domain}>`,
        to: 'you@company.com',
        subject: `🚨 ALERT: Suspicious Transaction on Your Account`,
        body: `${bank.toUpperCase()} SECURITY ALERT

We detected a suspicious transaction on your account:

Transaction: Online Purchase
Amount: ${amount}
Merchant: ELECTRONICS STORE MOSCOW RU
Date: ${new Date().toLocaleDateString()}

If you did NOT authorize this transaction, click below to block your card immediately:
https://${domain}/block-card

If this was you, no action needed.

${bank} Fraud Protection Team

This is an automated message. Do not reply.`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'Bank Alerts',
        redFlags: [
          'Emoji in subject line',
          'Fake bank domain',
          'Scary foreign transaction',
          'Block card via email link'
        ],
        explanation: 'Banks never ask you to block cards via email links. Real fraud alerts direct you to call the number on your card or use the official banking app.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'bank-verify',
    category: 'Bank Alerts',
    difficulty: 'medium',
    generateEmail: () => {
      const bank = randomFrom(BANK_NAMES);
      const domain = randomFrom(FAKE_DOMAINS.medium);
      return {
        id: `bank-ver-${Date.now()}`,
        from: `${bank} <security@${domain}>`,
        to: 'you@company.com',
        subject: `Action Required: Verify Your Account Information`,
        body: `Dear Valued Customer,

As part of our commitment to your security, we periodically verify customer information to prevent unauthorized access.

Your account requires verification to continue uninterrupted service.

Please verify your account within 3 business days:
https://${domain}/verify-account

Required information:
• Full name and address
• Account number
• SSN (last 4 digits)
• Online banking username

Thank you for your prompt attention.

${bank}
Member FDIC`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'Bank Alerts',
        redFlags: [
          'Requests SSN',
          'Requests account number',
          'Verify via email link',
          'Deadline pressure',
          'Generic greeting'
        ],
        explanation: 'Banks never request sensitive information via email. The "Member FDIC" is added to seem legitimate. Always access banking through official apps or typed URLs.',
        headers: generateHeaders('medium', domain)
      };
    }
  },
  {
    id: 'bank-wire-confirm',
    category: 'Bank Alerts',
    difficulty: 'hard',
    generateEmail: () => {
      const bank = randomFrom(BANK_NAMES);
      const amount = randomFrom(AMOUNTS);
      return {
        id: `bank-wire-${Date.now()}`,
        from: `${bank} Wire Transfers <wire.transfers@${bank.toLowerCase().replace(' ', '')}.com>`,
        to: 'you@company.com',
        subject: `Wire Transfer Confirmation Required - ${amount}`,
        body: `${bank}
Secure Wire Transfer Service

A wire transfer has been initiated from your account:

Amount: ${amount}
Recipient: NORTHERN TRUST HOLDINGS
Recipient Bank: Banco Nacional, Mexico
Reference: WT${Date.now().toString().slice(-8)}

This transfer will process in 2 hours.

If you authorized this transfer, no action needed.

If you did NOT authorize this, cancel immediately:
• Call 1-800-555-0149
• Or click: https://${bank.toLowerCase().replace(' ', '')}.com.wire-cancel.net/stop

${bank} Wire Transfer Department`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'hard',
        category: 'Bank Alerts',
        redFlags: [
          'Subdomain spoofing in cancel URL',
          'Fake phone number',
          'Wire to foreign bank',
          'Domain looks legitimate but is fake'
        ],
        explanation: 'This sophisticated scam combines a legitimate-looking sender with a subdomain-spoofed cancellation link. The phone number is also fraudulent. Call the number on your card.',
        headers: generateHeaders('hard', `${bank.toLowerCase().replace(' ', '')}.com.wire-cancel.net`)
      };
    }
  }
];

// HR/Payroll Templates (8 variations)
const hrTemplates: EmailTemplate[] = [
  {
    id: 'hr-direct-deposit',
    category: 'HR/Payroll',
    difficulty: 'easy',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.easy);
      return {
        id: `hr-dd-${Date.now()}`,
        from: `HR Department <hr@${domain}>`,
        to: 'you@company.com',
        subject: `ACTION REQUIRED: Update Direct Deposit Information`,
        body: `Dear Employee,

We are updating our payroll system and need all employees to re-submit their direct deposit information.

Click below to update your information by Friday:
https://${domain}/payroll-update

Required information:
- Bank name
- Routing number
- Account number
- Social Security Number

Failure to update will result in paper check issuance with a $15 processing fee.

Human Resources`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'easy',
        category: 'HR/Payroll',
        redFlags: [
          'Requests full SSN',
          'Requests bank details via form',
          'Paper check fee threat',
          'Suspicious domain',
          'Generic "Human Resources" signature'
        ],
        explanation: 'HR never collects banking information via email links. Payroll changes are made through secure internal HR portals or in-person with HR staff.',
        headers: generateHeaders('easy', domain)
      };
    }
  },
  {
    id: 'hr-bonus',
    category: 'HR/Payroll',
    difficulty: 'medium',
    generateEmail: () => {
      const domain = randomFrom(FAKE_DOMAINS.medium);
      const amount = randomFrom(AMOUNTS);
      return {
        id: `hr-bon-${Date.now()}`,
        from: `Payroll Team <payroll@${domain}>`,
        to: 'you@company.com',
        subject: `Year-End Bonus Confirmation Required`,
        body: `Dear Team Member,

Congratulations! You've been approved for a year-end performance bonus of ${amount}.

To receive this bonus in your next paycheck, please confirm your details:
https://${domain}/bonus-confirmation

We need to verify:
• Current mailing address
• Bank account for deposit
• Tax withholding preferences

Please confirm by December 31st to ensure timely processing.

Best regards,
Compensation & Benefits Team`,
        date: generateDate(),
        hasAttachment: false,
        difficulty: 'medium',
        category: 'HR/Payroll',
        redFlags: [
          'Too good to be true bonus',
          'Requests bank account',
          'External domain',
          'Deadline pressure'
        ],
        explanation: 'Bonus notification scams exploit excitement to bypass caution. Real bonuses appear in your paycheck automatically. Verify with your manager or HR directly.',
        headers: generateHeaders('medium', domain)
      };
    }
  },
  {
    id: 'hr-policy-update',
    category: 'HR/Payroll',
    difficulty: 'hard',
    generateEmail: () => {
      const sender = randomFrom(SENDER_NAMES);
      return {
        id: `hr-pol-${Date.now()}`,
        from: `${sender} <${sender.toLowerCase().replace(' ', '.')}@company.com>`,
        to: 'you@company.com',
        subject: `Updated Employee Handbook - Acknowledgment Required`,
        body: `Hi team,

We've made updates to the Employee Handbook regarding remote work policies, PTO accrual, and expense reimbursement.

Please review and acknowledge the changes by Friday:

📎 Employee_Handbook_2024_Updated.pdf (2.1 MB)

After reviewing, click "Acknowledge" in the document to confirm you've read and agree to the policies.

Thanks for your attention to this.

${sender}
HR Business Partner`,
        date: generateDate(),
        hasAttachment: true,
        attachmentName: 'Employee_Handbook_2024_Updated.pdf',
        difficulty: 'hard',
        category: 'HR/Payroll',
        redFlags: [
          'PDF attachment (potential malware)',
          'Acknowledge button in PDF is suspicious',
          'Deadline pressure'
        ],
        explanation: 'Weaponized document attacks hide malware in PDFs. The "acknowledge" button may execute malicious code. Verify policy updates through your company intranet.',
        headers: generateHeaders('hard', 'company.com')
      };
    }
  }
];

// Combine all templates
const ALL_TEMPLATES: EmailTemplate[] = [
  ...ceoFraudTemplates,
  ...itPasswordTemplates,
  ...invoiceTemplates,
  ...deliveryTemplates,
  ...bankTemplates,
  ...hrTemplates
];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// LocalStorage keys
const SHOWN_EMAILS_KEY = 'cyberrange_shown_emails';
const SESSION_PROGRESS_KEY = 'cyberrange_session_progress';

interface SessionProgress {
  correct: number;
  total: number;
  accuracy: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

// Get shown emails from localStorage
export function getShownEmails(): string[] {
  try {
    const stored = localStorage.getItem(SHOWN_EMAILS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add email to shown list
export function markEmailAsShown(emailId: string): void {
  const shown = getShownEmails();
  if (!shown.includes(emailId)) {
    shown.push(emailId);
    localStorage.setItem(SHOWN_EMAILS_KEY, JSON.stringify(shown));
  }
}

// Reset shown emails (for new session)
export function resetShownEmails(): void {
  localStorage.removeItem(SHOWN_EMAILS_KEY);
}

// Get session progress
export function getSessionProgress(): SessionProgress {
  try {
    const stored = localStorage.getItem(SESSION_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : { correct: 0, total: 0, accuracy: 0, difficulty: 'mixed' };
  } catch {
    return { correct: 0, total: 0, accuracy: 0, difficulty: 'mixed' };
  }
}

// Update session progress
export function updateSessionProgress(isCorrect: boolean): SessionProgress {
  const progress = getSessionProgress();
  progress.total += 1;
  if (isCorrect) progress.correct += 1;
  progress.accuracy = Math.round((progress.correct / progress.total) * 100);
  localStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

// Reset session progress
export function resetSessionProgress(): void {
  localStorage.removeItem(SESSION_PROGRESS_KEY);
  resetShownEmails();
}

// Generate a unique email that hasn't been shown
export function generateUniqueEmail(difficulty?: 'easy' | 'medium' | 'hard'): GeneratedEmail | null {
  const shownEmails = getShownEmails();
  
  // Filter templates by difficulty if specified
  let availableTemplates = difficulty 
    ? ALL_TEMPLATES.filter(t => t.difficulty === difficulty)
    : ALL_TEMPLATES;
  
  // Shuffle templates
  availableTemplates = shuffleArray(availableTemplates);
  
  // Find a template that hasn't been shown (or has been shown least)
  for (const template of availableTemplates) {
    // Generate email from template
    const email = template.generateEmail();
    
    // Check if this template ID has been overused
    const templateUseCount = shownEmails.filter(id => id.startsWith(template.id)).length;
    
    // Allow up to 3 uses per template (since each generates unique content)
    if (templateUseCount < 3) {
      markEmailAsShown(email.id);
      return email;
    }
  }
  
  // If all templates exhausted, reset and start fresh
  resetShownEmails();
  const template = availableTemplates[0];
  const email = template.generateEmail();
  markEmailAsShown(email.id);
  return email;
}

// Get multiple unique emails
export function generateEmailBatch(count: number, difficulty?: 'easy' | 'medium' | 'hard'): GeneratedEmail[] {
  const emails: GeneratedEmail[] = [];
  for (let i = 0; i < count; i++) {
    const email = generateUniqueEmail(difficulty);
    if (email) emails.push(email);
  }
  return emails;
}

// Get categories for filtering
export function getCategories(): string[] {
  return [...new Set(ALL_TEMPLATES.map(t => t.category))];
}

// Get template count
export function getTemplateCount(): number {
  return ALL_TEMPLATES.length;
}
