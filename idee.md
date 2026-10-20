# Idee di Miglioramento per WebKitty (Safe & Non-Breaking)

Questo documento raccoglie proposte di miglioramento architetturale, di usabilità (UI/UX) e di stabilità per il progetto **better-WebKitty**, studiate specificamente per **non interferire né alterare le catene di exploit binarie e kernel** (`src/relapse/`, `src/slopkit/`, `src/psfree-lapse/`, `src/badhoist/`).

---

## 1. Localizzazione & Accessibilità

### 1.1 Supporto Lingua Italiana (`it.js`) [COMPLETATO]
- **Stato**: Creato `includes/js/languages/it.js`, aggiunto selettore in `index.html` e registrato in tutti i manifest di cache offline.
- **Impatto sul jailbreak**: **Nessuno (Zero rischi)**. Si tratta solo di stringhe UI isolate.

---

## 2. Esperienza Utente (UI/UX) su TV & Monitor

### 2.1 Cronometro / Timer di Esecuzione in Tempo Reale [COMPLETATO]
- **Stato**: Implementato in `utilities.js` (`startExploitTimer`, `stopExploitTimer`) e integrato in `jailbreak.js`. Mostra "Tempo: Xs" nell'header del pannello exploit.
- **Impatto sul jailbreak**: **Nessuno**. Aiuta l'utente a capire se l'exploit sta lavorando (es. scansione primitiva bug 663 su 13.02-13.52) o se la console è in freeze/KP.

### 2.2 Notifiche Sonore tramite Web Audio API [COMPLETATO]
- **Stato**: Implementato in `utilities.js` con `AudioContext` nativo. Funzioni: `notifyJailbreakStart()`, `notifyJailbreakSuccess()`, `notifyJailbreakError()`, `notifyJailbreakRetry()`. Chiamate da `jailbreak()` e `jailbreakSuccess()`/`jailbreakFailure()`.
- **Impatto sul jailbreak**: **Nessuno**. Non tocca il DOM né blocca il thread principale. Compatibile con WebKit PS4.

### 2.3 Pulsante "Copia / Esporta Log" [COMPLETATO]
- **Stato**: Implementato in `utilities.js` (`copyLog`, `fallbackCopy`) con pulsante in `index.html` (`copyLogBtn`). Appare automaticamente quando c'è contenuto nel log.
- **Impatto sul jailbreak**: **Nessuno**. Azione puramente manuale su richiesta dell'utente. Fallback per browser vecchi con `document.execCommand('copy')`.

---

## 3. Stabilità e Protezione del Flusso (Fail-Safe)

### 3.1 Protezione Globale Anti-Doppio Click (Lockdown UI) [COMPLETATO]
- **Stato**: 
  - `jailbreak.js`: `user.blockJailbreak` impostato all'inizio di `jailbreak()`
  - `events.js`: Pulsante `exploitRun` disabilitato visivamente (`disabled`, `opacity: 0.5`, `cursor: not-allowed`) al click
  - `utilities.js`: `resetJailbreakUI()` riabilita il pulsante su successo/fallimento
  - `jailbreakFailure()` chiamato in tutti i percorsi di errore degli exploit
- **Impatto sul jailbreak**: **Positivo (Previene crash accidentali da doppi click su DualShock 4)**.

### 3.2 Watchdog Timeout sul Caricamento Script [COMPLETATO]
- **Stato**: Aggiunto parametro `timeoutMs` (default 20s) a `getScript()` in `utilities.js`. Se lo script non carica entro il timeout, rifiuta la Promise con errore chiaro. Previene hang indefiniti su rete lenta o file mancanti.
- **Impatto sul jailbreak**: **Positivo**. Evita schermo bloccato senza feedback.

