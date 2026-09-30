# Registro fornitori e sub-responsabili - bozza

> Da allegare alla governance del pilot e mantenere aggiornato.

| Fornitore | Funzione | Dati potenziali | Regione/configurazione | Stato prima del pilot |
|---|---|---|---|---|
| Supabase | Database, autenticazione | dati cimiteriali, account operatori, audit | progetto in eu-central-1 (Francoforte) | Verificare/accettare DPA, subprocessori, retention e trasferimenti |
| Hetzner Cloud | Hosting produzione, reverse proxy, log server | richieste HTTP, log tecnici, contenuti serviti | NBG1 Norimberga, Germania (target) | Accettare DPA art. 28, registrare TOM, retention e backup prima del pilot |
| Vercel | Hosting demo/fallback temporaneo | richieste HTTP, log tecnici, contenuti serviti | infrastruttura globale secondo contratto | **Non usare per dati reali sul piano Hobby**; rimuovere dal flusso produzione dopo migrazione |
| GitHub | repository codice | codice e configurazione, nessun dato di produzione per design | account repository | Vietato committare dati reali, export DB o segreti |

## Regole

- Vietato inserire secret/service-role key nel client o repository.
- Vietato caricare dump di produzione in GitHub.
- Ogni nuovo fornitore che tratta dati deve essere valutato prima dell'attivazione.
- Mantenere evidenza di DPA, lista subprocessori, localizzazione e meccanismo di trasferimento.
