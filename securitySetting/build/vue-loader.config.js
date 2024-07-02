const precompile = require("weex-vue-precompiler")();

module.exports = {
  optimizeSSR: false,
  compilerOptions: {
    modules: [{
      postTransformNode: el => {
        precompile(el);
      }
    }]
  }
};