var http = require('http');
var server = http.createServer();
var fs = require('fs');
var request = require('request');
var re = /^\/currencies\/(\w+)/;
var currencies = {
    CAN: 'CDN',
    US: 'USD',
    CHINA: 'YEN'
}

function getValue(currency, callback) {
    request.get('http://api.fixer.io/latest?base=USD', function (err, res, body) {
        if (err) throw err;
        var value = JSON.parse(body).rates[currency];
        callback(value);
    })
}

server.on('request', function (request, response) {
    request.on('error', function (err) {
        console.log(err);
    });

    response.on('error', function (err) {
        console.log(err);
    });

    var match = request.url.match(re);




    if (match) {

        var currency = currencies[match[1] || ''];

        getValue(currency, function (value) {
            var sentence = `The currnency for ${match[1]} is ${currency}. <br> 1 USD = ${value} ${currency}`;
            fs.readFile('index.html', 'utf-8', function (err, contents) {
                response.write(contents.replace('$contents', sentence));
                response.end();
            });

        })
    };
})

server.listen(8080, function () {
    console.log('server is listening');
})
