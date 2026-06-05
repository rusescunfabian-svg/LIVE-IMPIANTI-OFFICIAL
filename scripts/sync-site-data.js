/**
 * Sincronizza progetti.json + content/*.json → progetti-data.js e sito-data.js
 * Eseguito da Netlify ad ogni deploy.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeList(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.voce || item.tag || item.item || item.feature || '';
      }
      return '';
    })
    .filter(Boolean);
}

function syncProgetti() {
  const jsonPath = path.join(root, 'progetti.json');
  const outPath = path.join(root, 'progetti-data.js');
  const data = readJson(jsonPath);

  if (data.progetti) {
    data.progetti.forEach((p) => {
      p.features = normalizeList(p.features);
      p.tags = normalizeList(p.tags);
    });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  fs.writeFileSync(outPath, `window.PROGETTI_DATA = ${JSON.stringify(data, null, 2)};\n`, 'utf8');
  return data;
}

function syncSitoContent() {
  const files = {
    home: 'home.json',
    azienda: 'azienda.json',
    servizi: 'servizi.json',
    chiSiamo: 'chi-siamo.json',
    legale: 'legale.json',
  };

  const sito = {};
  for (const [key, file] of Object.entries(files)) {
    const fp = path.join(contentDir, file);
    if (fs.existsSync(fp)) sito[key] = readJson(fp);
  }

  const outPath = path.join(root, 'sito-data.js');
  fs.writeFileSync(outPath, `window.SITO_DATA = ${JSON.stringify(sito, null, 2)};\n`, 'utf8');
  return sito;
}

syncProgetti();
syncSitoContent();
console.log('sync-site-data: OK');
