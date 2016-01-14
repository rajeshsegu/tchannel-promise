var scotchTape = require('scotch-tape');
var TChannel = require('tchannel');

var server = new TChannel();
var client = new TChannel();

var serverChan = server.makeSubChannel({
  serviceName: 'server-original'
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

test('TChannel Integration', function run(it) {
  server.listen(24040, '127.0.0.1', function onListen() {
    var clientChan = client.makeSubChannel({
      serviceName: 'server-original',
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
        serviceName: 'server-original',
        timeout: 1500
      });

      clientRequest
        .send('func1', 'arg 1', 'arg 2', function callback(err, res, arg2, arg3) {
          t.equal(res.ok, true);
          finish();
          t.end();
        })
    });

    it('should handle not ok', function should(t) {
      var clientRequest = clientChan.request({
        serviceName: 'server-original'
      });

      clientRequest
        .send('func2', 'arg 1', 'arg 2', function callback(err, res, arg2, arg3) {
          t.equal(res.ok, false);
          finish();
          t.end();
        });
    });

    it('should handle error', function should(t) {
      var clientRequest = clientChan.request({
        serviceName: 'server-original'
      });

      clientRequest
        .send('func3', 'arg 1', 'arg 2', function callback(err, res, arg2, arg3) {
          t.ok(err);
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
