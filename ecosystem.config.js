module.exports = {
  apps : [
      {
        name: "InstuGuide",
        script: "./server.js",
        watch: true,
        env: {
            "PORT": 7776,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 7776,
            "NODE_ENV": "production"
        }
      }
  ]
}