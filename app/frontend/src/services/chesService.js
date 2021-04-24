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


  /**
  * @function email
  * Dispatches an email to CHES
  * @param {string} email The email message
  * @returns {Promise} An axios response
  */
  email(email) {
    return appAxios().post(ApiRoutes.CHES_EMAIL, email);
  },

  /**
  * @function getStatusByTransactionId
  * Find email status(es) via transactionId
  * @param {string} txId The transactionId
  * @returns {Promise} An axios response
  */
  getStatusByTransactionId(txId) {
    return appAxios().get(ApiRoutes.CHES_STATUS, {
      params: {
        txId: txId
      }
    });
  }
};

