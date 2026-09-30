# Registro fornitori e sub-responsabili - bozza

> Da allegare alla governance del pilot e mantenere aggiornato.

| Fornitore | Funzione | Dati potenziali | Regione/configurazione | Stato prima del pilot |
|---|---|---|---|---|
| Supabase | Database, autenticazione | dati cimiteriali, account operatori, audit | progetto in eu-central-1 (Francoforte) | Verificare/accettare DPA, subprocessori, retention e trasferimenti |
| Vercel | Hosting, CDN, funzioni, log | richieste HTTP, log tecnici, contenuti serviti | infrastruttura globale secondo contratto | **Bloccante:** verificare piano e DPA; Hobby è solo personale/non commerciale e il DPA pubblicato è per Pro/Enterprise |
| GitHub | repository codice | codice e configurazione, nessun dato di produzione per design | account repository | Vietato committare dati reali, export DB o segreti |

## Regole

- Vietato inserire secret/service-role key nel client o repository.
- Vietato caricare dump di produzione in GitHub.
- Ogni nuovo fornitore che tratta dati deve essere valutato prima dell'attivazione.
- Mantenere evidenza di DPA, lista subprocessori, localizzazione e meccanismo di trasferimento.
