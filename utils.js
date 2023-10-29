import os from 'os';
import path from 'path';
import fs from 'fs';
import { STOP_WORDS } from './constants.js';

function extractKeyWords(text) {
  const words = text.split(' ');

  const keywords = words.filter(word => !STOP_WORDS.includes(word.toLowerCase())).join('_');
  return keywords;
}

export function generateFilename(prompt, extension, maxLength) {
  let keywords = extractKeyWords(prompt);
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

  const maxKeywordsLength = maxLength - (timestamp.length + 1); // 1 for the underscore

  if (keywords.length > maxKeywordsLength) {
    keywords = keywords.slice(0, maxKeywordsLength);
  }

  return `${keywords}_${timestamp}.${extension}`;
}

export function saveFile(fileName, fileData) {
  const homeDirectory = os.homedir();
  const leoFolder = path.join(homeDirectory, 'leo-gi');

  if (!fs.existsSync(leoFolder)) {
    fs.mkdirSync(leoFolder);
  }
  const filePath = path.join(leoFolder, fileName);

  fs.writeFileSync(filePath, fileData);
}
