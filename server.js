const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); // Used for end point data retrieval from playwright module
const FS = require('fs-extra');
const DiscordBot = require('./routes/startDiscordBot');

// Express server configuration
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handling
const routes = require('./routes/routes.js')(app, FS);

// Launch server on port 3001
const server = app.listen(3001, () => {
  // console.log('listening on port %s...', server.address().port);
});