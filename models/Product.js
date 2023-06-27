const moongoose = require('mongoose')

const productSchema = new moongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true },
    price: { type: String, required: true }
})

module.exports = moongoose.model('Product', productSchema)
