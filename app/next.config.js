require("dotenv").config()

module.exports = {
  env: {
    hasuraSecret: process.env.hasuraSecret,
  },
}
