'use strict'

function generateEvenNumbers(max) {
    let pair = []
    for (let i = 0; i < max; i++) {
        if (i % 2 == 0) {
            pair.push(i)
        }
    }
    return ['odd numbers:', pair]
}

module.exports = {
    generateEvenNumbers
}
