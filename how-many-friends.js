
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var giphyUrl =  "http://tv.giphy.com/v1/gifs/tv?api_key=dc6zaTOxFJmzC&tag={tag}";

//We need a function which handles requests and send response
function handleRequest(req, res){
    var data = "";
    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function(){
        var decodedBody = querystring.parse(data);
        getFriendCount(decodedBody.text, function(friendCount){
            console.log(friendCount);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                "response_type": "in_channel",
                "text": friendCount
            }));
        });
    });
}

function getFriendCount(username, callback){
    username = username.toLowerCase();
    if(username == "jim" || username == "jeverett" || username == "@jeverett" || username == "everett"){
        return getGifUrl("lonely", callback);
    } else {
        return callback("too many to count");
    }
}

function getGifUrl(tag, callback){
    var requestUrl = giphyUrl.replace('{tag}', tag);
    http.get(requestUrl, function(response){
        response.setEncoding('utf8');
        var body = '';
        response.on('data', function(data){
            body += data;
        });
        response.on('end', function(){
            var responseObject = JSON.parse(body);
            if(responseObject.data.url){
                callback(responseObject.data.url);
            }
        });
    });
}

const PORT=8080;
//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

