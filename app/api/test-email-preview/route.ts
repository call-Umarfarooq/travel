
import { NextResponse } from 'next/server';

export async function GET() {
  const mockBooking = {
    _id: "671fb8d1923456abcdef",
    title: "Dinner Show",
    date: new Date("2024-10-23"),
    guestDetails: {
      adults: 2,
      children: 2
    },
    pricing: {
      totalPrice: 1090,
      currency: "AED"
    },
    contactInfo: {
        firstName: "Peter",
        lastName: "Reid",
        email: "peter.reid209@googlemail.com",
        phone: "+971 505,848,841",
        pickupLocation: "Adagio premium west beach, palm"
    },
    paymentMethod: 'stripe'
  };
  
  const bookings = [mockBooking];
  const buyer = bookings[0].contactInfo;
  const currency = bookings[0].pricing.currency;
  const totalAmount = bookings[0].pricing.totalPrice;
  const paymentMethod = 'Paid Online (Stripe)';

    // Build Items List HTML (Copied from lib/mail.ts logic for preview)
    const itemsHtml = bookings.map((b: any) => `
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

  const html = `
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
                <span>${new Date("2024-10-19T06:14:10").toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</span>
            </div>
          </div>

          <p style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
            Thank you for choosing us!
          </p>
        </div>
      `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
