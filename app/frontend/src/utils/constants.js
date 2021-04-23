export const ApiRoutes = Object.freeze({
  CHES_HEALTH: '/ches/health',
  CHES_EMAIL: '/ches/email',
  CHES_STATUS_TX: '/ches/status'
});

export const AppRoles = Object.freeze({
  TESTROLE: 'testrole'
});

// total attacment size limit (number of bytes (binary))
export const ATTACHMENT_SIZE_LIMIT = 20971520;

export const Regex = Object.freeze({
  EMAIL: '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
});
