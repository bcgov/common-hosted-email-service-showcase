import XLSX from 'xlsx';
// import moment from 'moment';
// import { format, parse } from 'date-fns';


// populate context/table formats
// const CONTEXTS_DT_FORMAT = 'YYYY-MM-DD';
// const CONTEXTS_TS_FORMAT = 'YYYY-MM-DD HH:mm';
// parsing and comparison formats
const EXCEL_PARSE_FORMAT = 'm/d/yy h:mm'; //ECMA-376 18.8.30 ID=22
// const MOMENT_PARSE_FORMAT = 'M/D/YY HH:mm'; //matches excel format, but works for moment.js

const makeHeaderUnique = (existing, original, val = original, count = 0) => {
  if ('' === original) {
    original = val = 'var';
  }
  if (existing.includes(val)) {
    count++;
    return makeHeaderUnique(existing, original, `${original}${count}`, count);
  } else {
    return val;
  }
};

const sanitizeHeaders = (headers) => {
  let result = [];
  headers.forEach(c => {
    let h = makeHeaderUnique(result, toCamelCase(c));
    result.push(h);
  });
  return result;
};

const toCamelCase = (str) => {
  // lowercase the str
  // replace whitespace with _
  // remove all non-alphanumeric (except _)
  // remove all repeated _ with single _
  // remove all _ and change next character to Uppercase
  const result = str.toLowerCase().replace(/ /g, '_').replace(/\W/g, '').replace(/_+/g, '_').replace(/_([a-z])/g, function (m) {
    return m.toUpperCase();
  }).replace(/_/g, '');
  return result;
};

const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

const parseDelayTs = (value) => {
  // eslint-disable-next-line no-console
  console.log(`parseDelayTs value=${value}, isTimestamp? ${moment(value, MOMENT_PARSE_FORMAT, true).format()}`);
  if (moment(value, MOMENT_PARSE_FORMAT, true).format() !== 'Invalid date') {
    //return the utc integer value of the timestamp
    return moment(value).utc().valueOf();
  }
  // no good, return undefined so API doesn't process it.
  return undefined;
};

const getAddresses = (csv) => {
  if (csv && csv.trim().length > 0) {
    return csv.split(',').map(item => item.trim());
  } else {
    return [];
  }
};

// const handleDefault = (context, data, fieldName, key) => {
//   const value = data[key];
//   // use relaxed mode to determine if date (would fail with 0:00 on strict)
//   const isDate = (moment(value, MOMENT_PARSE_FORMAT).format() !== 'Invalid date');
//   // be strict when determining if timestamp - we want valid h:mm
//   const isTimestamp = (moment(value, MOMENT_PARSE_FORMAT, true).format() !== 'Invalid date');
//   const isTimestampField = isTimestamp && fieldName.toLowerCase().endsWith('ts');
//   if (isTimestampField) {
//     const ts = moment(value);
//     context[fieldName] = (ts.format(CONTEXTS_TS_FORMAT) !== 'Invalid date' ? ts.format(CONTEXTS_TS_FORMAT) : value);
//   } else if (isDate) {
//     const dt = moment(value);
//     context[fieldName] = (dt.format(CONTEXTS_DT_FORMAT) !== 'Invalid date' ? dt.format(CONTEXTS_DT_FORMAT) : value);
//   } else {
//     context[fieldName] = value;
//   }
// };

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
      result = Object.keys(objs[0].context).map(k => `{{${k}}}`); //nunjucks syntax
    } catch (e) {
      result = [];
    }
  }
  return result;
}

export function validateContext(obj) {
  try {
    return obj && obj.to && Array.isArray(obj.to) && obj.to.length > 0;
  } catch (e) {
    return false;
  }
}

export function validateContexts(contexts) {
  let result = Array.isArray(contexts) && contexts.length > 0;
  if (result) {
    contexts.forEach(c => {
      if (!validateContext(c)) {
        result = false;
      }
    });
  }
  return result;
}

export function parseFile(file, cb) {

  // this will suppress a console warning about moment deprecating a default fallback on non ISO/RFC2822 date formats
  // we will just force it to use the new Date constructor.
  // moment.createFromInputFallback = function (config) {
  //   config._d = new Date(config._i);
  // };

  const reader = new FileReader();
  const rABS = !!reader.readAsBinaryString;

  reader.onload = (e) => {
    /* Parse data */
    const bstr = e.target.result;

    const wb = XLSX.read(bstr, {
      type: rABS ? 'binary' : 'array',
      cellDates: true,
      dateNF: EXCEL_PARSE_FORMAT
    });
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

    let excel = { cols: [], headers: [], data: [] };
    excel.cols = make_cols(ws['!ref']);

    const headers = sanitizeHeaders(data[0]);
    excel.headers = [headers];
    // actual data is rows 2 onward
    excel.data = data.slice(1);

    let contexts = [];

    excel.data.forEach(d => {
      let r = {
        to: [],
        cc: [],
        bcc: [],
        tag: undefined,
        delayTS: undefined,
        delayTSDisplay: undefined,
        context: {}
      };
      let fields = excel.cols;
      fields.forEach(f => {
        let fieldName = excel.headers[0][f.key];
        switch (fieldName.toLowerCase()) {
          case 'to':
            r.to = getAddresses(d[f.key]);
            //r.context.to = r.to;
            break;
          case 'cc':
            r.cc = getAddresses(d[f.key]);
            //r.context.cc = r.cc;
            break;
          case 'bcc':
            r.bcc = getAddresses(d[f.key]);
            //r.context.bcc = r.bcc;
            break;
          case 'tag':
            r.tag = d[f.key];
            break;
          // case 'delayts':
          //   r.delayTS = parseDelayTs(d[f.key]);
          //   // for display in the table, format it nicely (not unix milliseconds...)
          //   d[f.key] = r.delayTS ? moment(d[f.key]).format(CONTEXTS_TS_FORMAT) : undefined;
          //   break;
          default:
            // handleDefault(r.context, d, fieldName, f.key);
            // for display in the table, return the value from the context (altered for date or timestamp)
            d[f.key] = r.context[fieldName];
        }
      });
      if (validateContext(r)) contexts.push(r);
    });
    let formContexts = JSON.stringify(contexts, null, 2);
    const contextVariables = contextsToVariables(formContexts);

    cb({ excel: excel, contexts: formContexts, contextVariables: contextVariables });
  };

  console.log('file', file);

  if (rABS) reader.readAsBinaryString(file);
  else reader.readAsArrayBuffer(file);
}

export function transactionToCsv(obj) {
  let wb = XLSX.utils.book_new();

  let data = [];
  obj.messages.forEach(m => {
    const row = { txId: obj.txId, msgId: m.msgId, to: m.to.join(',') };
    data.push(row);
  });

  const ws = XLSX.utils.json_to_sheet(data, { header: ['txId', 'msgId', 'to'] });
  XLSX.utils.book_append_sheet(wb, ws, 'Messages');
  XLSX.write(wb, { bookType: 'csv', bookSST: true, type: 'base64' });
  return wb;
}

export function writeCsv(csv) {
  // write this out, it will download in a browser environment
  XLSX.writeFile(csv, `mssc-transactions-${new Date().toISOString()}.csv`);
}
