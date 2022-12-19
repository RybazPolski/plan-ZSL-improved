const express = require("express");
const puppeteerTools = require('./utils/puppeteerTools')
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())

app.get('/plan', async (req, res)=>{
    res.status(200).send(
        await puppeteerTools.getAll()
    )
})

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)