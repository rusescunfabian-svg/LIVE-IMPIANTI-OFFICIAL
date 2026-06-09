---
title: Guida operativa — pannello Live Impianti
---

# Benvenuto nel pannello di gestione

Questa guida è fatta per chi gestisce i contenuti del sito **senza dover capire codice o computer complicati**. Leggila con calma la prima volta: dopo due o tre modifiche andrai già a memoria.

Se qualcosa non torna, scrivi a **RF Digital** (chi ha messo su il sito) oppure a **info@liveimpianti.it** — meglio una domanda in più che un salvataggio fatto a metà.

---

## Prima di tutto: come funziona il pannello

Quando entri vedi il menu **a sinistra** e i campi da compilare **al centro**.

In alto ci sono due pulsanti importanti:

1. **Salva** — mette da parte le modifiche che hai fatto. Da solo **non** aggiorna il sito che vedono i clienti.
2. **Pubblica** — manda tutto online. Di solito, dopo il salvataggio, il sito si aggiorna da solo in **1–3 minuti** (Netlify fa il resto).

**Consiglio pratico:** finisci le modifiche di una sezione, clicca **Salva**, controlla che non ci siano errori rossi, poi **Pubblica**. Apri il sito in un’altra scheda (`Vedi sito live` in basso) e verifica.

---

## Cosa trovi nel menu (in ordine)

| Voce menu | A cosa serve |
|-----------|--------------|
| **00 · Guida** | Sei qui. Puoi rileggere quando vuoi. |
| **01 · Home** | Titolo grande in homepage, sottotitolo, numeri (1200+, 20+, 100%), pulsanti. |
| **02 · Servizi** | Le sei card con icone sotto l’hero. |
| **03 · Chi siamo** | Testi e punti di forza della sezione Chi siamo. |
| **04 · Catalogo progetti** | Il cuore del portfolio: categorie, foto, gallerie, testi progetto. |
| **05 · Azienda e contatti** | Telefono, email, indirizzo, mappa, footer. |
| **06 · Privacy e Cookie** | Testi legali. |

---

## 01 · Home — modifica la prima pagina

1. Clicca **01 · Pagina Home** nel menu.
2. Apri la sezione **Hero** (di solito è già espansa).
3. Cambia i testi che ti servono: badge, titolo, sottotitolo, testo dei pulsanti.
4. Per i **link** dei pulsanti lascia com’è se non sei sicuro (`progetti.html`, `#contatti`, ecc.).
5. Sotto trovi **Statistiche**: i numeri 1200, 20, 100 e le etichette sotto. Modifica solo se i dati sono aggiornati.
6. **Salva** → **Pubblica** → controlla la home sul telefono e sul PC.

L’**immagine di sfondo** dell’hero (la foto grande dietro al titolo) **non** si cambia da qui: è un file fisso sul server. Se serve cambiarla, chiedi a RF Digital.

---

## 04 · Catalogo progetti — la parte più usata

Qui gestisci tutto ciò che compare in **I nostri progetti** (home e pagina Progetti).

### Categorie (in alto nel file)

Sono le quattro voci dell’accordion: *Ville full electric*, *Radianti*, *Fotovoltaico*, *Centrali*.

- **Non cambiare l’ID** (ville, radianti, ecc.) — romperebbe i collegamenti.
- Puoi cambiare **nome**, **descrizione** e **foto banner** della categoria.
- **Posizione foto (CSS)**: lascia vuoto se va bene così. Se su mobile la foto è tagliata male, prova valori tipo `72% 38%` nel campo **Posizione foto mobile**.

### Aggiungere o modificare un progetto

1. Scorri fino a **Progetti** e clicca sul progetto che ti interessa (o **Aggiungi progetto** in basso).
2. Compila i campi principali:
   - **ID univoco** — solo minuscole e trattini, es. `villa-acilia`. Se crei un progetto nuovo, inventane uno che non esista già.
   - **Categoria** — scegli da menu a tendina.
   - **Ordine** — numero per l’ordine dentro la categoria (1 = primo).
   - **Etichetta** — la pillolina piccola (Villa, Hotel, 317 kW…).
   - **Foto principale** — quella che si vede sulla card e come **prima foto** nel dettaglio.
3. Titoli e descrizioni:
   - **Titolo breve** — in lista.
   - **Titolo completo** — nel popup quando clicchi il progetto.
   - **Descrizione breve** e **completa** — la lunga va nel dettaglio con l’elenco impianti.
