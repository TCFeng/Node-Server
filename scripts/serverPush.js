$(function () {

    "use strict";

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
    var connection = new WebSocket('ws://127.0.0.1:8080/webSocket');

    connection.onopen = function () {
        console.log("Connection Open...");
    }

    connection.onerror = function (error) {
        console.log("Connection Error!");
    }

    connection.onmessage = function (message) {

        console.log(message);
    };


    setInterval(function() {
        if (connection.readyState !== 1) {
            console.log('Unable to comminucate with the WebSocket server.')
        }
    }, 3000);

});