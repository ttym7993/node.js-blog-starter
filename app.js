/**
 * app.js
 */

var express = require('express');
var partials = require('express-partials');
var config = require('./config').config;
var route = require('./routes');

var app = express();
// 静态文件目录
var staticDir = __dirname + '/public/';
// 视图文件目录
var viewsDir = __dirname + '/views/';
// favicon
var faviconPath = staticDir + 'images/favicon.ico';

/**
 * setting 
 */

app.set('port', config.port);
app.set('views', viewsDir);
// app.set('view engine', 'ejs');
// 更改模板引擎
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

/**
 * midware
 */

// static assets
app.use(express.static(staticDir));
// partials
app.use(partials());
// favicon
app.use(express.favicon(faviconPath));
// bodyParser
app.use(express.bodyParser());

// 路由
route.handle(app);

// 开发环境
if ('development' == app.get('env')) {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
}

// 生产环境
if ('production' == app.get('env')) {
  // 404
  app.use(function handleNotFound(req, res) {
    route.handleNotFound(req, res);
  });

  // 500
  app.use(function handlerError(err, req, res, next) {
    route.handleNotFound(err, req, res, next);
  });

  // 视图缓存
  app.set('view cache', true);
}

// 端口号
app.listen(3000);
