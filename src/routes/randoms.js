const express = require('express')
const router = express.Router()
const { fork } = require('child_process')

router.get("/", (req, res) => {
    const cant = req.query.cant || 100000000

    const computeRandom = fork('./src/scripts/computeRandoms.js')

    computeRandom.send(cant)
    computeRandom.on('message', result => {
        res.send(result)
    })

})

module.exports = router