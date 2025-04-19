const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

const port = 80;
const server = express();

// '/api'
server.use('/', require('./routers/api_router'));

// '/' & '/player'
server.use('/', require('./routers/pages_router'));

// '/frontend/:folder/:file'
server.use('/', require('./routers/files_router'));

//const ssl_server = https.createServer({key: 'rqrqwrdfsfAwrWQ', cert: '31241'}, server);

//ssl_server.listen(port, () => {console.log(`server start url: http://localhost:${port}/`)})

 server.listen(port, () => {console.log(`server start url: http://localhost:${port}/`)});