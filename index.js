const express = require('express');
const mongoose = require('mongoose')


const app = express();
const PORT = 5000;

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/events', require('./routes/events.route'))
app.use('/api/users', require('./routes/users.route'))

async function start() {
    try {
        await mongoose.connect('mongodb+srv://marchukbohdan29:uhMtsqWIaYEzMqJX@planora.bogpy.mongodb.net/')
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
}

start()