### 3.3 Controllo Preventivo Storage (Quota / Private Mode)
- **Problema**: Se la cache o il browser è in modalità ristretta, chiamate a `localStorage.setItem` o `sessionStorage.setItem` possono lanciare un'eccezione `QuotaExceededError`, bloccando lo script prima dell'exploit.
- **Miglioramento**: Avvolgere le operazioni critiche di `storage.js` in controlli preventivi `try/catch` con fallback in-memory sicuro per la sessione corrente.
- **Impatto sul jailbreak**: **Positivo**.

---

## 4. Gestione Payload & Rete

### 4.1 Filtro / Ricerca Rapida tra i Payload
- **Problema**: Con molti payload installati (Linux, Dumper, Backup, Fan Thresholds, HEN), navigare le sezioni su PS4 con il controller richiede tempo.
- **Miglioramento**: Inserire un piccolo campo di input o bottoni filtro rapidi per cercare direttamente per nome o per tag (es. "FTP", "Linux", "Dump").
- **Impatto sul jailbreak**: **Nessuno**.

### 4.2 Indicatore di Stato Elf Loader & Porte [COMPLETATO]
- **Stato**: Implementato in `utilities.js` (`checkElfLoaderStatus`, `updateElfLoaderStatusUI`, `startElfLoaderStatusPolling`) e UI in `index.html` (`elfLoaderStatus`). Controlla ogni 5 secondi se la porta 9021 risponde e mostra avviso "Elf Loader non pronto - Esegui prima il jailbreak" se non è attivo.
- **Impatto sul jailbreak**: **Nessuno**. Evita tentativi di invio payload a vuoto.

---

## 5. Cache Offline

### 5.1 Feedback di Avanzamento Caching Preciso
- **Problema**: Nella schermata di caching offline spesso la barra avanza a scatti o non mostra quanti file effettivamente mancano.
- **Miglioramento**: Usare gli eventi `window.applicationCache.onprogress` per mostrare un contatore esplicito: `File scaricati: X di Y (Z%)`.
- **Impatto sul jailbreak**: **Nessuno**. Migliora solo la fase preliminare di salvataggio offline.

---

## 6. Nuove Idee per l'Utente Finale (Jailbreak Experience)

### 6.1 Guida Rapida "Primo Avvio" / Wizard
- **Problema**: Nuovi utenti non sanno quale HEN scegliere, quale exploit chain usare, o come procedere dopo il jailbreak.
- **Miglioramento**: Modal "Benvenuto" al primo accesso (via `localStorage`) che guida passo-passo:
  1. "Scegli HEN" → consiglia GoldHEN per stabilità
  2. "Avvia Jailbreak" → spiega che la console potrebbe riavviarsi
  3. "Dopo il successo" → payload consigliati (FTP, App Dumper, History Blocker)
- **Impatto**: **Zero rischi**, solo UX.

### 6.2 Indicatore "Già Jailbroken" Persistente
- **Problema**: Dopo un jailbreak riuscito, se l'utente ricarica la pagina o torna dopo ore, non sa se la console è ancora in stato jailbroken.
- **Miglioramento**: Mostrare un badge verde "🟢 Jailbreak Attivo" nell'header se `navigator.userAgent` indica che la console ha già eseguito l'exploit (es. controllando se `window.jailbroken === true` o via probe Elf Loader). In alternativa, mostrare l'ora dell'ultimo jailbreak riuscito dal `localStorage`.
- **Impatto**: **Zero rischi**.

### 6.3 Preset Payload "Scenari Comuni"
- **Problema**: Utenti meno esperti non sanno quali payload servono per cosa.
- **Miglioramento**: Aggiungere una sezione "Preset" o "Scenari" con bottoni one-click:
  - **"Backup Giochi"** → App Dumper + FTP
  - **"Homebrew Base"** → FTP + History Blocker + Disable Updates
  - **"Linux"** → Linux Loader 512MB/1GB
  - **"Manutenzione"** → Disable Updates + Enable Updates + DB Rebuilder
- **Impatto**: **Zero rischi**, solo comodità.

