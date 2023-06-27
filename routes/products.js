const express = require('express')
const router = express.Router()
const Product =  require('../models/Product')

router.get('/', async (req, res) => {

    try {
        const products = await Product.find() || []
        res.render('products', {products: products, user: req.user})
    }
    catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }

})


router.get('/upload', (req, res) => {
    res.render('productUpload')
})


router.post('/', async (req, res) => {

    try {
        const { name, description, price } = req.body;

        const newProduct = new Product({
            name: name,
            description: description,
            price: price
        })

        await newProduct.save()

        res.redirect('/products')
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Failed to create product'})
    }
})

module.exports = router;
