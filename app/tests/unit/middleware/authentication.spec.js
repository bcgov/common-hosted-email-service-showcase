const jwt = require('jsonwebtoken');
const config = require('config');
const Problem = require('api-problem');
const { authenticate } = require('../../../src/middleware/authentication');

jest.mock('config');
// jest.mock('jsonwebtoken');
jest.mock('api-problem');

const jwtVerifySpy = jest.spyOn(jwt, 'verify');

const mockKeycloakConfig = {
  publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuy7zfh2ZgpDV5mH/aXyLDTddZK81rGakJcTy4KvCNOkDDxt1KAhW02lmbCo8YhHCOzjNZBp1+Vi6QiMRgBqAe2GTPZYEiV70aXfROGZe3Nvwcjbtki6HoyRte3SpqLJEIPL2F+hjJkw1UPGnjPTWZkEx9p74b9i3BjuE8RnjJ0Sza2MWw83zoQUZEJRGiopSL0yuVej6t2LO2btVdVf7QuZfPt9ehkcQYlPKpVvJA+pfeqPAdnNt7OjEIeYxinjurZr8Z04hz8UhkRefcWlSbFzFQYmL7O7iArjW0bsSvq8yNUd5r0KCOQkFduwZy26yTzTxj8OLFT91fEmbBBl4rQIDAQAB',
  serverUrl: 'https://dev.loginproxy.gov.bc.ca/auth/',
  realm: 'standard',
  clientId: 'ches-showcase-0000'
};

/**
 * Helper function for formatting error string for missing environment variables
 */
const missingEnvarString = (envar, key) => {
  return `OIDC environment variable ${envar} or frontend.keycloak.${key} must be defined`;
};

describe('authentication middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      get: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    Problem.send = jest.fn();
    jest.spyOn(Problem, 'send');

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if JWT token is valid', () => {

    req.get.mockReturnValueOnce('Bearer xxxxx');

    config.get
      .mockReturnValueOnce(mockKeycloakConfig.publicKey)
      .mockReturnValueOnce(mockKeycloakConfig.serverUrl)
      .mockReturnValueOnce(mockKeycloakConfig.realm)
      .mockReturnValueOnce(mockKeycloakConfig.clientId);

    jwtVerifySpy.mockReturnValueOnce({});

    authenticate(req, res, next);

    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(4);
    expect(jwtVerifySpy).toHaveBeenCalledWith(
      'xxxxx',
      `-----BEGIN PUBLIC KEY-----\n${mockKeycloakConfig.publicKey}\n-----END PUBLIC KEY-----`,
      {
        issuer: `${mockKeycloakConfig.serverUrl}/realms/${mockKeycloakConfig.realm}`,
        audience: mockKeycloakConfig.clientId
      }
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if Authorization header is missing', () => {
    req.get.mockReturnValueOnce(undefined);

    authenticate(req, res, next);

    expect(Problem).toHaveBeenCalledWith(401, {
      detail: 'An authorization header of the format "Bearer {token}" is required'
    });
    expect(Problem.mock.instances[0].send).toHaveBeenCalled();
  });

  it('should return 401 if Authorization header is in invalid format', () => {
    req.get.mockReturnValueOnce('Not Bearer xxxxx');

    authenticate(req, res, next);

    expect(Problem).toHaveBeenCalledWith(401, {
      detail: 'An authorization header of the format "Bearer {token}" is required'
    });
    expect(Problem.mock.instances[0].send).toHaveBeenCalled();
  });

  it('should return 401 if JWT is invalid', () => {
    req.get.mockReturnValueOnce('Bearer xxxxx');
    config.get.mockReturnValueOnce(mockKeycloakConfig.publicKey);
    jwtVerifySpy.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });

    authenticate(req, res, next);

    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(4);
    expect(Problem).toHaveBeenCalledWith(401, {
      detail: 'invalid token'
    });
    expect(Problem.mock.instances[0].send).toHaveBeenCalled();
  });

  it('should throw 500 if public key is missing', () => {
    req.get.mockReturnValueOnce('Bearer xxxxx');
    config.get.mockImplementation(() => {
      throw new Error();
    });
    config.has.mockReturnValueOnce(false);

    expect(() => {
      authenticate(req, res, next);
    }).toThrow(
      missingEnvarString('FRONTEND_KC_PUBLICKEY','publicKey')
    );
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(1);
    expect(config.has).toHaveBeenCalledTimes(1);
  });

  it('should throw 500 if serverUrl is missing', () => {
    req.get.mockReturnValueOnce('Bearer xxxxx');
    config.get.mockReturnValueOnce(mockKeycloakConfig.publicKey);
    config.get.mockImplementation(() => {
      throw new Error();
    });
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(false);

    expect(() => {
      authenticate(req, res, next);
    }).toThrow(
      missingEnvarString('FRONTEND_KC_SERVERURL','serverUrl')
    );
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(2);
    expect(config.has).toHaveBeenCalledTimes(2);
  });

  it('should throw 500 if realm is missing', () => {
    req.get.mockReturnValueOnce('Bearer xxxxx');
    config.get.mockReturnValueOnce(mockKeycloakConfig.publicKey);
    config.get.mockReturnValueOnce(mockKeycloakConfig.serverUrl);
    config.get.mockImplementation(() => {
      throw new Error();
    });
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(false);

    expect(() => {
      authenticate(req, res, next);
    }).toThrow(
      missingEnvarString('FRONTEND_KC_REALM','realm')
    );
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(3);
    expect(config.has).toHaveBeenCalledTimes(3);
  });

  it('should throw 500 if clientId is missing', () => {
    req.get.mockReturnValueOnce('Bearer xxxxx');
    config.get.mockReturnValueOnce(mockKeycloakConfig.publicKey);
    config.get.mockReturnValueOnce(mockKeycloakConfig.serverUrl);
    config.get.mockReturnValueOnce(mockKeycloakConfig.realm);
    config.get.mockImplementation(() => {
      throw new Error();
    });
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(true);
    config.has.mockReturnValueOnce(false);

    expect(() => {
      authenticate(req, res, next);
    }).toThrow(
      missingEnvarString('FRONTEND_KC_CLIENTID','clientId')
    );
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(config.get).toHaveBeenCalledTimes(4);
    expect(config.has).toHaveBeenCalledTimes(4);
  });
});
