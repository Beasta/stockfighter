var request = require('request'),
  keys = require("./keys.js");

var   apiKey = keys.apiKey,
      venue = "FOOEX",
      stock = "HOGE",
      base_url = "https://api.stockfighter.io/ob/api",
      account = keys.account;

var order = {
  "account" : account,
  "venue" : venue,
  "symbol" : stock,
  "price" : 95,
  "qty" : 10,
  "direction" : "buy",
  "orderType" : "limit"
};

var headers = {
  "X-Starfighter-Authorization" : apiKey
};

var options = {
  method : "POST",
  url: base_url + "/venues/" + order.venue + "/stocks/" + stock + "/orders",
  headers: headers
};

var theRequest = function(options,callback){

 var req = request.get(options);

 req.on('response', function(res){
   var chunks = [];

   res.on('data', function(chunk){
     chunks.push(chunk);
   });

    res.on('end', function(){
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];

      if (encoding == 'gzip'){
        zlib.gunzip(buffer, function(err, decoded){
          callback(err, decoded && decoded.toString());
        });
      } else if (encoding == 'deflate'){
        zlib.inflate(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else {
        callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err){
    callback(err);
  });

};

var theCall = function(){
  theRequest(options, function(err, data) {
      if (err) console.log('error', err);
      else{
        console.log('the response:');
        console.log(data);
      }
    }
  );
};

theCall();
