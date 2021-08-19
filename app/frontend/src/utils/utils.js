// turn contexts into nunjucks variables
export function contextsToVariables(contexts) {
  let result = [];
  if (contexts) {
    try {
      let objs = [];
      if (typeof contexts === 'string' || contexts instanceof String) {
        objs = JSON.parse(contexts.trim());
      } else {
        objs = contexts;
      }
      result = Object.keys(objs[0].context).map((k) => `{{${k}}}`);
    } catch (e) {
      result = [];
    }
  }
  return result;
}

export async function convertFileToAttachment(file) {
  const content = await this.fileToBase64(file);
  return {
    content: content,
    contentType: file.type,
    filename: file.name,
    encoding: 'base64',
  };
}

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.replace(/^.*,/, ''));
    reader.onerror = (error) => reject(error);
  });
}

export function getAddresses(csv) {
  if (csv && csv.trim().length > 0) {
    return csv.split(',').map(item => item.trim());
  } else {
    return [];
  }
}

export function getContextsObject(contexts) {
  try {
    if (contexts && contexts.trim().length > 0) {
      return JSON.parse(contexts.trim());
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}

export function toCamelCase(str) {
  // lowercase the str
  // replace whitespace with _
  // remove all non-alphanumeric (except _)
  // remove all repeated _ with single _
  // remove all _ and change next character to Uppercase
  const result = str
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/\W/g, '')
    .replace(/_+/g, '_')
    .replace(/_([a-z])/g, (m) => m.toUpperCase())
    .replace(/_/g, '');
  return result;
}

export function validateContext(obj) {
  try {
    return obj && obj.to && Array.isArray(obj.to) && obj.to.length;
  } catch (e) {
    return false;
  }
}

// check contexts JSON string contains required properties
export function validateContexts(contexts) {
  // convert to array
  let contextsArr = getContextsObject(contexts);
  let result = Array.isArray(contextsArr) && contextsArr.length;
  if (result) {
    contextsArr.forEach((obj) => {
      if (!validateContext(obj)) {
        result = false;
      }
    });
  }
  return result;
}

export function validJson(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}
