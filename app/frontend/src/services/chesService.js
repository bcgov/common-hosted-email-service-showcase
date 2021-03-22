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


  email() {

    const email = {
      bcc: [],
      bodyType: 'html',
      body: '<h1>Welcome to Common Services</h1><p>Sent by <a href="https://bcgov.github.io/common-hosted-email-service/">CHES</a></p>',
      cc: [],
      delayTS: 0,
      encoding: 'utf-8',
      from: 'NR.CommonServiceShowcase@gov.bc.ca',
      priority: 'normal',
      subject: 'CHES Email Message',
      to: ['NR.CommonServiceShowcase@gov.bc.ca'],
      tag: 'email_123',
      attachments: [
        {
          content: 'IyBDb21tb24gSG9zdGVkIEVtYWlsIFNlcnZpY2UKTmVlZCB0byBzZW5kIGVtYWlscz8gTmVlZCB0byBzZW5kIGJ1bGsgZW1haWxzPyBOZWVkIHRvIHNlbmQgdGVtcGxhdGVkIG1lc3NhZ2VzIHBvcHVsYXRlZCBmcm9tIGEgZGF0YXNldD8gTmVlZCB0byBzY2hlZHVsZSBkZWxpdmVyeSBvZiBlbWFpbHM/ICAKClRoZSBDSEVTIEFQSSBpcyBjYXBhYmxlIG9mIGRvaW5nIHRoZSBmb2xsb3dpbmc6CgoqIFNlbmQgZW1haWxzIHdpdGggYXR0YWNobWVudHMgYW5kIHNwZWNpYWwgYnVzaW5lc3MgdGFnZ2luZy4gCiogU2NoZWR1bGUgZm9yIGRlbGF5ZWQgZGVsaXZlcnksIHdpdGggYWJpbGl0eSB0byBjYW5jZWwuIAoqIENyZWF0ZSBidWxrIGVtYWlsIG1lcmdlIHdpdGggeW91ciBvd24gdGVtcGxhdGVzLiAgCiogU2VuZCBwbGFpbiB0ZXh0IG9yIEhUTUwgZW1haWxzLiAKKiBUcmFjayB0aGUgc3RhdHVzIG9mIHlvdXIgcmVxdWVzdC4gCgpSZXZpZXcgdGhlIHYxIEFQSSBzcGVjaWZpY2F0aW9uIFtoZXJlXShodHRwczovL2NoZXMtbWFzdGVyLTlmMGZiZS1wcm9kLnBhdGhmaW5kZXIuZ292LmJjLmNhL2FwaS92MS9kb2NzKS4gIAoKU2VlIFNob3djYXNlIGFwcGxpY2F0aW9uIFtoZXJlXShodHRwczovL21zc2MucGF0aGZpbmRlci5nb3YuYmMuY2EvbXNzYy8pLiAgCgpTZWUgc291cmNlIGNvZGUgW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9iY2dvdi9jb21tb24taG9zdGVkLWVtYWlsLXNlcnZpY2UpLiAgCgpNb3JlIGluZm9ybWF0aW9uIFtoZXJlXShodHRwczovL2JjZ292LmdpdGh1Yi5pby9jb21tb24taG9zdGVkLWVtYWlsLXNlcnZpY2UvKS4gIAoKIyBDb21tb24gRG9jdW1lbnQgR2VuZXJhdGlvbiBTZXJ2aWNlCkxldmVyYWdlIHlvdXIgc3RydWN0dXJlZCBkYXRhc2V0cyBhbmQgeW91ciBidXNpbmVzcyB0ZW1wbGF0ZXMgdG8gYXV0b21hdGljYWxseSBwb3B1bGF0ZSBwcmludGFibGUgZG9jdW1lbnRzLCBzcHJlYWRzaGVldHMsIHByZXNlbnRhdGlvbnMsIG9yIFBERnMgdXNpbmcgdGhlIENvbW1vbiBEb2N1bWVudCBHZW5lcmF0aW9uIFNlcnZpY2UuICAKClRoZSBBUEkgY2FuIGdlbmVyYXRlIGFueSBQREYgb3IgWE1MLWJhc2VkIGRvY3VtZW50cyBzdWNoIGFzIGRvY3gsIHhsc3gsIHBwdHgsIG9kdCwgb2RzLCBvZHAsIGFuZCBodG1sLiBFeGFtcGxlcyBvZiBYTUwtYmFzZWQgZWRpdG9ycyBpbmNsdWRlIE1pY3Jvc29mdCBPZmZpY2XihKIsIExpYnJlT2ZmaWNl4oSiIG9yIE9wZW5PZmZpY2XihKIuCgpUaGUgQ0RPR1MgQVBJIGlzIGNhcGFibGUgb2YgZG9pbmcgdGhlIGZvbGxvd2luZzoKCiogTWVyZ2UgY29tcGxleCBkYXRhc2V0cyBpbnRvIGRvY3VtZW50IHRlbXBsYXRlcy4gCiogU3VwcG9ydHMgYW55IFhNTC1iYXNlZCBkb2N1bWVudCB0ZW1wbGF0ZXMgaW5jbHVkaW5nIGJ1dCBub3QgbGltaXRlZCB0byBNaWNyb3NvZnQgT2ZmaWNl4oSiLCBMaWJyZU9mZmljZeKEoiBvciBPcGVuT2ZmaWNl4oSiLiAKKiBSaWNoIHRlbXBsYXRpbmcgbGlicmFyeSBzdXBwb3J0IGxldmVyYWdpbmcgdGhlIENhcmJvbmUgSlMgbGlicmFyeS4gCgpSZXZpZXcgdGhlIHYxIEFQSSBzcGVjaWZpY2F0aW9uIFtoZXJlXShodHRwczovL2Nkb2dzLW1hc3Rlci1pZGNxdmwtcHJvZC5wYXRoZmluZGVyLmdvdi5iYy5jYS9hcGkvdjEvZG9jcyN0YWcvRG9jR2VuKS4gIAoKUmV2aWV3IHRoZSB2MiBBUEkgc3BlY2lmaWNhdGlvbiBbaGVyZV0oaHR0cHM6Ly9jZG9ncy1tYXN0ZXItaWRjcXZsLXByb2QucGF0aGZpbmRlci5nb3YuYmMuY2EvYXBpL3YyL2RvY3MjdGFnL0RvY0dlbikuICAKClNlZSBTaG93Y2FzZSBhcHBsaWNhdGlvbiBbaGVyZV0oaHR0cHM6Ly9kZ3JzYy5wYXRoZmluZGVyLmdvdi5iYy5jYS9kZ3JzYy8pLiAgCgpTZWUgc291cmNlIGNvZGUgW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9iY2dvdi9jb21tb24tZG9jdW1lbnQtZ2VuZXJhdGlvbi1zZXJ2aWNlKS4gIAoKTW9yZSBpbmZvcm1hdGlvbiBbaGVyZV0oaHR0cHM6Ly9iY2dvdi5naXRodWIuaW8vY29tbW9uLWRvY3VtZW50LWdlbmVyYXRpb24tc2VydmljZS8pLiAgCgoKIyMjIyBDb21tb24gU2VydmljZXMgU2hvd2Nhc2UKVmlzaXQgW0NvbW1vbiBTZXJ2aWNlcyBTaG93Y2FzZV0oaHR0cHM6Ly9iY2dvdi5naXRodWIuaW8vY29tbW9uLXNlcnZpY2Utc2hvd2Nhc2UvKSBmb3IgbW9yZSBpbmZvcm1hdGlvbjsgaW5jbHVkaW5nIGhvdyB0byBnZXQgYWNjZXNzIHRvIGNvbW1vbiBzZXJ2aWNlcy4gICA=',
          contentType: 'text/markdown',
          encoding: 'base64',
          filename: 'readme.md'
        }
      ]
    };

    const response = appAxios().post(ApiRoutes.CHES_HEALTH, JSON.stringify(email))
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

