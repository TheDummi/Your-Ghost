const mongoose = require('mongoose')
const { mongoDb } = require('../data/config/config.json')
const moment = require('moment')

class Database {
    constructor() {
        this.connection = null;
    }
    connect() {
        let time = moment(Number(new Date())).format('H:mm:ss')
        console.log(`${time} | Connecting to database...`)

        mongoose.connect(mongoDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            let time = moment(Number(new Date())).format('H:mm:ss')
            console.log(`${time} | Connected to database`);
            this.connection = mongoose.connection;
        }).catch(err => {
            let time = moment(Number(new Date())).format('H:mm:ss')
            console.log(`${time} | Did not connect to database, error: ${String(err).slice(15, 84)}`)
        })
    }
}

module.exports = Database;