import { encoded, translations } from './data.js';

const decoded = (encoded, translations) => {
  const missingIds = new Set();
  const exclude = new Set(['groupId', 'service', 'formatSize', 'ca']);

  const decodeList = encoded.map((element) => {
    const decodedObj = {};

    for (const key in element) {
      if (!exclude.has(key)) {
        const translatedValue = translations[element[key]];
        decodedObj[key] =
          translatedValue !== undefined ? translatedValue : element[key];

        if (key.endsWith('Id') && translatedValue === undefined) {
          missingIds.add(element[key]);
        }
      } else {
        decodedObj[key] = element[key];
      }
    }

    return decodedObj;
  });

  return { decodeList, missingIds: Array.from(missingIds) };
};

console.log(decoded(encoded, translations));
