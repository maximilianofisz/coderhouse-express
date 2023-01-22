const multer = require('multer')
const fs = require('fs')
const pino = require('pino')
const errorLog = pino(pino.destination('./error.log'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: async function (req, file, cb) {
        if(req.originalUrl.toLowerCase() == "/accounts/uploadprofilepic") {
            if (fs.existsSync("./uploads/" + req.user.email + ".png")) {
                await fs.unlink("./uploads/" + req.user.email + ".png", (err) => {
                    if (err) {
                        errorLog.error({error: err})
                        res.status(500).render("errors", {layout: false})
                    } 

                    else cb(null, req.user.email + ".png")
                })
            }
            else {
                cb(null, req.user.email + ".png")
            }
        }
        else {
            cb(null, req.body.email + ".png")
        }
    } 
})

let multerConfig = multer({storage: storage})

module.exports = { multerConfig }

