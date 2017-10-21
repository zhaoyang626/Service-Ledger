'use strict'

var rp = require('request-promise');
var config = require('config');
var url = require('url');
var hyperledger_paras = config.get('hyperledger-service');

var debug = true;

module.exports.initChaincode = function initChaincode(req, res, next) {

  if(debug) console.log('---->ServiceLedger: initChaincode method called');

  var examples = {};
  examples['application/json'] = {
    "message": "example message of initChaincode"
  }
  
  rp({
      method: "POST",
      uri: url.format({
          protocol: 'http',
          hostname: hyperledger_paras.host,
          port: hyperledger_paras.port,
          pathname: hyperledger_paras.path.init
      }), 
      body: {
          "chaincodeName": req.body.chaincodeName,
          "chaincodeVersion": req.body.chaincodeVersion,
          "chaincodeType": req.body.chaincodeType,
          "args": req.body.args
      },
      header: {
          "authorization": req.body.authorization,
          "content-type": "application/json"
      },
      json: true
  }).then(response => {
      if(debug) console.log(response);

      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => {
      if(debug) console.log("----->ServiceLedger: error when requesting hyperledger!");
      examples['application/json'].message = "error when requesting hyperledger";
  
      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  });

}
