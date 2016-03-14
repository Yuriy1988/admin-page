/**
 * Created by gasya on 11.03.16.
 */
console.log("#XOPay demo generator");

const argumentParser = require("node-argument-parser");

const configs = require("./config");

const Requester = require('./lib/requester');

const _ = require('lodash');


const defaultArgv = require("./arg_parser.json").defaultArgv;
var argv = argumentParser.parse("./arg_parser.json", process);
argv = Object.assign({}, defaultArgv, argv);


const requester = new Requester(configs);

const endpoints = require("./endpoints");

const generateMerchant = require("./data/merchants");

const generateStore = require("./data/store");


requester.showLogs = argv.logs;

switch (argv.target) {
    case "merchant":
        for (var i = 0; i < argv.count; i++) {
            console.log(`Creating merchant [${i + 1}]`);
            requester.makeRequest(endpoints.CREATE_MERCHANT, generateMerchant());
        }
        break;
    case "store":
        if (typeof argv.mid == 'string') {
            var mid = parseIds(argv.mid);
            mid.forEach((id)=> {
                for (var i = 0; i < argv.count; i++) {
                    console.log(`Creating store for merchant(${id}) [${i + 1}]`);
                    requester.makeRequest(endpoints.CREATE_MERCHANT_STORE(id), generateStore());
                }
            })
        }
        break;
    default:
        console.warn("specify target. e.g: --target merchant");
}

function parseIds(ids) {
    var pattern = /^(\d*)\.\.(\d*)$/;
    if (pattern.test(ids)) {
        const result = ids.match(pattern);
        const idFrom = parseInt(result[1]);
        const idTo = parseInt(result[2]) + 1;
        return _.range(idFrom, idTo);
    } else {
        return [ids];
    }
}


/*



 for (var i = 0; i < 25; i++) {
 requester.makeRequest(endpoints.CREATE_MERCHANT, generateMerchant());
 }

 for (var i = 0; i < 5; i++) {
 for (var j = 0; j < 20; j++) {
 requester.makeRequest(endpoints.CREATE_MERCHANT_STORE(i), generateStore());
 }
 }

 */
//requester.makeRequest(endpoints.CREATE_MERCHANT, generateMerchant());





