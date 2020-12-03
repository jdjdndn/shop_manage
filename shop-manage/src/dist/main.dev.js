"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

require("./plugins/element.js");

require("./assets/css/global.css");

require("./assets/fonts/iconfont.css");

var _axios = _interopRequireDefault(require("axios"));

var _vueTableWithTreeGrid = _interopRequireDefault(require("vue-table-with-tree-grid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 全局样式
// 字体图标
_vue["default"].config.productionTip = false;
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

_axios["default"].interceptors.request.use(function (config) {
  config.headers.Authorization = sessionStorage.getItem('token');
  return config;
});

_vue["default"].prototype.$http = _axios["default"];

_vue["default"].filter('dateFormat', function (date) {
  var dt = new Date(date);
  var y = dt.getFullYear();
  var m = (dt.getMonth() + 1).toString().padStart(2, '0');
  var d = dt.getDate().toString().padStart(2, '0');
  var h = dt.getHours().toString().padStart(2, '0');
  var mm = dt.getMinutes().toString().padStart(2, '0');
  var s = dt.getSeconds().toString().padStart(2, '0');
  return "".concat(y, "-").concat(m, "-").concat(d, " ").concat(h, ":").concat(mm, ":").concat(s);
});

_vue["default"].component('tree-table', _vueTableWithTreeGrid["default"]);

new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');