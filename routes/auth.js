const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = new Router();

router.post('/register', async (req, res) => {
    try {
        let user = req.body;

        user.password = bcrypt.hashSync(user.password, 12);
        const prevUser = await User.findByUsername(user.username);

        if (prevUser) {
            return res.status(400).json({ error: 'User already exists' })
        }

        const newUser = await User.add(user);
        res.status(201).json({ data: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register' });
    }
});


module.exports = router;