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
  * @function cancel
  * Attempt to cancel an email message
  * @param {string} msgId The messageId
  * @returns {Promise} An axios response
  */
  cancel(msgId) {
    return appAxios().get(`${ApiRoutes.CHES_CANCEL}/${msgId}`);
  },

  /**
  * @function email
  * Dispatches an email
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
  },

  /**
  * @function getStatusByMessageId
  * Find email status(es) via transactionId
  * @param {string} msgId The transactionId
  * @returns {Promise} An axios response
  */
  getStatusByMessageId(msgId) {
    return appAxios().get(ApiRoutes.CHES_STATUS, {
      params: {
        msgId: msgId
      }
    });
  },

  merge(mergeData){
    return appAxios().post(ApiRoutes.CHES_MERGE, mergeData);
  },

  mergePreview(mergeData){
    return appAxios().post(ApiRoutes.CHES_MERGE_PREVIEW, mergeData);
  },

  /**
  * @function promote
  * Attempt to promote an email message
  * @param {string} msgId The messageId
  * @returns {Promise} An axios response
  */
  promote(msgId) {
    return appAxios().get(`${ApiRoutes.CHES_PROMOTE}/${msgId}`);
  },
};

