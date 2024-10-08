const config = require('config');
const jwt = require('jsonwebtoken');
const Problem = require('api-problem');

/**
 * @function _spkiWrapper
 * Wraps an SPKI key with PEM header and footer
 * @param {string} spki The PEM-encoded Simple public-key infrastructure string
 * @returns {string} The PEM-encoded SPKI with PEM header and footer
 */
const _spkiWrapper = (spki) => `-----BEGIN PUBLIC KEY-----\n${spki}\n-----END PUBLIC KEY-----`;

module.exports = {
  /**
   * Performs JWT verification.
   */
  authenticate: (req, res, next) => {

    const authorization = req.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new Problem(401, {
        detail: 'An authorization header of the format "Bearer {token}" is required'
      }).send(res);
    }
    const bearerToken = authorization.substring(7);

    try {
      const publicKey = config.get('frontend.keycloak.publicKey');
      const pemKey = publicKey.startsWith('-----BEGIN') ? publicKey : _spkiWrapper(publicKey);

      jwt.verify(bearerToken, pemKey, {
        issuer: `${config.get('frontend.keycloak.serverUrl')}/realms/${config.get('frontend.keycloak.realm')}`,
        audience: config.get('frontend.keycloak.clientId')
      });
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError || err instanceof jwt.NotBeforeError) {
        return new Problem(401, {
          detail: err.message
        }).send(res);
      }
      else {
        // Return HTTP 401 only for JWT errors; the rest should be HTTP 500
        if (!config.has('frontend.keycloak.publicKey')) {
          throw new Error('OIDC environment variable FRONTEND_KC_PUBLICKEY or frontend.keycloak.publicKey must be defined');
        }
        else if (!config.has('frontend.keycloak.serverUrl')) {
          throw new Error('OIDC environment variable FRONTEND_KC_SERVERURL or frontend.keycloak.serverUrl must be defined');
        }
        else if (!config.has('frontend.keycloak.realm')) {
          throw new Error('OIDC environment variable FRONTEND_KC_REALM or frontend.keycloak.realm must be defined');
        }
        else if (!config.has('frontend.keycloak.clientId')) {
          throw new Error('OIDC environment variable FRONTEND_KC_CLIENTID or frontend.keycloak.clientId must be defined');
        }
        else {
          throw(err);
        }
      }
    }
  }
};
