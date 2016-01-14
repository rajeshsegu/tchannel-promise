var PromiseTChannel = require('../');
var scotchTape = require('scotch-tape');
var TChannel = require('tchannel');

var server = new TChannel();
var client = new PromiseTChannel();

var serverChan = server.makeSubChannel({
  serviceName: 'server'
});

// normal response
serverChan.register('func1', function onReq(req, res, arg2, arg3) {
  // console.log('func1 responding with a small delay', {
  //  arg2: arg2.toString(),
  //  arg3: arg3.toString()
  // });
  setTimeout(function onTimeout() {
    res.headers.as = 'raw';
    res.sendOk('result', 'indeed it did');
  }, Math.random() * 1000);
});

// error response
serverChan.register('func2', function onReq2(req, res) {
  res.headers.as = 'raw';
  res.sendNotOk(null, 'it failed');
});

// error
serverChan.register('func3', function onReq2(req, res) {
  res.headers.as = 'raw';
  res.sendError(404, 'failed');
});

var test = scotchTape();

test('#TChannel Promise', function run(it) {
  server.listen(14040, '127.0.0.1', function onListen() {
    var clientChan = client.makeSubChannel({
      serviceName: 'server',
      peers: [server.hostPort],
      requestDefaults: {
        hasNoParent: true,
        headers: {
          as: 'raw',
          cn: 'example-client'
        }
      }
    });

    it('should handle ok', function should(t) {
      var clientRequest = clientChan.request({
        serviceName: 'server',
        timeout: 1500
      });

      clientRequest
        .send('func1', 'arg 1', 'arg 2')
        .then(function success(result) {
          var res = result.response;
          t.equal(res.ok, true);
          // console.log('normal res:', {
          //  arg2: result.arg2.toString(),
          //  arg3: result.arg3.toString()
          // });
        })
        .finally(function final() {
          finish();
          t.end();
        });
    });

    it('should handle not ok', function should(t) {
      var clientRequest = clientChan.request({
        serviceName: 'server'
      });

      clientRequest
        .send('func2', 'arg 1', 'arg 2')
        .then(function success(result) {
          var res = result.response;
          t.equal(res.ok, false);
          // console.log('err res: ', {
          //  ok: res.ok,
          //  message: String(result.arg3)
          // });
        })
        .finally(function final() {
          finish();
          t.end();
        });
    });

    it('should handle error', function should(t) {
      var clientRequest = clientChan.request({
        serviceName: 'server'
      });

      clientRequest
        .send('func3', 'arg 1', 'arg 2')
        .then(function success() {
          t.ok(false, 'should not call success');
        }, function error(err) {
          t.ok(err);
        })
        .finally(function final() {
          finish();
          t.end();
        });
    });
  });
});

var counter = 3;
function finish(err) {
  if (err) {
    throw err;
  }

  if (--counter === 0) {
    server.close();
    client.close();
  }
}
