const { Router } = require('express');
const router = Router();
const Event = require('../models/Event');

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

router.delete('/delete/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete({_id: req.params.id})

        res.json(event)
    } catch (error) {
        console.log(error)
    }
})

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

module.exports = router