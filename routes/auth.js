const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Fuse = require('fuse.js');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const router = new Router();

const { JWT_SECRET = "Some pretty long secret" } = process.env;

function createToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        departments: user.departments
    };
    const options = {
        expiresIn: 1000 * 60 * 60 * 24
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
}

router.post('/register', async (req, res) => {
    try {
        let user = req.body;

        if (!user.username || !user.password || !user.departments) {
            return res.status(400).json({ message: "You must provide all user data" });
        }

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

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = createToken(user);
            res.status(201).json({ message: `Welcome, ${user.username}`, data: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.get();
        const { departments } = req.decoded;

        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["departments"]
        };
        const fuse = new Fuse(users, options);
        const groupedUsers = fuse.search(departments);
        res.status(200).json({ data: groupedUsers });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get users' });
    }
});

module.exports = router;