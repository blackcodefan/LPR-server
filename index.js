const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.static('upload'));

// mongoose.connect(process.env.ATLAS_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
// mongoose.connection.once('open', () =>{
//     console.log('MongoDB connection established successfully!')
// });

app.use('/storage', routes.StorageRouter);

app.listen(process.env.PORT || 5000, () =>{
   console.log(`Server is running on http://localhost:${process.env.PORT}`);
});