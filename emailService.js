// emailService.js
const nodemailer = require('nodemailer');
const User = require('./models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'svitjaz2006@gmail.com',       // Ваш email
        pass: 'ngto njrf mijl lrbg'           // Пароль додатку (app password) для доступу
    }
});

async function sendEmail(to, subject, text, html = null) {
    try {
        await transporter.sendMail({
            from: 'svitjaz2006@gmail.com',
            to,
            subject,
            text,
            html
        });
        console.log(`Email надіслано ${to}`);
    } catch (error) {
        console.error('Помилка при надсиланні листа:', error);
    }
}

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Format as per your preference
};

async function sendEventNotification(eventId) {
    const Event = require('./models/Event'); 
    const event = await Event.findById(eventId).populate('usersWhichPresent');

    if (!event) {
        console.log('Подія не знайдена');
        return;
    }

    // Тема та контент листа
    const subject = `Нагадування про подію: ${event.name}`;
    const text = `Привіт! Ви підтвердили присутність на події "${event.name}", яка відбудеться ${formatDate(event.date)} о ${event.time}.`;
    const html = `<p>Привіт! Ви підтвердили присутність на події "<strong>${event.name}</strong>", яка відбудеться ${formatDate(event.date)} о ${event.time}.</p>`;

    // Надсилання листа кожному присутньому користувачеві
    for (const user of event.usersWhichPresent) {
        await sendEmail(user.email, subject, text, html);
    }
}

module.exports = { sendEventNotification };
