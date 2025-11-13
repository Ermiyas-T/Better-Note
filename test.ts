import { Resend } from "resend";

// Load environment variables from .env file

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  try {
    const data = await resend.emails.send({
      from: "jermiket@gmail.com", // Use a verified domain
      to: "jket192@gmail.com",
      subject: "Test Email",
      text: "This is a test email",
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

test();
