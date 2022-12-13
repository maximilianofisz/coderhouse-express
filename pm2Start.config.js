module.exports = {
  apps : [
    {
      name   : "Coderhouse",
      script : "./src/main.js",
      cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
      watch: false,
      env: {
        "PORT": 8080,
        "STATE": "ready",
        "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
      }
    },
    {
      name   : "Coderhouse",
      script : "./src/main.js",
      cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
      watch: false,
      instances: 4,
      env: {
        "PORT": 8081,
        "STATE": "ready",
        "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
      }
    },
    {
    name   : "Coderhouse",
    script : "./src/main.js",
    cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
    watch: false,
    env: {
      "PORT": 8082,
      "STATE": "ready",
      "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
    }
  },
  {
    name   : "Coderhouse",
    script : "./src/main.js",
    cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
    watch: false,
    env: {
      "PORT": 8083,
      "STATE": "ready",
      "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
    }
  },
  {
    name   : "Coderhouse",
    script : "./src/main.js",
    cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
    watch: false,
    env: {
      "PORT": 8084,
      "STATE": "ready",
      "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
    }
  },
  {
    name   : "Coderhouse",
    script : "./src/main.js",
    cwd: "E:/Source/coderhouse-expres/coderhouse-express/",
    watch: false,
    env: {
      "PORT": 8085,
      "STATE": "ready",
      "MONGOURL": "mongodb+srv://coder:house@cluster0.4fvrhxv.mongodb.net/?retryWrites=true&w=majority"
    }
  }]
}
