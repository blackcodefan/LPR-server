const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());
app.use(express.static('upload'));

app.get('/', (req, res) =>{
   return res.status(200).send({"message": "hello server is running!"})
});

app.use('/storage', routes.StorageRouter);

app.listen(process.env.PORT || 5000, () =>{
   console.log(`Server is running on http://localhost:${process.env.PORT}`);
});