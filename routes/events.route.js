const { Router } = require('express');
const router = Router();
const Event = require('../models/Event');

router.post('/add', async (req, res) => {
    try {
        const {name, place, date, description, numberOfPeople, userId} = req.body

        const event = await new Event({
            name,
            place,
            date,
            description,
            numberOfPeople,
            owner: userId
        })

        await event.save()

        res.json(event)

    } catch (error) {
        console.log(error)
    }
})


module.exports = router