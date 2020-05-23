
const { setRoutes } = require('./routes')
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000

async function startServer() {
    const app = express()

    app.use(bodyParser.json());

    await setRoutes(app);
    
    app.listen(port, () => console.log(`Server started at port ${port}`))
}

startServer();
