$(function () {

    "use strict";

    var $table = $('#detHistoryTable');
    var tableIndex = 1;
    var data = []
    $table.bootstrapTable({ data: data });

    setInterval(function () {

        $.ajax({
            //url: "https://us-central1-polar-terminal-159303.cloudfunctions.net/helloHttp",
            url: "http://" + location.host + "/getHistoryInfo",
            type: "GET",
            dataType: "json",
            success: function (Jdata) {
                $table.bootstrapTable('load', Jdata.result.textArray);
                showImage(Jdata.result);
            },
            error: function () {
                console.log("ERROR!!!");
            }
        })

    }, 1000);



    // // if user is running mozilla then use it's built-in WebSocket
    // window.WebSocket = window.WebSocket || window.MozWebSocket;

    // // if browser doesn't support WebSocket, just show some notification and exit
    // if (!window.WebSocket) {
    //     content.html($('<p>', {
    //         text: 'Sorry, but your browser doesn\'t '
    //         + 'support WebSockets.'
    //     }));
    //     input.hide();
    //     $('span').hide();
    //     return;
    // }

    // // open connection
    // var externalIp = '';
    // var connection = new WebSocket('ws://'+'127.0.0.1:8080'+'/webSocket');

    // connection.onopen = function () {
    //     console.log("Connection Open...");
    // }

    // connection.onerror = function (error) {
    //     console.log("Connection Error!");
    // }

    // connection.onmessage = function (message) {
    //     var now = new Date();
    //     var imageJobj = JSON.parse(message.data);
    //     var imageInfo = {
    //         'seq': tableIndex++,
    //         'date': now.toLocaleString(),
    //         'sex': imageJobj.textPayload[0].faceAttributes.gender
    //     }


    //     $table.bootstrapTable('prepend', imageInfo);
    //     showImage(imageJobj);
    // };


    // setInterval(function() {
    //     if (connection.readyState !== 1) {
    //         console.log('Unable to comminucate with the WebSocket server.')
    //     }
    // }, 3000);

    function showImage(imageJobj) {

        var imageBase64 = imageJobj.imageObj

        var canvas = document.getElementById("photoImage");
        var context = canvas.getContext("2d");

        var image = new Image();

        image.src = 'data:image/jpeg;base64,' + imageBase64;

        var width = image.naturalWidth;
        var height = image.naturalHeight;

        canvas.width = width;
        canvas.height = height;


        image.onload = function () {
            context.drawImage(image, 0, 0);
            detectFace(imageJobj.imageDetct)
        }
    }

    function detectFace(textPayload) {

        if (textPayload != null) {
            var canvas = document.getElementById('photoImage');
            var context = canvas.getContext('2d');
            context.beginPath();

            context.rect(textPayload.left, textPayload.top, textPayload.width, textPayload.height);

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
        }
    }

});