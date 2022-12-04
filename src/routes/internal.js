const express = require('express')
const router = express.Router()

router.get("/info", (req, res) => {
    const data = {
        Args: process.argv.splice(2),
        OS: process.platform,
        nodeVersion: process.version,
        RSS: process.memoryUsage(),
        path: process.execPath,
        PID: process.pid,
        directory: process.cwd()
    }
    console.log(data)
    res.send(data)
})

module.exports = router