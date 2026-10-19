# Idee di Miglioramento per WebKitty (Safe & Non-Breaking)

Questo documento raccoglie proposte di miglioramento architetturale, di usabilità (UI/UX) e di stabilità per il progetto **better-WebKitty**, studiate specificamente per **non interferire né alterare le catene di exploit binarie e kernel** (`src/relapse/`, `src/slopkit/`, `src/psfree-lapse/`, `src/badhoist/`).

---

## 1. Localizzazione & Accessibilità

### 1.1 Supporto Lingua Italiana (`it.js`) [COMPLETATO]
- **Stato**: Creato `includes/js/languages/it.js`, aggiunto selettore in `index.html` e registrato in tutti i manifest di cache offline.
- **Impatto sul jailbreak**: **Nessuno (Zero rischi)**. Si tratta solo di stringhe UI isolate.

---

## 2. Esperienza Utente (UI/UX) su TV & Monitor

### 2.1 Cronometro / Timer di Esecuzione in Tempo Reale
- **Problema**: L'utente non sa se la console si è bloccata (kernel panic / loop) o se la scansione della primitiva (es. `aio_multi_wait` bug 663 su 13.02-13.52) sta ancora lavorando normalmente.
- **Miglioramento**: Mostrare un piccolo contatore dei secondi trascorsi accanto allo stato dell'exploit ("Tempo trascorso: 14s").
- **Impatto sul jailbreak**: **Nessuno**. Un semplice `setInterval` in JS che aggiorna un elemento testuale nel DOM.

### 2.2 Notifiche Sonore tramite Web Audio API
- **Problema**: Spesso l'utente lancia il jailbreak e si allontana dal divano o guarda altrove.
- **Miglioramento**: Utilizzare la Web Audio API nativa (supportata dal WebKit della PS4 senza file audio esterni) per emettere brevi beep discreti con `AudioContext`:
  - 1 beep breve = Avvio catena exploit
  - 2 beep ascendenti = Jailbreak completato con successo
  - 1 tono basso = Errore / Ricarica necessaria
- **Impatto sul jailbreak**: **Nessuno**. Non tocca il DOM né blocca il thread principale.

### 2.3 Pulsante "Copia / Esporta Log"
- **Problema**: Se un exploit fallisce o dà codice di errore kernel, l'utente è costretto a fotografare la TV per chiedere supporto.
- **Miglioramento**: Aggiungere un pulsante che copia il contenuto del log nella clipboard (`navigator.clipboard.writeText`) o mostra un popup con testo selezionabile per facilitare il debug.
- **Impatto sul jailbreak**: **Nessuno**. Azione puramente manuale su richiesta dell'utente.

---

## 3. Stabilità e Protezione del Flusso (Fail-Safe)

### 3.1 Protezione Globale Anti-Doppio Click (Lockdown UI)
- **Problema**: Il controller DualShock 4 può registrare doppi click su tasti web o link, rischiando di far partire due istanze concorrenti di `jailbreak()`.
- **Miglioramento**: Disabilitare immediatamente pulsanti, card e icone non appena parte l'exploit, applicando un indicatore visivo `pointer-events: none; opacity: 0.6` fino alla fine del processo.
- **Impatto sul jailbreak**: **Positivo (Previene crash accidentali)**.

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

### 4.2 Indicatore di Stato Elf Loader & Porte
- **Problema**: L'utente cerca di inviare un payload prima che il jailbreak sia attivo o prima che `elfldr` (porta 9021) sia in ascolto.
- **Miglioramento**: Eseguire un rapido probe pre-invio e mostrare un avviso amichevole ("Elf Loader non ancora in ascolto sulla porta 9021. Esegui prima il jailbreak!").
- **Impatto sul jailbreak**: **Nessuno**. Evita tentativi di invio a vuoto.

---

## 5. Cache Offline

### 5.1 Feedback di Avanzamento Caching Preciso
- **Problema**: Nella schermata di caching offline spesso la barra avanza a scatti o non mostra quanti file effettivi mancano.
- **Miglioramento**: Usare gli eventi `window.applicationCache.onprogress` per mostrare un contatore esplicito: `File scaricati: X di Y (Z%)`.
- **Impatto sul jailbreak**: **Nessuno**. Migliora solo la fase preliminare di salvataggio offline.
