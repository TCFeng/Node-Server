const express = require('express');
const expressWs = require('express-ws')(express());
const path = require('path');
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;
const app = expressWs.app;
const wss = expressWs.getWss('/webSocket');
const bodyParser = require('body-parser')

app.use("/scripts", express.static(__dirname + '/scripts'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/uploadPhoto', (req, res) => {
    res.sendFile(path.join(`${__dirname}/uploadPhoto.html`));
});

app.get('/showStatus', (req, res) => {
    res.sendFile(path.join(`${__dirname}/showStatus.html`));
});




app.post('/getServerPushInfo', (req, res) => {
    wss.clients.forEach(function (client) {
        client.send(JSON.stringify(req.body));
    });
    res.json({
        'msg': 'Success!!'
    });
});

app.ws('/webSocket', function (ws, req) {
    console.log('socket', '...');
});

//Temp Test
app.post('/getImageInfo', (req, res) => {

    var content = '';
    var image = '';

    if (req.headers['content-type'] === 'application/octet-stream') {

        var data = '';
        req.setEncoding('binary');

        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            var buf = new Buffer(data, 'binary');
             res.json({
                'msg': buf.toString('base64')
            });
        });

    }
});

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});


