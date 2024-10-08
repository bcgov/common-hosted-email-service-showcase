const routes = require('express').Router();

const { authenticate } = require('../middleware/authentication');
const controller = require('./controller');

routes.get('/health', authenticate, async (req, res, next) => {
  await controller.healthCheck(req, res, next);
});

routes.post('/email', authenticate, async (req, res, next) => {
  await controller.sendEmail(req, res, next);
});

// get status with path (eg: /msgId) or query parameters (eg: ?txId=123)
routes.get('/status/:msgId?', authenticate, async (req, res, next) => {
  await controller.getStatus(req, res, next);
});

// cancel message with path (eg: /msgId) or query parameters (eg: ?txId=123)
routes.delete('/cancel/:msgId?', authenticate, async (req, res, next) => {
  await controller.cancel(req, res, next);
});

routes.post('/merge', authenticate, async (req, res, next) => {
  await controller.merge(req, res, next);
});

routes.post('/merge/preview', authenticate, async (req, res, next) => {
  await controller.mergePreview(req, res, next);
});

// promote message with path (eg: /msgId) or query parameters (eg: ?txId=123)
routes.post('/promote/:msgId?', authenticate, async (req, res, next) => {
  await controller.promote(req, res, next);
});

module.exports = routes;
