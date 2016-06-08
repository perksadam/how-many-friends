
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var rp = require('request-promise');

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
        return getGifUrl("lonely", callback).then(function(url){
            return callback(url);
        });
    } else {
        return callback("too many to count");
    }
}

function getGifUrl(tag){
    var requestUrl = giphyUrl.replace('{tag}', tag);

    return rp({
        uri: requestUrl,
        json: true
    }).then(function(response){
        return response.data.url;
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

