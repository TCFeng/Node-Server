$().ready(function () {

    $('#detect').click(function () {
        var file = document.getElementById('photoImage').files[0];
        detectFaces(file);
    });

    $("#photoImage").change(function () {
        var that = this;
        showImage(that);
    });

    function detectFaces(file) {
        //var apiKey = "cb0fddfeb3074fa68327487511f7ab18";
        var apiKey = "26024800e0c347b2b29722d3823de056";

        // Call the API
        $.ajax({
            url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=false&returnFaceAttributes=gender",
            //url: "http://127.0.0.1:8080/getImageInfo",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
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
        var arrayLength = response.length;

        if (arrayLength > 0) {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            var sex = "";
            context.beginPath();

            // Draw face rectangles into canvas.
            for (var i = 0; i < arrayLength; i++) {
                var faceRectangle = response[i].faceRectangle;
                sex = response[i].faceAttributes.gender;
                context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);
            }

            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
        }

        // Show the raw response.
        var data = JSON.stringify(response);
        
        $("#response").text(sex);
        if(sex==='male'){
            $("#response").css("color","blue");
        }else if(sex==='female'){
            $("#response").css("color","red");
        }
    }

    function showImage(that) {

        var selectedFile = that.files[0];
        selectedFile.convertToBase64(function (base64) {
            console.log(base64);
        })

        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        var input = document.getElementById("photoImage");
        var img = new Image;

        img.onload = function () {
            context.drawImage(img, 0, 0);
        }

        img.src = URL.createObjectURL(input.files[0]);
    }

    File.prototype.convertToBase64 = function (callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result)
        };
        reader.onerror = function (e) {
            callback(null);
        };
        reader.readAsDataURL(this);
    };


});
