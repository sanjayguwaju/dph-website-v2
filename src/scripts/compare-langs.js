
const en = require('./src/i18n/messages/en.ts').default;
const ne = require('./src/i18n/messages/ne.ts').default;

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

// Since these are .ts files and use ESM, requiring them might fail in a pure node environment without transpilation.
// I will instead use grep or a different approach if this fails.
// But I can try to read them as strings and do a rough comparison if needed.
