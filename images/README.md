# Immagini sito Live Impianti

Questa cartella **deve essere inclusa nel repository Git** e caricata su GitHub.

Senza questi file, dopo il push le foto non compaiono sul sito online.

```bash
git add images/
git commit -m "Aggiungi immagini sito"
git push
```

Il deploy Netlify esegue `scripts/verify-deploy-assets.js` e blocca il build se mancano file essenziali.
