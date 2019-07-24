const jwt = require('jsonwebtoken');

const { JWT_SECRET = "Some pretty long secret" } = process.env;

module.exports = {
    async authenticate(req, res, next) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, JWT_SECRET, (err, decodeToken) => {
                if (err) {
                    res
                        .status(401)
                        .json({ message: "You shall not pass!" });
                } else {
                    req.decoded = decodeToken;
                    next();
                }
            });
        } else {
            res.status(401).json({ message: "You shall not pass!" });
        }
    }
}