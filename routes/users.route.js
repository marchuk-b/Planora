// routes/userRoutes.js
const { Router } = require('express');
const User = require('../models/User'); // Import your User model
const router = Router();

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL parameters

        // Find the user by ID and populate followedEvents if necessary
        const user = await User.findById(userId).populate('followedEvents');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details excluding sensitive information like password
        res.json({
            _id: user._id,
            email: user.email,
            followedEvents: user.followedEvents // Return followedEvents array
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});


module.exports = router;
