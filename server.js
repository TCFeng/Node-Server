const express = require('express');
const expressWs = require('express-ws')(express());
const path = require('path');
const http = require('http');
const request = require('request');
const fs = require('fs');


const port = process.env.PORT || 8080;
const app = expressWs.app;
const wss = expressWs.getWss('/webSocket');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/uploadPhoto', (req, res) => {
    res.sendFile(path.join(`${__dirname}/uploadPhoto.html`));
});

app.get('/showStatus', (req, res) => {
    //res.sendFile(path.join(`${__dirname}/showStatus.html`));
    getExternalIp((externalIp) => {
        res.render('showStatus', { externalIp: externalIp });
    });
});


const METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';

function getExternalIp(cb) {
    const options = {
        url: METADATA_NETWORK_INTERFACE_URL,
        headers: {
            'Metadata-Flavor': 'Google'
        }
    };

    request(options, (err, resp, body) => {
        if (err || resp.statusCode !== 200) {
            console.log('Error while talking to metadata server, assuming localhost');
            cb('localhost');
            return;
        }
        cb(body);
    });
}


app.post('/getServerPushInfo', (req, res) => {
    console.log("Size",wss.clients.size);
    wss.clients.forEach(function (client) {
        console.log("===",client._isServer);
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

const wsServer = app.listen('65080', () => {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});

http.createServer(app).listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Press Ctrl+C to quit.');
});


