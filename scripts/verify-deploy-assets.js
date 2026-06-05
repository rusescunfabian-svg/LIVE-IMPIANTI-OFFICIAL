/**
 * Verifica che le immagini essenziali esistano prima del deploy Netlify.
 * Se mancano, il build fallisce con messaggio chiaro (cartella images/ non su GitHub).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');

const REQUIRED = [
  'home-hero.jpg',
  'home-hero.webp',
  'liveimpianti_logo.png',
  'cat-ville.jpg',
  'cat-radianti-final.jpg',
  'cat-fotovoltaico.jpg',
  'cat-centrali-final.jpg',
];

function collectFromJson(filePath, keys, out) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const progetti = data.progetti || [];
  progetti.forEach((p) => {
    keys.forEach((k) => {
      if (p[k] && String(p[k]).startsWith('images/')) out.add(p[k].replace(/^images\//, ''));
    });
  });
  (data.categorie || []).forEach((c) => {
    if (c.banner && String(c.banner).startsWith('images/')) {
      out.add(c.banner.replace(/^images\//, ''));
    }
  });
}

const requiredSet = new Set(REQUIRED);
collectFromJson(path.join(root, 'progetti.json'), ['immagine', 'immagineHome'], requiredSet);

const missing = [];
if (!fs.existsSync(imagesDir)) {
  console.error('\n[verify-deploy-assets] ERRORE: cartella images/ assente nel repository.');
  console.error('Esegui: git add images/ && git commit -m "Aggiungi immagini sito" && git push\n');
  process.exit(1);
}

for (const file of requiredSet) {
  const fp = path.join(imagesDir, file);
  if (!fs.existsSync(fp)) missing.push(`images/${file}`);
}

if (missing.length) {
  console.error('\n[verify-deploy-assets] Immagini mancanti per il deploy:');
  missing.slice(0, 20).forEach((f) => console.error('  -', f));
  if (missing.length > 20) console.error(`  ... e altre ${missing.length - 20}`);
  console.error('\nLa cartella images/ deve essere committata su GitHub (non solo in locale).\n');
  process.exit(1);
}

const count = fs.readdirSync(imagesDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length;
console.log(`verify-deploy-assets: OK (${count} file immagine in images/)`);
