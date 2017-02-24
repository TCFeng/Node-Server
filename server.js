const express = require('express');
var expressWs = require('express-ws')(express());
const path = require('path');
const http = require('http');

const port = process.env.PORT || 8080;
var app = expressWs.app;



app.use("/scripts", express.static(__dirname + '/scripts'));

app.get('/uploadPhoto', (req, res) => {
    res.sendFile(path.join(`${__dirname}/uploadPhoto.html`));
});

app.get('/showStatus', (req, res) => {
    res.sendFile(path.join(`${__dirname}/showStatus.html`));
});

var wss = expressWs.getWss('/webSocket');

app.get('/getServerPushInfo', (req, res) => {

    wss.clients.forEach(function (client) {
        client.send('hello');
    });
     res.json({
       'msg':'Success!!'
    });
});

app.ws('/webSocket', function (ws, req) {
    console.log('socket', '...');
});

app.get('/api', (req, res) => {
    res.json({
        a: 1,
        b: 2,
        c: 3
    });
});

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});


