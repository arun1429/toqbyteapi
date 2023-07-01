const http = require('http');
const app = require('./app');
const port = 7001;
const server = http.createServer(app);
const { createNewAdmin } = require('./createSuperAdmin');
const { dbConnect } = require('./helper/dbConnection');

dbConnect().then(_ => {
    createNewAdmin('123456');
    server.listen(port, _ => console.log(`Server is running on port ${port}`));
});