4. **Impianti realizzati** — aggiungi una riga per ogni voce (pompa di calore, fotovoltaico…).
5. **Tag in evidenza** — le pillole grigie/verdi sotto la card (pagina Progetti).
6. **Progetto speciale** — spunta se vuoi il badge “Progetto speciale”.
7. **Mostra in Home** — i progetti compaiono nel carosello della categoria; questa spunta dà priorità in ordine.

### Galleria foto nel dettaglio (frecce sinistra/destra)

Quando un visitatore clicca un progetto, si apre il popup con le frecce. **Le frecce scorrono le foto dello stesso progetto**, non passano al progetto successivo.

Come impostarla:

| Foto extra che aggiungi | Totale foto nel popup | Frecce |
|-------------------------|----------------------|--------|
| Nessuna (solo principale) | 1 | No |
| 1 extra | 2 | Sì |
| 2 extra | 3 | Sì |
| 3 extra | 4 | Sì |
| 4 extra | 5 | Sì |

Ogni progetto ha **4 slot** pronti nel pannello: lasciali vuoti finché non hai le foto, oppure carica 1–4 immagini extra quando servono.

1. Carica la **Foto principale** (obbligatoria).
2. Sotto, apri **Galleria dettaglio (foto extra nel lightbox)**.
3. Clicca **Aggiungi** e carica la seconda foto, poi la terza, eventualmente la quarta.
4. Usa foto **orizzontali** e **leggere** (max circa 1–2 MB ciascuna): il sito va più veloce.
5. **Salva** e **Pubblica**. Apri un progetto sul sito e prova le frecce.

Se lasci la galleria vuota, il visitatore vede **solo** la foto principale — va benissimo per progetti con una sola immagine.

### Ritaglio foto su smartphone

Se su telefono la foto del progetto è tagliata male (si vede troppo cielo o troppo strada):

1. Apri il progetto nel pannello.
2. Campo **Posizione foto card (mobile)** — prova ad esempio `72% 38%` (sposta il focus a destra e un po’ in alto).
3. Salva, pubblica, controlla dal telefono. Si aggiusta a tentativi, non c’è una formula magica.

---

## 02 · Servizi e 03 · Chi siamo

Stesso schema: apri la sezione, modifica testi, **Salva**, **Pubblica**.

Per i servizi ogni voce ha **icona** (tipo di impianto), titolo, descrizione e **ordine** (numero).

---

## 05 · Azienda e contatti

Qui ci sono telefono, WhatsApp, email, indirizzo, orari, link mappa Google.

**Attenzione al telefono link:** deve essere nel formato `+393881692517` (con +39, senza spazi) altrimenti il click-to-call non funziona su tutti i telefoni.

Dopo aver cambiato email o telefono, controlla footer e sezione Contatti sulla home.

---

## 06 · Privacy e Cookie

Testi legali. Modificali solo se avete istruzioni dal legale o aggiornamenti normativi. Non sono urgenti per il day-by-day.

---

## Cose utili da sapere

**Caricare immagini**  
Clicca **Scegli immagine** → carica dal PC. Le foto finiscono nella cartella `images` del sito. Usa nomi chiari (`villa-roma-esterno.jpg`).

**Non duplicare lo stesso ID progetto**  
Due progetti con lo stesso ID creano confusione nel sito.

**Anteprima**  
Il pulsantino occhio in alto, se c’è, mostra un’anteprima approssimativa. La verità la vedi sul sito live dopo **Pubblica**.

**Hai sbagliato qualcosa?**  
Prima di panico: non pubblicare. Chiudi senza salvare se puoi, oppure rimetti i testi di prima e salva di nuovo. Git tiene la storia — RF Digital può recuperare versioni precedenti se serve.

---

## Checklist veloce prima di pubblicare

- [ ] Ho cliccato **Salva**?
- [ ] Ho cliccato **Pubblica**?
- [ ] Ho guardato la pagina sul **telefono**?
- [ ] Le **foto** nuove si vedono nel popup con le frecce?
- [ ] Telefono e email in footer sono giusti?

---

## Serve aiuto?

**RF Digital** — sviluppo e assistenza sito  
Sito: [rfdigital.it](https://www.rfdigital.it)

**Live Impianti** — contenuti aziendali  
Email: info@liveimpianti.it · Tel. 388 169 2517

---

*Ultimo aggiornamento guida: giugno 2026 · RF Digital per Live Impianti S.r.l.*
