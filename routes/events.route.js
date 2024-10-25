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

router.delete('/delete/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete({_id: req.params.id})

        res.json(event)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router