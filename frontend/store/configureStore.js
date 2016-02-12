if (DEV_MODE) {
    module.exports = require('./configureStore.dev')
} else {
    module.exports = require('./configureStore.prod')
}