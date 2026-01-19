
const nodemailer = require('nodemailer');

const EMAIL_USER = "uf71384@gmail.com";
const EMAIL_PASS = "nrrj oznt gmpr ftsz";

async function main() {
  console.log("Starting email test v2...");
  
  // Try explicit SMTP configuration for Gmail
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Helps in dev environments
    },
    debug: true,
    logger: true 
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test v2" <${EMAIL_USER}>`,
      to: EMAIL_USER, 
      subject: "Test Email v2",
      text: "Testing with explicit SMTP settings.",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  }
}

main();
