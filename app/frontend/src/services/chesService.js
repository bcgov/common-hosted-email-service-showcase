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


  async email(email) {
    const response = await appAxios().post(ApiRoutes.CHES_EMAIL, email)
      .catch(e => {
        if (e && e.response && e.response.status === 422) {
          console.log('error sending Email');
        } else {
          throw Error('Could not send email using CHES API: ' + e.message);
        }
      });

    return response.data;
  },

  async getStatusByTransactionId(txId) {
    const response = await appAxios().get(`${ApiRoutes.CHES_STATUS_TX}?txId=${txId}`)
      .catch(e => {
        if (e && e.response && e.response.status === 422) {
          console.log('error getting status by transaction ID');
        } else {
          throw Error('Could get message status by transaction ID using CHES API: ' + e.message);
        }
      });

    return response.data;
  }
};

