var assign = require('assign');

function clearCache() {
  Object.keys(require.cache)
    .forEach(function item(key) {
      delete require.cache[key];
    });
}

function forceRequire(module) {
  var temp = assign({}, require.cache);
  clearCache();

  var freshModule = require(module);

  clearCache();
  assign(require.cache, temp);

  return freshModule;
}

module.exports = forceRequire;
