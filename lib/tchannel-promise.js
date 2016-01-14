var forceRequire = require('./force-require');
var Bluebird = require('bluebird');
var TChannel = forceRequire('tchannel');

var origTChannelRequest = TChannel.prototype.request;

TChannel.prototype.request = function channelRequest() {
  var request = origTChannelRequest.apply(this, arguments);

  var origSend = request.send;
  request.send = function send(arg1, arg2, arg3) {
    return new Bluebird(function cb(resolve, reject) {
      function handleCallback(err, resp, origArg2, origArg3) {
        if (err) {
          reject(err);
        } else {
          var result = {
            response: resp,
            arg2: origArg2,
            arg3: origArg3
          };
          resolve(result);
        }
      }

      origSend.call(request, arg1, arg2, arg3, handleCallback);
    });
  };

  return request;
};

module.exports = TChannel;
