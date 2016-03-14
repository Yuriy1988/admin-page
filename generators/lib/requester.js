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
        this.showLogs = false;
    }

    makeRequest(endpoint, data) {
        const postData = JSON.stringify(data);

        if (this.showLogs) console.log("REQEST",endpoint);
        if (this.showLogs) console.log("REQEST_DATA", data);
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
            if (this.showLogs) console.log(`STATUS: ${res.statusCode}`);
            if (this.showLogs) console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                if (this.showLogs) console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                if (this.showLogs) console.log('No more data in response.')
            })
        });

        req.on('error', (e) => {
            if (this.showLogs) console.log(`problem with request: ${e.message}`);
        });

        req.write(postData);
        req.end();
    }
}

module.exports = Requester;