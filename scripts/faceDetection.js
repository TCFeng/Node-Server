$().ready(function () {

    $('#detect').click(function () {
        var file = document.getElementById('photoImage').files[0];
        detectFaces(file);
    });

    function detectFaces(file) {
        
        $.ajax({
            url: "https://us-central1-polar-terminal-159303.cloudfunctions.net/helloHttp",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                $("#response").text("Calling api...");
                
            },
            type: "POST",
            data: file,
            processData: false
        })
            .done(function (response) {
                // Process the API response.
                processResult(response);
            })
            .fail(function (error) {
                // Oops, an error :(
                $("#response").text(error.getAllResponseHeaders());
            });
    }

    function processResult(response) {
        console.log(response.msg);
    }

});
