const express = require('express');
const auth = require('./routes/auth');
const app = express();

app.use(express.json())

app.use('/api/', auth)

app.get('*', (req, res) => {
    res.status(404).json({ message: 'Page Not Found' });
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Server running on localhost:${port}`));