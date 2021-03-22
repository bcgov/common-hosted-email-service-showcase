const routes = require('express').Router();
// const log = require('npmlog');

const keycloak = require('../components/keycloak');
const controller = require('./controller');

// const protector = token => {
//   const hasEmailSender = !!token.content.resource_access && token.hasApplicationRole('mssc', 'email_sender');
//   log.verbose('protector', `Token has Application Role "email_sender" in "mssc" = ${hasEmailSender}`);
//   return hasEmailSender;
// };

routes.get('/health', async (req, res, next) => {
  await controller.healthCheck(req, res, next);
});

// routes.get('/email', keycloak.protect(protector), (req, res, next) => {
routes.post('/email', keycloak.protect(), async (req, res, next) => {
  await controller.sendEmail(req, res, next);
});

// get status with path (eg: /msgId) or query parameters (eg: ?txId=123)
routes.get('/status/:msgId?', keycloak.protect(), async (req, res, next) => {
  await controller.getStatus(req, res, next);
});

// cancel message with path (eg: /msgId) or query parameters (eg: ?txId=123)
routes.delete('/cancel/:msgId?', keycloak.protect(), async (req, res, next) => {
  await controller.cancel(req, res, next);
});

routes.post('/merge', keycloak.protect(), async (req, res, next) => {
  await controller.merge(req, res, next);
});

routes.post('/merge/preview', keycloak.protect(), async (req, res, next) => {
  await controller.mergePreview(req, res, next);
});

module.exports = routes;
