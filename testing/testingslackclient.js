// Testing for @slack/client api
var common = require ('../common/common');
var util = require('util');

var proxiedRequestTransport = require('@slack/client/lib/clients/transports/request.js').proxiedRequestTransport;
var wsTransport = require('@slack/client/lib/clients/transports/ws');

var RtmClient = require('@slack/client').RtmClient;
var token = common.config().slack_token || '';

var rtm = new RtmClient(
  common.config().slack_token || '',
  {
    logLevel: 'debug',
    transport: proxiedRequestTransport('http://10.110.8.42:8080'),
    socketFn: function(socketUrl) {
        return wsTransport(socketUrl, {
            proxyURL: 'http://10.110.8.42:8080',
            // there's a mistake in transport/ws.js that tries to use both "proxyURL" and "proxyUrl"
            // so just submit both options for now as a temporary workaround.
            proxyUrl: 'http://10.110.8.42:8080'
        });
    }
  }
);

rtm.start();

var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

rtm.on(CLIENT_EVENTS.RTM_AUTHENTICATED, function(rtmStartData){
  console.log('RTM_AUTHENTICATED. Data:'+ util.inspect(rtmStartData));
});
