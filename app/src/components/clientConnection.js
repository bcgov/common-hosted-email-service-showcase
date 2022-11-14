const axios = require('axios');
const log = require('../../src/components/log')(module.filename);
const tokenProvider = require('axios-token-interceptor');

class ClientConnection {
  constructor({ tokenUrl, clientId, clientSecret }) {
    log.verbose('ClientConnection', `Constructed with ${tokenUrl}, ${clientId}, clientSecret`);
    if (!tokenUrl || !clientId || !clientSecret) {
      log.error('Invalid configuration.', { function: 'constructor' });
      throw new Error('ClientConnection is not configured. Check configuration.');
    }

    // intercept axios calls with access token
    this.axios = axios.create();
    this.axios.interceptors.request.use(
      tokenProvider({
        getToken: () =>
          axios({
            method: 'POST',
            url: tokenUrl,
            data: {
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: 'client_credentials',
            },
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true,
          }).then((response) => {
            // Return token here
            return response.data.access_token;
          }),
      })
    );
  }
}

module.exports = ClientConnection;
