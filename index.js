const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const base = `${__dirname}/public`;
const bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});


app.listen(port);

app.get('/', function (req, res) {
    res.sendFile(`${base}/index.html`);
});