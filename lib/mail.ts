import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465, // Force secure if 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
      rejectUnauthorized: false // Helps in dev environments
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000 // 10 seconds
});

// Helper for retry logic
const sendMailWithRetry = async (mailOptions: any, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await transporter.sendMail(mailOptions);
        } catch (error) {
            console.warn(`Email attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
            await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retry
        }
    }
};

interface BookingDetails {
    _id: string;
    contactInfo: {
        firstName: string;
        lastName: string;
        email: string;
        [key: string]: any;
    };
    items?: any[]; // For cart bookings
    package?: any; // For direct bookings if any
    title?: string;
    date: Date;
    pricing: {
        totalPrice: number;
        currency: string;
    };
    paymentMethod: string; // 'stripe' | 'cash'
    status: string;
    [key: string]: any;
}

export const sendBookingConfirmation = async (bookings: BookingDetails[]) => {
  try {
    console.log("sendBookingConfirmation called.");
    console.log("SMTP Config Check:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER ? 'DEFINED' : 'UNDEFINED',
        pass: process.env.SMTP_PASS ? 'DEFINED' : 'UNDEFINED'
    });

    if (!bookings || bookings.length === 0) {
        console.warn("sendBookingConfirmation: No bookings provided.");
        return;
    }

    const buyer = bookings[0].contactInfo;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.pricing?.totalPrice || 0), 0);
    const currency = bookings[0].pricing?.currency || 'AED';
    const paymentMethod = (bookings[0].paymentMethod === 'cash' || bookings[0].paymentMethod === 'pay_later') ? 'Book Now, Pay Later(Cash)' : 'Paid Online (Stripe)';

    // Build Items List HTML
    const itemsHtml = bookings.map(b => `
      <div style="margin-bottom: 30px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #fff; padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
             <h2 style="margin: 0; font-size: 18px; color: #000;">Tour Details</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
            <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 40%;">Tour name:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${b.title}</td>
            </tr>
            <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Tour date:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${new Date(b.date).toLocaleDateString()}</td>
            </tr>
            ${(b.guestDetails?.adults && b.guestDetails.adults > 0) ? `
             <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Adult:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${b.guestDetails.adults}</td>
            </tr>` : ''}
            ${(b.guestDetails?.children && b.guestDetails.children > 0) ? `
             <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Child:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${b.guestDetails.children}</td>
            </tr>` : ''}
            <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Pickup:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${b.contactInfo?.pickupLocation || 'Not specified'}</td>
            </tr>
            <tr>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0; font-weight: bold;">Payment Method:</td>
                <td style="padding: 10px 15px; border-bottom: 1px solid #f0f0f0;">${paymentMethod}</td>
            </tr>
             <tr>
                <td style="padding: 10px 15px; font-weight: bold;">Order sum:</td>
                <td style="padding: 10px 15px;">${b.pricing?.totalPrice || 0} ${currency}</td>
            </tr>
        </table>
      </div>
    `).join('');

    console.log(`Preparing to send email to ${buyer.email} for booking ${bookings[0]._id}`);

    // --- Send Email to Customer ---
    const customerMailOptions = {
        // ... options
      from: `"Desert Smart Tourism" <${process.env.SMTP_USER}>`,
      to: buyer.email,
      subject: `Order confirmation No ${String(bookings[0]._id).substring(String(bookings[0]._id).length - 6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          
          <div style="text-align: center; margin-bottom: 20px;">
             <!-- Placeholder for Check Icon -->
             <div style="display: inline-block; width: 60px; height: 60px; background-color: #d4a768; border-radius: 50%; line-height: 60px; color: white; font-size: 30px; margin-bottom: 10px;">
                ✓
             </div>
             <h1 style="margin: 0; font-size: 24px;">Order confirmation</h1>
          </div>

          ${itemsHtml}

          <div style="margin-top: 20px;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Your Details</h3>
            
            <div style="margin-bottom: 10px;">
                <span style="font-weight: bold; color: #555;">Name:</span> 
                <span>${buyer.firstName} ${buyer.lastName || ''}</span>
            </div>
             <div style="margin-bottom: 10px;">
                <span style="font-weight: bold; color: #555;">Email:</span> 
                <span style="color: #d9534f;">${buyer.email}</span>
            </div>
             <div style="margin-bottom: 10px;">
                <span style="font-weight: bold; color: #555;">Phone No:</span> 
                <span>${buyer.phone || ''}</span>
            </div>
             <div style="margin-bottom: 10px;">
                <span style="font-weight: bold; color: #555;">Payment date No:</span> 
                <span>${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</span>
            </div>
          </div>

          <p style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
            Thank you for choosing Desert Smart Tourism!
          </p>
        </div>
      `,
    };

    console.log("Sending customer email...");
    const customerInfo = await sendMailWithRetry(customerMailOptions);
    console.log("Customer email sent. MessageId:", customerInfo?.messageId);


    // --- Send Email to Admin ---
    const adminMailOptions = {
      from: `"Desert Smart Tourism System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Sending to admin (same email for now, or configurable)
      subject: `New Booking Received - ${paymentMethod}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Booking Alert</h2>
          <p><strong>Customer:</strong> ${buyer.firstName} ${buyer.lastName}</p>
          <p><strong>Email:</strong> ${buyer.email}</p>
          <p><strong>Phone:</strong> ${buyer.phone}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Total Amount:</strong> ${currency} ${totalAmount}</p>
          
          <hr/>
          <h3>Items:</h3>
          ${itemsHtml}
        </div>
      `,
    };

    console.log("Sending admin email...");
    const adminInfo = await sendMailWithRetry(adminMailOptions);
    console.log("Admin email sent. MessageId:", adminInfo?.messageId);

    console.log('All emails sent successfully');
    return true;

  } catch (error: any) {
    console.error('CRITICAL: Error sending emails in sendBookingConfirmation:', error);
    if (error.response) {
        console.error("SMTP Response:", error.response);
    }
    return false;
  }
};

interface B2BInquiryData {
    fullName: string;
    companyName: string;
    businessEmail: string;
    phone: string;
    country: string;
    message: string;
}

export const sendB2BEmails = async (data: B2BInquiryData) => {
    try {
        console.log("sendB2BEmails called for:", data.businessEmail);

        // --- Send Email to Owner (Info@desertsmarttourism.com) ---
        const ownerMailOptions = {
            from: `"Desert Smart Tourism System" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `New B2B Partnership Proposal - ${data.companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #DF6951;">New B2B Partnership Proposal</h2>
                    <p><strong>Full Name:</strong> ${data.fullName}</p>
                    <p><strong>Company Name:</strong> ${data.companyName}</p>
                    <p><strong>Email:</strong> ${data.businessEmail}</p>
                    <p><strong>Phone:</strong> ${data.phone}</p>
                    <p><strong>Country:</strong> ${data.country}</p>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    
                    <h3 style="margin-bottom: 10px;">Message:</h3>
                    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${data.message}</p>
                </div>
            `,
        };

        // --- Send Confirmation to Sender ---
        const senderMailOptions = {
            from: `"Desert Smart Tourism" <${process.env.SMTP_USER}>`,
            to: data.businessEmail,
            subject: `Received: Your B2B Partnership Proposal`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="text-align: center; padding: 20px 0;">
                        <h2 style="color: #DF6951;">Proposal Received</h2>
                    </div>
                    
                    <p>Dear ${data.fullName},</p>
                    
                    <p>Thank you for reaching out to Desert Smart Tourism! We have received your partnership proposal regarding <strong>${data.companyName}</strong>.</p>
                    
                    <p>Our team will review your message and get back to you shortly to discuss potential collaboration opportunities.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0; font-weight: bold;">Summary of your message:</p>
                        <p style="margin-top: 5px; font-style: italic;">"${data.message}"</p>
                    </div>

                    <p>Best regards,<br>The Desert Smart Tourism Team</p>
                </div>
            `,
        };

        // Send both emails using existing retry logic
        console.log("Sending B2B owner email...");
        await sendMailWithRetry(ownerMailOptions);
        
        console.log("Sending B2B sender confirmation...");
        await sendMailWithRetry(senderMailOptions);

        console.log("B2B emails sent successfully");
        return true;

    } catch (error) {
        console.error('Error in sendB2BEmails:', error);
        return false;
    }
};