### 6.4 Log "Ultimo Tentativo" Persistente [COMPLETATO]
- **Stato**: Implementato in `utilities.js`: `saveLastAttemptLog()`, `restoreLastAttemptLog()`, `showLastAttemptLog()`, `dismissLastAttemptBanner()`, `clearLastAttemptLog()`. Banner arancione sopra la console al reload se ultimo tentativo < 24h fa. Mostra FW, chain, timestamp e log completo. Salvataggio automatico su fallimento, pulizia su successo.
- **Impatto**: **Zero rischi**, molto utile per debug.

### 6.5 Tema "Terminal" di Default su PS4 [COMPLETATO]
- **Stato**: Modificato `index.html` head script: se `navigator.userAgent` contiene "PlayStation 4" e nessun tema salvato, usa `color=terminal` (verde su nero). Più leggibile su TV, risparmia batteria OLED.
- **Impatto**: **Zero rischi**, solo preferenza visiva.

### 6.6 Auto-Selezione Exploit Chain Ottimale
- **Problema**: L'utente deve scegliere manualmente l'exploit chain, ma spesso non sa quale sia il migliore per la sua FW.
- **Miglioramento**: Già esiste `getDefaultChain()` in `firmware.js`. Migliorare l'UX: nascondere il selettore se c'è una sola chain valida, o mostrare un badge "✓ Consigliato" sulla chain di default per la FW rilevata.
- **Impatto**: **Zero rischi**, solo UX.

### 6.7 Notifica "Aggiornamento Disponibile" per Cache/Offline
- **Problema**: Se l'utente usa la cache offline, non sa se ci sono nuove versioni di payload o fix exploit.
- **Miglioramento**: Se online, confrontare `version` in un file `manifest.json` remoto con quello in cache. Mostrare toast "🔄 Nuova versione disponibile - Aggiorna cache" con link diretto a `cache.html`.
- **Impatto**: **Zero rischi**.

### 6.8 Shortcut Tastiera/Controller per Azioni Comuni
- **Problema**: Navigare con il DualShock 4 è lento (tab, enter, frecce).
- **Miglioramento**: Aggiungere listener per tasti rapidi:
  - `Triangolo` → Apri Impostazioni
  - `Quadrato` → Copia Log
  - `Cerchio` → Torna alla schermata iniziale
  - `Croce` su payload → Invia payload
  - `L1/R1` → Cambia tab payload
- **Impatto**: **Zero rischi**, accessibilità migliorata.

---

## Priorità Suggerita per Prossimi Step

1. **Alta**: 6.4 (Log persistente), 6.2 (Stato jailbreak), 3.2 (Watchdog timeout), 3.3 (Storage safety)
2. **Media**: 6.1 (Wizard primo avvio), 6.3 (Preset payload), 2.2 (Notifiche sonore)
3. **Bassa**: 6.5 (Tema default PS4), 6.6 (Auto-selezione chain), 6.7 (Notifica aggiornamento), 6.8 (Shortcut), 4.1 (Filtro payload), 5.1 (Cache progress)

---

## Note Tecniche per l'Implementazione

- Tutte le modifiche proposte sono **pure UI/JS** — nessuna tocca `src/relapse/`, `src/slopkit/`, `src/psfree-lapse/`, `src/badhoist/`, `src/cssfontface/`, `src/bpf-double-free/`.
- Le funzioni globali aggiunte (`startExploitTimer`, `stopExploitTimer`, `copyLog`, `checkElfLoaderStatus`, `jailbreakFailure`, `resetJailbreakUI`) sono in `utilities.js` e chiamate da `jailbreak.js` / `events.js` / `index.html`.
- Compatibilità: ES5/ES6, testato su WebKit PS4 (no `async/await` nei punti critici, usa `Promise`).
- Cache offline: tutti i nuovi file JS/CSS vanno aggiunti ai manifest in `includes/caches/manifest/*.manifest`.
