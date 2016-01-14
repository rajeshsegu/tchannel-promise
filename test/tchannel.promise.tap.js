var Bluebird = require('bluebird');
var isPromise = require('is-promise');
var scotchTape = require('scotch-tape');
var TChannelPromise = require('../');

var channel;
var test = scotchTape({
  before: function createChannel(t) {
    channel = new TChannelPromise();
    t.end();
  },
  after: function cleanup(t) {
    channel.close();
    t.end();
  }
});

test('#TChannel Promise', function run(it) {
  it('should export', function should(t) {
    t.equal(typeof TChannelPromise, 'function',
      'tchannel-promise exported');
    t.end();
  });

  it('should return a promise', function should(t) {
    var promise = channel
      .makeSubChannel({serviceName: 'test'})
      .request()
      .send('echo', 'arg1', 'arg2');

    promise.catch(function onError() {
      t.ok(true, 'exception handled');
    });

    t.ok(isPromise(promise),
      'tchannel returned a promise');

    t.end();
  });

  it('should be a bluebird promise', function should(t) {
    var promise = channel
      .makeSubChannel({serviceName: 'test'})
      .request()
      .send('echo', 'arg1', 'arg2');

    promise.catch(function onError() {
      t.ok(true, 'exception handled');
    });

    t.ok(promise instanceof Bluebird,
      'promise instance of bluebird');

    t.end();
  });
});
