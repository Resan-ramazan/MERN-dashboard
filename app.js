const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/database');
const routes = require('./src/routes');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(routes)
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
