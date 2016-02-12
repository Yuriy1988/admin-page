if (DEV_MODE) {
    module.exports = require('./Root.dev')
} else {
    module.exports = require('./Root.prod')
}
