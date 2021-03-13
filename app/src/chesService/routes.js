const log = require('npmlog');

const keycloak = require('../components/keycloak');
const routes = require('express').Router();

const { healthCheck } = require('./controller');

// const protector = token => {
//   const hasEmailSender = !!token.content.resource_access && token.hasApplicationRole('mssc', 'email_sender');
//   log.verbose('protector', `Token has Application Role "email_sender" in "mssc" = ${hasEmailSender}`);
//   return hasEmailSender;
// };

routes.get('/', (req, res) => {
  res.status(200).json({
    links: relatedLinks.createLinks(req, [
      { r: 'email', m: 'GET', p: '/email' }
    ])
  });
});

// routes.get('/health', keycloak.protect(protector), (req, res, next) => {
routes.get('/health', keycloak.protect(), (req, res, next) => {
  healthCheck(req, res, next);
});


module.exports = routes;
