const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

router.post('/login', 
    [
        check('email',  'Некоректна пошта').isEmail(),
        check('password',  'Некоректний пароль').exists(),
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
            
            const user = await User.findOne({ email })

            if(!user) {
                return res.status(400).json({message: "Користувача з такою поштою немає в базі"})
            }

            const isMatch = bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({message: "Паролі не співпадають"})
            }

            const jwtSecret = 'firjroepjgtepor32141rdeijwi2ij3e0d02djw0ejdw0ej'

            const token = jwt.sign(
                {userId: user.id},
                jwtSecret,
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})


    } catch (err) {
    console.log(err)
    }
})


module.exports = router