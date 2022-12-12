module.exports = {
  apps : [{
    name   : "Coderhouse",
    script : "./src/main.js",
    cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
    watch: false,
    instances: 4,
    env: {
      "PORT": 8080,
      "STATE": "ready",
      "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
    }
  }]
}
