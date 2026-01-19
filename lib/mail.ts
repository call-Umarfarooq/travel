import nodemailer from 'nodemailer';

// Email credentials
const EMAIL_USER = "uf71384@gmail.com";
const EMAIL_PASS = "nrrj oznt gmpr ftsz";

// Create reusable transporter object using the default SMTP transport
// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
      rejectUnauthorized: false // Helps in dev environments with self-signed certs
  }
});

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
    if (!bookings || bookings.length === 0) return;

    const buyer = bookings[0].contactInfo;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.pricing?.totalPrice || 0), 0);
    const currency = bookings[0].pricing?.currency || 'AED';
    const paymentMethod = bookings[0].paymentMethod === 'cash' ? 'Pay Later (Cash)' : 'Paid Online (Stripe)';

    // Build Items List HTML
    const itemsHtml = bookings.map(b => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <h3 style="margin: 0; color: #333;">${b.title}</h3>
        <p style="margin: 5px 0; color: #666;">Date: ${new Date(b.date).toLocaleDateString()}</p>
        <p style="margin: 5px 0; font-weight: bold;">${currency} ${b.pricing.totalPrice}</p>
      </div>
    `).join('');

    console.log(`Preparing to send email to ${buyer.email} for booking ${bookings[0]._id}`);

    // --- Send Email to Customer ---
    const customerMailOptions = {
        // ... options
      from: `"Travel Agency" <${EMAIL_USER}>`,
      to: buyer.email,
      subject: `Booking Confirmation - ${String(bookings[0]._id).substring(String(bookings[0]._id).length - 6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #F85E46;">Booking Confirmed!</h2>
          <p>Hi ${buyer.firstName},</p>
          <p>Thank you for booking with us. Your booking has been confirmed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${currency} ${totalAmount}</p>
          </div>

          <h3>Booking Details:</h3>
          ${itemsHtml}

          <p style="margin-top: 30px; font-size: 12px; color: #999;">If you chose "Pay Later", please ensure payment is made upon arrival or as per our policy.</p>
        </div>
      `,
    };

    console.log("Sending customer email...");
    const customerInfo = await transporter.sendMail(customerMailOptions);
    console.log("Customer email sent. MessageId:", customerInfo.messageId);


    // --- Send Email to Admin ---
    const adminMailOptions = {
      from: `"Travel Agency System" <${EMAIL_USER}>`,
      to: EMAIL_USER, // Sending to admin (same email for now, or configurable)
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
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent. MessageId:", adminInfo.messageId);

    console.log('All emails sent successfully');
    return true;

  } catch (error) {
    console.error('CRITICAL: Error sending emails in sendBookingConfirmation:', error);
    return false;
  }
};
