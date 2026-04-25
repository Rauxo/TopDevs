const express = require('express')

const app = express();

const PORT = 500;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

