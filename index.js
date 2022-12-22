const express = require("express");
const puppeteerTools = require('./utils/puppeteerTools')
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())
const cors = require('cors');
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get('/plan', async (req, res)=>{
    res.status(200).send(
        await puppeteerTools.getAll()
    )
})

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)