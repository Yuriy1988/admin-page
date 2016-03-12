/**
 * Created by gasya on 12.03.16.
 * DigitalOutlooks corporation.
 */
"use strict";

const http = require('http');

class Requester {
    constructor(configs) {
        this.configs = configs;
        this.makeRequest = this.makeRequest.bind(this);
    }

    makeRequest(endpoint, data) {
        const postData = JSON.stringify(data);

        console.log("REQEST",endpoint, data);
        const options = {
            hostname: this.configs.host,
            port: this.configs.port,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = http.request(options, (res) => {
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

        req.write(postData);
        req.end();
    }
}

module.exports = Requester;