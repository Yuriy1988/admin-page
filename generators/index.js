/**
 * Created by gasya on 11.03.16.
 */
console.log("#XOPay demo generator");

const http = require("http");
const configs = require("./config");

const generateMerchant = require("./data/merchants");

console.log();


var postData = JSON.stringify(generateMerchant());


var options = {
    hostname: configs.host,
    port: configs.port,
    path: '/api/admin/dev/merchants',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.')
    })
});

req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();