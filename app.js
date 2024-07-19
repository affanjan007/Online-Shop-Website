const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 80;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/online_store', {
    });

    console.log('MongoDB connected successfully');

    // Define mongoose schema
    const ContactSchema = new mongoose.Schema({
        name: String,
        phone: String,
        email: String,
        address: String,
        desc: String
    });

    const Contact = mongoose.model('Contact', ContactSchema);

    const CheckoutSchema = new mongoose.Schema({
        name: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        postal: String,
        paymentMethod: {
            type: String,
            required: true
        },
        totalAmountPayable: String,
        cartItems: [{
            name: String,
            price: Number
        }]
    });

    const Checkout = mongoose.model('Checkout', CheckoutSchema);

    // Express related
    app.use('/static', express.static('static')); // Serving static files
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Session configuration
    app.use(session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    }));

    // Pug related
    app.set('view engine', 'pug'); // Set the template engine as pug
    app.set('views', path.join(__dirname, 'views')); // Set the views directory

    // Endpoints
    app.get('/', (req, res) => {
        res.status(200).render('home.pug');
    });

    app.get('/contact', (req, res) => {
        res.status(200).render('contact.pug');
    });

    // Handle form submission for contact
    app.post('/contact', async (req, res) => {
        try {
            const { name, phone, email, address, desc } = req.body;
            const contact = new Contact({ name, phone, email, address, desc });
            await contact.save();
            res.status(200).send('Contact information saved successfully');
        } catch (err) {
            res.status(500).send('Error saving contact information');
        }
    });

    app.get('/shop', (req, res) => {
        res.status(200).render('shop.pug');
    });

    app.get('/cart', (req, res) => {
        res.status(200).render('cart.pug');
    });

    app.get('/checkout', (req, res) => {
        res.status(200).render('checkout.pug');
    });

    // Handle form submission for checkout
    app.post('/checkout', async (req, res) => {
        try {
            const { name, phone, email, address, city, postal, paymentMethod, cartItems } = req.body;

            // Calculate total amount payable
            const parsedCartItems = JSON.parse(cartItems).map(item => ({
                ...item,
                price: item.price / 100 // Divide the price by 100 for correct price
            }));

            let totalAmount = parsedCartItems.reduce((sum, item) => sum + item.price, 0);
            totalAmount += 200; // Add delivery charges

            // Create a Checkout instance with all details
            const checkout = new Checkout({
                name,
                phone,
                email,
                address,
                city,
                postal,
                paymentMethod,
                totalAmountPayable: totalAmount.toString(), // Ensure totalAmountPayable is stored as String
                cartItems: parsedCartItems
            });

            await checkout.save();
            req.session.cart = null;

            res.status(200).send('Checkout information saved successfully');
        } catch (err) {
            console.error('Error saving checkout information:', err);
            res.status(500).send('Error saving checkout information');
        }
    });

    app.get('/customer-service', (req, res) => {
        res.status(200).render('customer-service.pug');
    });

    // Listen to run live server
    app.listen(port, () => {
        console.log(`Application started successfully on port ${port}`);
    });
}
