const express = require('express');
//const expressWs = require('express-ws')(express());
const path = require('path');
const http = require('http');
const request = require('request');
const fs = require('fs');


const port = process.env.PORT || 8080;
const app = express();
//const wss = expressWs.getWss('/webSocket');
const bodyParser = require('body-parser');

var tableIndex = 1;
var data = {
    textArray: [],
    imageObj: '',
    imageDetct: '',
};

function textState() {
    this.seq = 0,
        this.date = '',//now.toLocaleString(),
        this.sex = ''//imageJobj.textPayload[0].faceAttributes.gender
}

//app.set('view engine', 'ejs');
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/uploadPhoto', (req, res) => {
    res.sendFile(path.join(`${__dirname}/uploadPhoto.html`));
});

app.get('/showStatus', (req, res) => {
    res.sendFile(path.join(`${__dirname}/showStatus.html`));
});

app.get('/getHistoryInfo', (req, res) => {
    res.json({
        'result': data
    });
});

app.get('/cleanHistoryInfo', (req, res) => {
    data = {
        textArray: [],
        imageObj: '',
        imageDetct: '',
    }
    res.json({
        'result': 'OK'
    });
});

app.post('/getServerPushInfo', (req, res) => {

    var dataObj = req.body;
    var newTextState = new textState();
    var now = new Date();
    newTextState.seq = tableIndex++;
    newTextState.date = now.toLocaleString();
    newTextState.sex = dataObj.textPayload[0].faceAttributes.gender;
    data.textArray.unshift(newTextState);
    data.imageObj = dataObj.raw_image;
    data.imageDetct = dataObj.textPayload[0].faceRectangle;
    res.json({
        'msg': 'Success!!'
    });
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


http.createServer(app).listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log('Press Ctrl+C to quit!');
});



// app.ws('/webSocket', function (ws, req) {
//     console.log('socket', '...');
// });


// const wsServer = app.listen('65080', () => {
//     console.log('Websocket server listening on port %s', wsServer.address().port);
// });


// const METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
//     '/instance/network-interfaces/0/access-configs/0/external-ip';

// function getExternalIp(cb) {
//     const options = {
//         url: METADATA_NETWORK_INTERFACE_URL,
//         headers: {
//             'Metadata-Flavor': 'Google'
//         }
//     };

//     request(options, (err, resp, body) => {
//         if (err || resp.statusCode !== 200) {
//             console.log('Error while talking to metadata server, assuming localhost');
//             cb('localhost');
//             return;
//         }
//         cb(body);
//     });
// }

