const cron = require('node-cron');
const { sendEventNotification } = require('./emailService');
const Event = require('./models/Event');

// Щоденна перевірка подій, які скоро відбудуться
cron.schedule('0 0 * * *', async () => {
    console.log('Перевірка подій для розсилки нагадувань...');

    // Знаходимо події, які відбудуться через 3 дні
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const events = await Event.find({ date: threeDaysLater });

    for (const event of events) {
        await sendEventNotification(event._id);
    }
});

console.log('Cron job налаштовано для щоденної перевірки подій');
