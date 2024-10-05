const {router} = require('express');
const router = Router();
const User = required('../models/User');

router.post('/registration', async (req, res) => {
    try {
        const { email, password } = req.body;

        const isUsed = await User.findOne({ email })

        if(isUsed) return res.status(300).json({message: 'Ця пошта уже використовується, спробуйте іншу'})
    
        const user = new User({
            email, password
        })

        await user.save()

        res.status(201).json({message: 'Користувач створений успішно'})

    } catch (err) {
    console.log(err)
    }
})


module.exports = router