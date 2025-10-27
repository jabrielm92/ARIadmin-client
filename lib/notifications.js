// Notification System - Email (SendGrid) and SMS (Twilio)

export async function sendLeadNotification(campaign, lead) {
  try {
    // Send email notification
    await sendEmailNotification(campaign, lead);
    
    // Send SMS notification if configured
    await sendSMSNotification(campaign, lead);
    
    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
    throw error;
  }
}

async function sendEmailNotification(campaign, lead) {
  try {
    console.log('📧 SendGrid: Would send email notification', {
      to: 'client-email@example.com', // Will be from client settings
      subject: `New Lead: ${lead.name}`,
      body: `
        New lead captured from campaign: ${campaign.name}
        
        Name: ${lead.name}
        Email: ${lead.email}
        Phone: ${lead.phone}
        Company: ${lead.company}
        Source: ${lead.source}
        Lead Score: ${lead.score}
        
        View lead: ${process.env.NEXT_PUBLIC_BASE_URL}/client/leads
      `
    });
    
    /*
    SENDGRID IMPLEMENTATION:
    
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: clientEmail,
      from: 'leads@arisolutionsinc.com',
      subject: `New Lead: ${lead.name}`,
      text: emailBody,
      html: emailBodyHTML
    };
    
    await sgMail.send(msg);
    */
    
    return { success: true };
  } catch (error) {
    console.error('Email notification error:', error);
    throw error;
  }
}

async function sendSMSNotification(campaign, lead) {
  try {
    console.log('📱 Twilio: Would send SMS notification', {
      to: '+1234567890', // Will be from client settings
      body: `New lead: ${lead.name} (${lead.email}) - View in dashboard`
    });
    
    /*
    TWILIO IMPLEMENTATION:
    
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      body: `New lead: ${lead.name} - View dashboard`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: clientPhoneNumber
    });
    */
    
    return { success: true };
  } catch (error) {
    console.error('SMS notification error:', error);
    throw error;
  }
}

export async function sendWelcomeEmailToLead(lead, campaign) {
  // Send auto-responder email to the lead
  try {
    const autoResponder = campaign.autoResponder;
    
    if (!autoResponder || !autoResponder.enabled) {
      return { success: false, reason: 'Auto-responder not enabled' };
    }
    
    console.log('📧 SendGrid: Would send welcome email to lead', {
      to: lead.email,
      subject: autoResponder.subject,
      body: autoResponder.body.replace('{{name}}', lead.name)
    });
    
    /*
    IMPLEMENTATION:
    
    let emailBody = autoResponder.body;
    emailBody = emailBody.replace('{{name}}', lead.name);
    emailBody = emailBody.replace('{{email}}', lead.email);
    emailBody = emailBody.replace('{{phone}}', lead.phone);
    emailBody = emailBody.replace('{{company}}', lead.company);
    
    await sgMail.send({
      to: lead.email,
      from: 'noreply@arisolutionsinc.com',
      subject: autoResponder.subject,
      text: emailBody
    });
    */
    
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    throw error;
  }
}