
const { setRoutes } = require('./routes')
const express = require('express');
const port = 3000

async function startServer() {
    const app = express()

    await setRoutes(app);
    
    app.listen(port, () => console.log(`Server started at port ${port}`))
}

startServer();
