const { Router } = require('express');
const router = Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventNotification } = require('../emailService');

// Create event
router.post('/create', async (req, res) => {
    try {
        const {name, place, date, time, description, category, userId} = req.body

        const event = await new Event({
            owner: userId,
            name,
            place,
            date,
            time,
            description,
            category
        })

        // Збереження події в базі даних
        await event.save();

        // Оновлення користувача для додавання події до масиву `user_events`
        await User.findByIdAndUpdate(
            userId,
            { $push: { user_events: event._id } },
            { new: true } // Повернути оновлений документ
        );

        res.json(event)

    } catch (error) {
        console.log(error)
    }
})


router.get('/', async (req, res) => {
    try {
        const { userId } = req.query

        const event = await Event.find({owner: userId})

        res.json(event)

    } catch (error) {
        console.log(error)
    }

})

// Get all events
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find().populate('owner', 'email'); // Fetch all events without filtering by userId
        res.json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.get('/followed/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ _id: userId }).populate('followedEvents');
        const followedEventIds = user.followedEvents.map(event => event._id);
        res.json(followedEventIds);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
})

router.get('/presented/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ _id: userId }).populate('willBePresent');
        const willBePresentIds = user.willBePresent.map(event => event._id);
        res.json(willBePresentIds);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
})

//Get event by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get eventId from URL params

        // const event = await Event.findById(id);
        const event = await Event.findById(id).populate('owner', 'email');

        if (!event) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }

        res.json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

//Delete event by id
router.delete('/delete/:id', async (req, res) => {
    try {
        // Видалення події
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Подію не знайдено' });
        }

        const userId = event.owner;
        // Оновлення користувача для видалення події з масиву `user_events`
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { user_events: event._id } },
            { new: true } // Повернути оновлений документ
        );

        // Перевірка, чи користувач було оновлено
        if (!updatedUser) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        res.status(200).json({ message: 'Подію успішно видалено', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера', error });
    }
});

//Edit event
router.put('/update/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const updateData = req.body;

        if (!updateData.name || !updateData.date || !updateData.category) {
            return res.status(400).json({ message: 'Всі обов’язкові поля мають бути заповнені' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: 'Подія не знайдена' });

        res.json(updatedEvent);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Follow an event
router.post('/follow/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.followedEvents.includes(eventId)) {
            user.followedEvents.push(eventId);
            await user.save();
        }

        res.status(200).json({ message: 'Event followed successfully', followedEvents: user.followedEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error following event', error });
    }
});

router.delete('/unfollow/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const eventIndex = user.followedEvents.indexOf(eventId);
        if (eventIndex !== -1) {
            user.followedEvents.splice(eventIndex, 1); // Remove the event ID from followedEvents
            await user.save();
        }

        res.status(200).json({ message: 'Event unfollowed successfully', followedEvents: user.followedEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing event', error });
    }
});

// Follow an event
router.post('/present/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL

    try {
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.willBePresent.includes(eventId)) {
            user.willBePresent.push(eventId);
            await user.save();
        }

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!event.usersWhichPresent.includes(userId)) {
            event.usersWhichPresent.push(userId);
            await event.save();
        }

        res.status(200).json({ message: 'Event present successfully', willBePresent: user.willBePresent });
    } catch (error) {
        res.status(500).json({ message: 'Error present event', error });
    }
});

router.delete('/unpresent/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL

    try {
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const eventIndex = user.willBePresent.indexOf(eventId);
        if (eventIndex !== -1) {
            user.willBePresent.splice(eventIndex, 1); // Remove the event ID from followedEvents
            await user.save();
        }

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const userIndex = event.usersWhichPresent.indexOf(userId);
        if (userIndex !== -1 ) {
            event.usersWhichPresent.splice(userId, 1);
            await event.save();
        }

        res.status(200).json({ message: 'Event unpresent successfully', willBePresent: user.willBePresent });
    } catch (error) {
        res.status(500).json({ message: 'Error unpresent event', error });
    }
});

router.post('/attend/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Подія не знайдена' });
        }

        if (!event.usersWhichPresent.includes(userId)) {
            event.usersWhichPresent.push(userId);
            await event.save();
        }

        // Надсилаємо повідомлення усім присутнім користувачам
        await sendEventNotification(eventId);

        res.json({ message: 'Присутність підтверджена, розсилка надіслана' });
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

module.exports = router