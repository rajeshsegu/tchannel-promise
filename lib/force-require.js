var assign = require('assign');

function forceRequire(module) {

  function clearCache() {
    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });
  }

  var temp = assign({}, require.cache);
  clearCache();

  var freshModule = require(module);

  clearCache();
  assign(require.cache, temp);

  return freshModule;
}

module.exports = forceRequire;
