const session = require('express-session')
const MongoStore = require('connect-mongo')

let mongoSession = session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGOURL,
        autoRemove: 'native',
        ttl: process.env.SESSION_TTL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        
    }),
    secret: "coderhouse",
    resave: true,
    saveUninitialized: false
})

module.exports = { mongoSession }