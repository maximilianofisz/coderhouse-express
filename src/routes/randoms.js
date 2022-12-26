const express = require('express')
const router = express.Router()
const child_process = require('child_process')

router.get("/", (req, res) => {
    const cant = req.query.cant || 100000000

    let data = {}
    for(let i = 0; i < cant; i++){
        let random = Math.floor(Math.random() * 1001)
    
        if(data[random]){
            data[random]++
        }
        else {
            data[random] = 1
        }

    }
    res.send(data)


/*     const computeRandom = child_process.fork('./src/scripts/computeRandoms.js')

    computeRandom.send(cant)
    computeRandom.on('message', result => {
        res.send(result)
    }) */

})

module.exports = router