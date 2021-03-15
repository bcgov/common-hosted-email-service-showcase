const routes = require('express').Router();

const keycloak = require('../components/keycloak');
const controller = require('./controller');


// const protector = token => {
//   const hasEmailSender = !!token.content.resource_access && token.hasApplicationRole('mssc', 'email_sender');
//   log.verbose('protector', `Token has Application Role "email_sender" in "mssc" = ${hasEmailSender}`);
//   return hasEmailSender;
// };

console.log('controller');

// routes.get('/health', keycloak.protect(protector), (req, res, next) => {
routes.get('/health', keycloak.protect(), (req, res, next) => {
  controller.healthCheck(req, res, next);
});

module.exports = routes;
