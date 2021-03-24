import { appAxios } from '@/services/interceptors';
import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function healthCheck
   * Fetch the contents of the ches /health endpoint
   * @returns {Promise} An axios response
   */
  healthCheck() {
    return appAxios().get(ApiRoutes.CHES_HEALTH);
  },


  async email() {

    const email = {
      bodyType: 'html',
      body: '<h1>Welcome to Common Services</h1><p>Sent by <a href="https://bcgov.github.io/common-hosted-email-service/">CHES</a></p>',
      delayTS: 0,
      from: 'abc@gov.bc.ca',
      subject: 'CHES Email Message',
      to: ['xyz@gov.bc.ca'],
      tag: 'email_123'
    };

    const response = await appAxios().post(ApiRoutes.CHES_EMAIL, email)
      .catch(e => {
        if (e && e.response && e.response.status === 422) {
          console.log('error sending Email');
        } else {
          throw Error('Could not send email using CHES API: ' + e.message);
        }
      });

    return response.data;
  }
};

