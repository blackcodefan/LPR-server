const express = require('express');

const app = express();
app.get('/hello', (req, res) =>{
    return res.status(200).send({"greeting": "hello world"});
});


const server = app.listen(process.env.PORT || 3000, () =>{
   console.log('Server is running on http://localhost:3000') 
});