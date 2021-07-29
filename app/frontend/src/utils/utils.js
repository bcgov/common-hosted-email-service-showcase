// import GetUserError from '../auth/GetUserError';
// import ChesValidationError from '../ches/ChesValidationError';
// import bytes from 'bytes';

export function getAddresses(csv) {
  if (csv && csv.trim().length > 0) {
    return csv.split(',').map(item => item.trim());
  } else {
    return [];
  }
}

// export function  errorHandler(e) {
//   let error = '';
//   let userError = '';
//   let apiValidationErrors = [];
//   if (e && e instanceof GetUserError) {
//     userError = 'There appears to be an issue with login credentials.  Please logout and back in to renew your session.';
//   } else if (e && e instanceof ChesValidationError) {
//     apiValidationErrors = e.errors;
//   } else if (e) {
//     error = e.message;
//   }
//   return {error, userError, apiValidationErrors};
// }

// export async function toBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsBinaryString(file);
//     reader.onload = () => resolve(btoa(reader.result));
//     reader.onerror = error => reject(error);
//   });
// }

// export async function convertFileToAttachment(file, encoding) {
//   const content = await toBase64(file);
//   return {
//     content: content,
//     contentType: file.type,
//     filename: file.name,
//     encoding: encoding
//   };
// }

// export function isEmpty(str) {
//   return (!str || /^\s*$/.test(str));
// }

// export function notEmpty(str) {
//   return !isEmpty(str);
// }

// export function handleChesAttachments(files, attachmentsMaxSize, acceptedFiles) {
//   let dropWarning = '';

//   const attachmentsSize = files.length === 0 ? 0 : files.map(f => f.size).reduce((a, b) => a + b);
//   let attachmentsSizeAvailable = attachmentsMaxSize - attachmentsSize;

//   // accept smaller files first...
//   const acceptedFilesSortedBySize = acceptedFiles.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
//   acceptedFilesSortedBySize.forEach((value) => {
//     if (-1 === files.findIndex((f) => {
//       return f.name === value.name && f.lastModified === value.lastModified && f.size === value.size;
//     })) {
//       if (attachmentsSizeAvailable - value.size > 0) {
//         attachmentsSizeAvailable = attachmentsSizeAvailable - value.size;
//         files.push(value);
//       } else {
//         dropWarning = `Attachments are limited to ${bytes.format(attachmentsMaxSize)} bytes in total size.`;
//       }
//     }
//   });
//   return dropWarning;
// }

export function toCamelCase(str) {
  // lowercase the str
  // replace whitespace with _
  // remove all non-alphanumeric (except _)
  // remove all repeated _ with single _
  // remove all _ and change next character to Uppercase
  const result = str.toLowerCase().replace(/ /g, '_').replace(/\W/g, '').replace(/_+/g, '_').replace(/_([a-z])/g, function (m) {
    return m.toUpperCase();
  }).replace(/_/g, '');
  return result;
}



