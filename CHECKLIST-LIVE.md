# Checklist go-live – Live Impianti

## Stato tecnico (verificato)

| Area | Stato | Note |
|------|--------|------|
| Build Netlify | OK | `verify-deploy-assets` + `sync-site-data` |
| Immagini locali | OK | 35+ file in `images/` |
| CMS → sito | OK | `progetti.json` + `content/*.json` → JS al deploy |
| Admin Decap | OK | `admin/config.yml` allineato ai file |
| Responsive | OK | Breakpoint mobile / tablet / desktop |
| SEO base | OK | meta, canonical, sitemap, robots |
| Form contatti | OK | Netlify Forms (`name="contatti"`) |

## Prima del go-live (obbligatorio)

1. **GitHub** – repo con tutto il progetto, incluso `images/`:
   ```bash
   git add .
   git commit -m "Sito Live Impianti pronto per produzione"
   git push
   ```

2. **Netlify** – Site settings:
   - Build: `node scripts/verify-deploy-assets.js && node scripts/sync-site-data.js`
   - Publish: `.`
   - Branch: `main`

3. **Netlify Identity** – Enable, Invite only, invita il cliente

4. **Git Gateway** – Enable in Identity → Services

5. **Form contatti** – Netlify → Forms: dopo il primo deploy verifica che compaia il form `contatti`

6. **Dominio** – Collega `liveimpianti.it` e HTTPS

7. **Identity URL** – Redirect URLs con dominio finale + `/admin/`

## Admin panel (`/admin/`)

- Login: Netlify Identity (email invito)
- Modifiche salvate → commit Git → deploy automatico (1–2 min)
- Collezioni CMS:
  - **Catalogo progetti** → `progetti.json` + foto in `images/`
  - **Impostazioni Home** → `content/home.json`
  - **Dati azienda** → `content/azienda.json`
  - **Servizi** → `content/servizi.json`
  - **Chi siamo** → `content/chi-siamo.json`
  - **Privacy/Cookie** → `content/legale.json`

Sviluppo locale CMS: decommentare `local_backend: true` in `admin/config.yml` e `npx decap-server`.

## Test manuali consigliati

- [ ] Home: hero, 4 categorie, lightbox progetto
- [ ] `progetti.html`: filtri e dettaglio
- [ ] Menu mobile + Contatti giallo
- [ ] Privacy / Cookie
- [ ] Invio form contatti (email in Netlify Forms)
- [ ] Login `/admin/` e salvataggio progetto di prova

## Note performance

- `progetti.html` usa Tailwind da CDN (funziona; per ottimizzazione futura si può compilare CSS statico).
