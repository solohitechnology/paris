require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./route/auth');
const blogpostRoute = require('./route/blog');
const paymentRoute = require('./route/payment');
const question = require('./route/quessionnier');
const serminarRoute = require('./route/serminar');
const certificate = require('./route/certificate');
const videoUpload = require('./route/upload_Video');
const uploadbookRoutes = require("./route/uploadBooks");

let cartItems = [];


const myMiddleware = (req, res, next) => {
  // Middleware logic here
  next(); // Call next() to pass control to the next middleware
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});


const app = express();
app.use(myMiddleware);

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth/', authRoute);
app.use('/api/cert', certificate);
app.use('/api/video', videoUpload);
// app.use('/api/question', question);
app.use('/api/blog', blogpostRoute);
app.use('/api/paystack', paymentRoute);
app.use('/api/seminar', serminarRoute);
app.use('/api/books', uploadbookRoutes);

app.post('/api/cart', (req, res) => {
  const items = req.body.items;
  cartItems.push(items); // Update the cart items on the server
  console.log('Received cart items:', cartItems);
  res.sendStatus(200);
});

app.get('/api/cart', (req, res) => {
  res.json(cartItems);
  console.log(cartItems.length)
});

app.get('api/books/files', async (req, res) => {
  try {
    // const files = await File.find();
    // res.json({ success: true, files });
    res.status(200).send('solohitechnology')
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Failed to get files' });
  }
});




app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
