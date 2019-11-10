'use strict'

const my_shared_code_headless = require('./my_shared_code_headless')

function writeContent() {
    const numbers = my_shared_code_headless.generateEvenNumbers(20)
    return numbers
}

module.exports = {
    writeContent
}
