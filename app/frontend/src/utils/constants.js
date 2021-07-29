export const ApiRoutes = Object.freeze({
  CHES_CANCEL: '/ches/cancel',
  CHES_EMAIL: '/ches/email',
  CHES_HEALTH: '/ches/health',
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


export const Formats = Object.freeze({
  CONTEXTS_DT_FORMAT: 'YYYY-MM-DD',
  CONTEXTS_TS_FORMAT: 'YYYY-MM-DD HH:mm',
  EXCEL_PARSE_FORMAT: 'm/d/yy h:mm',
  MOMENT_PARSE_FORMAT: 'M/D/YY HH:mm',
});
