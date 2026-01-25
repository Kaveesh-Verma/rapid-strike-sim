import { VercelRequest, VercelResponse } from '@vercel/node';

// Approved test emails for hackathon demo
const APPROVED_EMAILS = [
  'kaveeshverma3@gmail.com',
  // Add judges' emails here
  'judge1@example.com',
  'judge2@example.com',
  'judge3@example.com',
];

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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // For hackathon: check if email is approved (can be removed once domain is verified)
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
        'Authorization': `Bearer re_Ns9E36d4_1466TYvzDbaHqiVi5SBNPoWh`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rapid Strike Simulator <noreply@rapidcapture.net>',
        to: email,
        subject: `[SIMULATION] ${subject}`,
        html: html,
      }),
    });

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
