const { Router } = require('express');
const router = Router();
const Event = require('../models/Event');

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

        await event.save()

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

//Get event by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get eventId from URL params

        const event = await Event.findById(id); // Find event by its ID

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
        const event = await Event.findByIdAndDelete({_id: req.params.id})

        res.json(event)
    } catch (error) {
        console.log(error)
    }
})

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
router.post('/api/events/follow/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL

    console.log(userId, eventId)

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

// Unfollow an event
router.post('/api/events/unfollow/:id', async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.id; // Get event ID from URL
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the event ID from the followedEvents array
        user.followedEvents = user.followedEvents.filter(id => id.toString() !== eventId);
        await user.save();

        res.status(200).json({ message: 'Event unfollowed successfully', followedEvents: user.followedEvents });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing event', error });
    }
});

module.exports = router