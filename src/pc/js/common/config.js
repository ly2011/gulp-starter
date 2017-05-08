'use strict';

/**
 * 判断是否为空
 * @param  {string}  v [description]
 * @return {Boolean}   [description]
 */
function isEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true;

    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0)
        return true;
      break;

    case 'boolean':
      if (!v) return true;
      break;

    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;

    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}
/**
 * 判断是否是微信浏览器
 * @return {Boolean} [description]
 */
var isWeiXin = function() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
};

function getParamFromUrl() {
  var o = {};
  var url = location.search.substr(1);
  url = url.split('&');
  for (var i = 0; i < url.length; i++) {
    var param = url[i].split('=');
    o[param[0]] = param[1];
  }
  var hash_o = {};
  var hash_url = location.hash.split('?');
  if (hash_url.length > 1) {
    hash_url = hash_url[1];
    hash_url = hash_url.split('&');
    for (var j = 0, len = hash_url.length; j < len; j++) {
      var param = hash_url[j].split('=');
      hash_o[param[0]] = param[1];
    }
  }
  extend(o, hash_o);
  return o;
}

function extend(dest, from) {
  var props = Object.getOwnPropertyNames(from), destination;

  props.forEach(function(name) {
    if (typeof from[name] === 'object') {
      if (typeof dest[name] !== 'object') {
        dest[name] = {};
      }
      extend(dest[name], from[name]);
    } else {
      destination = Object.getOwnPropertyDescriptor(from, name);
      Object.defineProperty(dest, name, destination);
    }
  });
}
// 配置常用变量beigin
window._global_setting = {};
window._global_setting.domain_env = {
  localhost: 'local', //本地环境
  '127.0.0.1': 'local', //本地环境

  'dev.google.com': 'dev', //开发环境

  /*2.0版本*/
  'www.google.com': 'prod2.0' //生产环境
};
window._global_setting.env_setup = {
  local: {
    api_domain: 'http://localhost:8000'
  },
  dev: {
    api_domain: 'http://apidev.google.com:8000'
  },
  prod: {
    api_domain: 'http://api.google.com:8000'
  },

  /*2.0版本*/
  'prod2.0': {
    api_domain: 'http://api.google.com:8000'
  }
};
// api接口路径
var env_name = window._global_setting.domain_env[location.hostname];
if (!env_name) {
  env_name = 'prod2.0';
}
window._global_setting.currentEnvSetup =
  window._global_setting.env_setup[env_name];
window._global_setting.api_domain =
  window._global_setting.currentEnvSetup.api_domain;
var _api_domain = window._global_setting.api_domain;
// api接口路径
window.api_url = _api_domain;
window.json_url = _api_domain + '/json/';
