const nodemailer = require('nodemailer');

const sendmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: process.env.APP_EMAIL,    // Tera Gmail
                pass: process.env.APP_PASSWORD // Tera 16-digit App Password
            },
            // --- RENDER SPECIAL FIX ---
            dnsV6Order: false,
            family: 4, // YE SABSE ZAROORI HAI: Isse IPv6 bypass ho jayega
            connectionTimeout: 20000, 
            greetingTimeout: 20000,
            tls: {
                rejectUnauthorized: false // Connection block nahi hone dega
            }
        });

        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: to,      // Ab kisi bhi user ko mail chala jayega
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully ✅', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email ❌:', error);
        throw error;
    }           
}

module.exports = sendmail;