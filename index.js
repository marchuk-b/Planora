const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = 5000

async function start() {
    try {
        await mongoose.connect('mongodb+srv://marchukbohdan29:uhMtsqWIaYEzMqJX@planora.bogpy.mongodb.net/', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: true
        })
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
}

start()







