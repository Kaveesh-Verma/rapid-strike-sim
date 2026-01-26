import { VercelRequest, VercelResponse } from '@vercel/node';

// Approved test emails for hackathon demo.
// Use the Vercel environment variable `APPROVED_EMAILS` to set a comma-separated list.
// Example: kaveeshverma3@gmail.com,judge1@example.com,judge2@example.com
const approvedEnv = process.env.APPROVED_EMAILS || '';
const DEFAULT_APPROVED = [
  'kaveeshverma3@gmail.com'
];
const APPROVED_EMAILS = approvedEnv
  ? approvedEnv.split(',').map((s) => s.trim()).filter(Boolean)
  : DEFAULT_APPROVED;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, subject, html } = req.body;

    if (!email || !subject || !html) {
      // If APPROVED_EMAILS is provided, restrict sending to that list.
      if (APPROVED_EMAILS.length > 0) {
        const isApprovedEmail = APPROVED_EMAILS.some((approved) =>
          email.toLowerCase() === approved.toLowerCase()
        );
        if (!isApprovedEmail) {
          return res.status(400).json({
            error: `Email not approved for testing. Approved emails: ${APPROVED_EMAILS.join(', ')}.`,
          });
        }
      }
    const isApprovedEmail = APPROVED_EMAILS.some(approved => 
      email.toLowerCase() === approved.toLowerCase()
    );
    
    if (!isApprovedEmail) {
      return res.status(400).json({ 
        error: `Email not approved for testing. Approved emails: ${APPROVED_EMAILS.join(', ')}. Once domain verification is complete, any email can be used.` 
      });
    }

    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            from: `Rapid Strike Simulator <${FROM_EMAIL}>`,
        to: email,
        subject: `[SIMULATION] ${subject}`,
        html: html,
      }),
    });
        if (!RESEND_API_KEY) {
          console.error('RESEND_API_KEY not configured');
          return res.status(500).json({ error: 'Email service not configured' });
        }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend error:', errorData);
      return res.status(response.status).json({ 
        error: errorData.message || 'Failed to send email' 
      });
    }

    const result = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: result.id 
    });
  } catch (error: any) {
    console.error('Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
