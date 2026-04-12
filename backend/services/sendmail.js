const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendmail = async (to, subject, text) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // testing email
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent ✅", data);
  } catch (error) {
    console.error("Error sending email ❌", error);
    throw error;
  }
};

module.exports = sendmail;