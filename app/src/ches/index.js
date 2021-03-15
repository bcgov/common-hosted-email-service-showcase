const routes = require('./routes');

module.exports.mount = (app) => {
  const p = '/ches';
  app.use(p, routes);
  return p;
};
