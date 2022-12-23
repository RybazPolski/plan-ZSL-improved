const express = require("express");
const puppeteerTools = require('./utils/puppeteerTools')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json(),express.static(__dirname))


const cors = require('cors');
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get('/getAll', async (req, res)=>{
    res.status(200).send(
        await puppeteerTools.getAll()
    )
})

app.get('/demo', function(req, res) {
    res.sendFile(path.join(__dirname, '/demo.html'));
  });

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)