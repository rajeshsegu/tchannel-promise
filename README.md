# tchannel-promise [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status](https://coveralls.io/repos/rajeshsegu/tchannel-promise/badge.svg?branch=master&service=github)](https://coveralls.io/github/rajeshsegu/tchannel-promise?branch=master)
> tchannel promises

## Installation

```sh
$ npm install tchannel-promise --save
```

## Usage

```js
var TchannelPromise = require('tchannel-promise');

var tchannel = new TChannelPromise(options);
var channel = tchannel.makeSubChannel({serviceName: 'test'});
var promise = channel.request()
    .send('echo', 'arg1', 'arg2')
    .then(function success(result){
      // implement success
    }, function fail(err){
      // implement failure
    })


```

## License

 © [Rajesh Segu](https://www.npmjs.com/~rajeshsegu)


[npm-image]: https://badge.fury.io/js/tchannel-promise.svg
[npm-url]: https://npmjs.org/package/tchannel-promise
[travis-image]: https://travis-ci.org/rajeshsegu/tchannel-promise.svg?branch=master
[travis-url]: https://travis-ci.org/rajeshsegu/tchannel-promise
[daviddm-image]: https://david-dm.org/rajeshsegu/tchannel-promise.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/rajeshsegu/tchannel-promise
[coveralls-image]: https://coveralls.io/repos/rajeshsegu/tchannel-promise/badge.svg
[coveralls-url]: https://coveralls.io/r/rajeshsegu/tchannel-promise
