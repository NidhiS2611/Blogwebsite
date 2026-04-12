const nodemailer = require('nodemailer');

const sendmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            // Brevo ka dedicated SMTP server
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // TLS ke liye false
            auth: {
                // Brevo login email aur SMTP Key yahan aayenge
                user: process.env.BREVO_USER, 
                pass: process.env.BREVO_KEY   
            }
        });

        const mailOptions = {
            from: process.env.BREVO_USER, // Jo email Brevo par verify kiya
            to: to,      // User ka email (Recruiter ya koi bhi)
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent via Brevo ✅:', info.messageId);
        return info;
    } catch (error) {
        console.error('Brevo Error ❌:', error);
        throw error;
    }           
}

module.exports = sendmail;