const { URL } = require('url');

const ordersById = require('../server/api 2/orders/[id]');

const handlers = {
  'headers': require('../server/api 2/headers'),
  'cookies': require('../server/api 2/cookies'),
  'methods': require('../server/api 2/methods'),
  'error': require('../server/api 2/error'),
  'reflect': require('../server/api 2/reflect'),
  'sql': require('../server/api 2/sql'),
  'ping': require('../server/api 2/ping'),
  'files': require('../server/api 2/files'),
  'fetch': require('../server/api 2/fetch'),
  'log': require('../server/api 2/log'),
  'upload': require('../server/api 2/upload'),
  'validate': require('../server/api 2/validate'),
  'cors': require('../server/api 2/cors'),
  'rate-limit': require('../server/api 2/rate-limit'),
  'hash': require('../server/api 2/hash'),
  'update': require('../server/api 2/update'),
  'search': require('../server/api 2/search'),
  'feedback': require('../server/api 2/feedback'),
  'users': require('../server/api 2/users'),
  'orders': require('../server/api 2/orders'),
  'graphql': require('../server/api 2/graphql'),
  'soap': require('../server/api 2/soap'),
  'include': require('../server/api 2/include'),
  'admin': require('../server/api 2/admin/index'),
  'admin/users': require('../server/api 2/admin/users'),
  'admin/secrets': require('../server/api 2/admin/secrets'),
  'auth/login': require('../server/api 2/auth/login'),
  'auth/reset': require('../server/api 2/auth/reset'),
  'auth/session': require('../server/api 2/auth/session'),
  'jwt/decode': require('../server/api 2/jwt/decode'),
  'cms/wp-json': require('../server/api 2/cms/wp-json'),
  'cms/drupal': require('../server/api 2/cms/drupal'),
  'cms/joomla': require('../server/api 2/cms/joomla'),
  'platform/aspnet': require('../server/api 2/platform/aspnet'),
  'platform/phpinfo': require('../server/api 2/platform/phpinfo'),
  'platform/node': require('../server/api 2/platform/node'),
  'platform/python': require('../server/api 2/platform/python'),
  'platform/java': require('../server/api 2/platform/java'),
  'platform/ruby': require('../server/api 2/platform/ruby'),
  'internal/metrics': require('../server/api 2/internal/metrics'),
  'validate/xss-reflected': require('../server/api 2/validate/xss-reflected'),
  'validate/sqli-error': require('../server/api 2/validate/sqli-error'),
  'validate/idor': require('../server/api 2/validate/idor'),
  'validate/localstorage': require('../server/api 2/validate/localstorage'),
  'validate/secret-scanner': require('../server/api 2/validate/secret-scanner'),
  'validate/git-exposure': require('../server/api 2/validate/git-exposure'),
  'validate/cors': require('../server/api 2/validate/cors'),
  'validate/upload': require('../server/api 2/validate/upload'),
  'validate/input-validation': require('../server/api 2/validate/input-validation'),
  'validate/security-headers': require('../server/api 2/validate/security-headers'),
  'validate/env-file': require('../server/api 2/validate/env-file'),
  'validate/clickjacking': require('../server/api 2/validate/clickjacking'),
};

module.exports = async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const params = Object.fromEntries(url.searchParams.entries());
  req.query = Object.assign({}, req.query || {}, params);

  const rawPath = (params.path || '').replace(/^\/+|\/+$/g, '');
  const path = rawPath || '';

  if (!path) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({
      message: 'API router online',
      hint: 'Use /api/{endpoint}',
      endpoints: Object.keys(handlers)
    }, null, 2));
  }

  // Dynamic order ID route
  if (path.startsWith('orders/')) {
    const id = path.split('/')[1];
    req.query.id = id;
    return ordersById(req, res);
  }

  const handler = handlers[path];
  if (!handler) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: 'Not found', path }, null, 2));
  }

  return handler(req, res);
};
