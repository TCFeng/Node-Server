$(function () {

    "use strict";

    var $table = $('#detHistoryTable');
    var tableIndex = 1;
    var data = []
    $table.bootstrapTable({data: data});


    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', {
            text: 'Sorry, but your browser doesn\'t '
            + 'support WebSockets.'
        }));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var connection = new WebSocket('ws://'+location.host+'/webSocket');

    connection.onopen = function () {
        console.log("Connection Open...");
    }

    connection.onerror = function (error) {
        console.log("Connection Error!");
    }

    connection.onmessage = function (message) {
        var now = new Date();
        var imageJobj = JSON.parse(message.data);
        var imageInfo = {
            'seq': tableIndex++,
            'date': now.toLocaleString(),
            'sex': imageJobj.textPayload[0].faceAttributes.gender
        }


        $table.bootstrapTable('prepend', imageInfo);
        showImage(imageJobj);
    };


    setInterval(function() {
        if (connection.readyState !== 1) {
            console.log('Unable to comminucate with the WebSocket server.')
        }
    }, 3000);

    function showImage(imageJobj) {

        var imageBase64 = imageJobj.raw_image

        var canvas = document.getElementById("photoImage");
        var context = canvas.getContext("2d");
        
        var image = new Image();

        image.src = 'data:image/jpeg;base64,'+ imageBase64;

        var width = image.naturalWidth; 
        var height = image.naturalHeight; 
        
        canvas.width = width;
        canvas.height = height;

        
        image.onload = function () {
            context.drawImage(image, 0, 0);
            detectFace(imageJobj.textPayload)
        }
    }

    function detectFace(textPayload) {
        var arrayLength = textPayload.length;

        if (arrayLength > 0) {
            var canvas = document.getElementById('photoImage');
            var context = canvas.getContext('2d');
            context.beginPath();

            for (var i = 0; i < arrayLength; i++) {
                var faceRectangle = textPayload[i].faceRectangle;
                context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);
            }

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
        }
    }

});