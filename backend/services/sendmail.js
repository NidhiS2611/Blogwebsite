const nodemailler = require('nodemailer');

const sendmail = async (to, subject, text) => {
    try {
        const transporter = nodemailler.createTransport({
    // 'smtp.gmail.com' ki jagah direct IP use karne se IPv6 bypass ho jata hai
    // Ya fir hum family: 4 option add karenge
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail', // Service use karne se Nodemailer internally manage kar leta hai
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD
    },
    // YE VALA PART IMPORTANT HAI
    tls: {
        rejectUnauthorized: false
    },
    // Force IPv4
    connectionTimeout: 10000,
    greetingTimeout: 10000,
});

        const mailOptions = {
            from: process.env.APP_EMAIL,
            to,                                 
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Isse tere main function ko pata chalega ki fail hua hai
    }           
}

module.exports = sendmail;