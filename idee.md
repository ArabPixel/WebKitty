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

### 2.2 Notifiche Sonore tramite Web Audio API
- **Problema**: Spesso l'utente lancia il jailbreak e si allontana dal divano o guarda altrove.
- **Miglioramento**: Utilizzare la Web Audio API nativa (supportata dal WebKit della PS4 senza file audio esterni) per emettere brevi beep discreti con `AudioContext`:
  - 1 beep breve = Avvio catena exploit
  - 2 beep ascendenti = Jailbreak completato con successo
  - 1 tono basso = Errore / Ricarica necessaria
- **Impatto sul jailbreak**: **Nessuno**. Non tocca il DOM né blocca il thread principale.

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

### 3.2 Watchdog Timeout sul Caricamento Script
- **Problema**: Se la connessione di rete locale ha una latenza o un pacchetto si perde prima che la cache sia pronta, un `getScript` o un import dinamico può rimanere bloccato indefinitamente.
- **Miglioramento**: Integrare un timeout di sicurezza (es. 20 secondi) sui caricamenti prima dell'innesco dell'exploit; se fallisce, avvisa chiaramente l'utente con un messaggio di ricaricare la pagina invece di restare con lo schermo fermo.
- **Impatto sul jailbreak**: **Positivo**.

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

### 6.4 Log "Ultimo Tentativo" Persistente
- **Problema**: Se il jailbreak fallisce e l'utente ricarica/chiude la pagina, perde il log dell'errore per chiedere aiuto.
- **Miglioramento**: Salvare automaticamente l'ultimo log (ultime 50 righe) in `localStorage` con timestamp. Al ricarico, mostrare un banner "Ultimo tentativo fallito alle 14:32 - [Visualizza log]".
- **Impatto**: **Zero rischi**, molto utile per debug.

### 6.5 Tema "Terminal" di Default su PS4
- **Problema**: Il tema default è "blu moderno", ma su PS4 il tema terminale (verde su nero) è più leggibile su TV e consuma meno energia OLED.
- **Miglioramento**: Rilevare `isPS4Console()` e impostare `theme=terminal` come default invece di `default` per le console PS4. L'utente può sempre cambiare.
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
