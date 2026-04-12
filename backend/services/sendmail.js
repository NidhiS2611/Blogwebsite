const sendmail = async (to, subject, text) => {
    try {
        console.log('Attempting to send email via API... 📧', process.env.BREVO_KEY);
        // Hum fetch use kar rahe hain jo Node.js mein built-in hota hai
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_KEY.trim(), // Teri wahi SMTP key yahan API key ka kaam karegi
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { 
                    name: "Blog Website", 
                    email: process.env.BREVO_USER // Tera verified email
                },
                to: [{ email: to }],
                subject: subject,
                textContent: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Brevo API Error Details ❌:', data);
            throw new Error(data.message || 'Email sending failed');
        }

        console.log('Email sent successfully via API ✅', data.messageId || '');
        return data;
    } catch (error) {
        console.error('Final API Error ❌:', error.message);
        throw error;
    }           
}

module.exports = sendmail;