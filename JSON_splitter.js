﻿const data = '{ "name": "Flavio", "age": 35 }'
try {
    const user = JSON.parse(data)
} catch (err) {
    console.error(err)
}


//how to read file:

const data = require('./file.json')
