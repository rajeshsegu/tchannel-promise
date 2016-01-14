var isPromise = require('is-promise');
var scotchTape = require('scotch-tape');
var TChannel = require('tchannel');

var channel;
var test = scotchTape({
  before: function createChannel(t) {
    channel = new TChannel();
    t.end();
  },
  after: function cleanup(t) {
    channel.close();
    t.end();
  }
});

test('#TChannel', function run(it) {
  it('should export', function should(t) {
    t.equal(typeof TChannel, 'function',
      'tchannel exported');
    t.end();
  });

  it('should not return a promise', function should(t) {
    var request = channel
      .makeSubChannel({serviceName: 'test'})
      .request();

    t.plan(1);
    var promise;
    try {
      promise = request
        .send('echo', 'arg1', 'arg2');
      t.notOk(isPromise(promise), 'not return a promise');
    }catch(ex) {
      t.notOk(isPromise(promise), 'not return a promise');
    }
    t.end();
  });
});
