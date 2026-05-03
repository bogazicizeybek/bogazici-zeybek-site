#!/usr/bin/env node
// Bu script Netlify build sırasında çalışır.
// CMS'in oluşturduğu bireysel JSON dosyalarını tek bir liste JSON'una derler.

const fs = require('fs');
const path = require('path');

function derleListe(klasor) {
  const tamYol = path.join(__dirname, 'content', klasor);
  if (!fs.existsSync(tamYol)) {
    console.log(`[build] ${klasor} klasörü yok, atlanıyor`);
    return;
  }
  const dosyalar = fs.readdirSync(tamYol)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));
  const liste = [];
  for (const dosya of dosyalar) {
    try {
      const icerik = JSON.parse(fs.readFileSync(path.join(tamYol, dosya), 'utf8'));
      liste.push(icerik);
    } catch (e) {
      console.warn(`[build] ${dosya} okunamadı:`, e.message);
    }
  }
  fs.writeFileSync(
    path.join(tamYol, '_list.json'),
    JSON.stringify(liste, null, 2)
  );
  console.log(`[build] ${klasor}/_list.json oluşturuldu (${liste.length} kayıt)`);
}

derleListe('etkinlikler');
derleListe('calismalar');

console.log('[build] Tamamlandı ✓');
