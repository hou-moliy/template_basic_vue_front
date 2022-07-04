// 此文件用于'main.js'一次性导入所有directives模块，一般情况下不要修改！！！
const directivesFiles = require.context('.', false, /\.js$/);
const directives = {};
directivesFiles.keys().forEach(key => {
  if (key === './index.js') { return; }
  directives[key.replace(/(\.\/|\.js)/g, '')] = (directivesFiles(key).default || directivesFiles(key));
});
export default {
  install (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  }
};
