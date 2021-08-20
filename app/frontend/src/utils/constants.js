export const ApiRoutes = Object.freeze({
  CHES_CANCEL: '/ches/cancel',
  CHES_EMAIL: '/ches/email',
  CHES_HEALTH: '/ches/health',
  CHES_MERGE: '/ches/merge',
  CHES_MERGE_PREVIEW: '/ches/merge/preview',
  CHES_PROMOTE: '/ches/promote',
  CHES_STATUS: '/ches/status'
});

export const AppRoles = Object.freeze({
  TESTROLE: 'testrole'
});

// total attacment size limit (number of bytes (binary))
export const Attachments = Object.freeze({
  ATTACHMENT_SIZE_LIMIT: 20971520
});

// Excel contexts file size limit (number of bytes (binary))
export const Contexts = Object.freeze({
  FILE_SIZE_LIMIT: 20971520
});

export const Regex = Object.freeze({
  EMAIL: '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
});

// export const Roles = Object.freeze({
//   SENDER_EDITOR_ROLE: '',
//   DEFAULT_SENDER: ''
// });

export const Formats = Object.freeze({
  CONTEXTS_DT_FORMAT: 'yyyy-MM-dd',
  CONTEXTS_TS_FORMAT: 'yyyy-MM-dd HH:mm',
  EXCEL_PARSE_FORMAT: 'm/d/yy h:mm',
  TEST_DT_FORMAT: 'M/d/yy HH:mm',
});
