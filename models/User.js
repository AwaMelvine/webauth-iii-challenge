const db = require('../data/db');

module.exports = {
    get(id = null) {
        if (id) {
            const user = await db("users").where({ id }).first();
            return user;
        }
        return db("users");
    },

    async findByUsername(username) {
        const user = await db("users").where({ username }).first();
        return user;
    },

    async add(user) {
        const [id] = await db("users").insert(user);
        return this.get(id);
    },

};