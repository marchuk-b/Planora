const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require("bcryptjs")

router.post('/registration', 
    [
        check('email',  'Некоректна пошта').isEmail(),
        check('password',  'Некоректний пароль').isLength({min: 6}),
    ], 
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректні дані при реєстрації'
                })
            }
            
            const { email, password } = req.body
            
            const isUsed = await User.findOne({ email })
            
            if(isUsed) {
                return res.status(300).json({message: 'Ця пошта уже використовується, спробуйте іншу'})
            }
            
            const hashedpassword = await bcrypt.hash(password, 12)
            
            const user = new User({
                email, password: hashedpassword
            })

            await user.save()

            res.status(201).json({message: 'Користувач створений успішно'})
    } catch (err) {
    console.log(err)
    }
})


module.exports = router