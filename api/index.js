const { URL } = require('url');

const ordersById = require('../server/api/orders/[id]');

const handlers = {
  'headers': require('../server/api/headers'),
  'cookies': require('../server/api/cookies'),
  'methods': require('../server/api/methods'),
  'error': require('../server/api/error'),
  'reflect': require('../server/api/reflect'),
  'sql': require('../server/api/sql'),
  'ping': require('../server/api/ping'),
  'files': require('../server/api/files'),
  'fetch': require('../server/api/fetch'),
  'log': require('../server/api/log'),
  'upload': require('../server/api/upload'),
  'validate': require('../server/api/validate'),
  'cors': require('../server/api/cors'),
  'rate-limit': require('../server/api/rate-limit'),
  'hash': require('../server/api/hash'),
  'update': require('../server/api/update'),
  'search': require('../server/api/search'),
  'feedback': require('../server/api/feedback'),
  'users': require('../server/api/users'),
  'orders': require('../server/api/orders'),
  'graphql': require('../server/api/graphql'),
  'soap': require('../server/api/soap'),
  'include': require('../server/api/include'),
  'admin': require('../server/api/admin/index'),
  'admin/users': require('../server/api/admin/users'),
  'admin/secrets': require('../server/api/admin/secrets'),
  'auth/login': require('../server/api/auth/login'),
  'auth/reset': require('../server/api/auth/reset'),
  'auth/session': require('../server/api/auth/session'),
  'jwt/decode': require('../server/api/jwt/decode'),
  'cms/wp-json': require('../server/api/cms/wp-json'),
  'cms/drupal': require('../server/api/cms/drupal'),
  'cms/joomla': require('../server/api/cms/joomla'),
  'platform/aspnet': require('../server/api/platform/aspnet'),
  'platform/phpinfo': require('../server/api/platform/phpinfo'),
  'platform/node': require('../server/api/platform/node'),
  'platform/python': require('../server/api/platform/python'),
  'platform/java': require('../server/api/platform/java'),
  'platform/ruby': require('../server/api/platform/ruby'),
  'internal/metrics': require('../server/api/internal/metrics'),
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
