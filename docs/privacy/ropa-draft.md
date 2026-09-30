# Registro trattamenti - bozza operativa Dove Riposa

> Schema di lavoro da validare con il Titolare/DPO. Il registro ufficiale ex art. 30 resta responsabilità del soggetto tenuto a redigerlo.

## A. Ricerca pubblica della sepoltura

- Finalità: individuazione e localizzazione della sepoltura.
- Interessati: visitatori del servizio; dati cimiteriali riferiti a persone decedute.
- Dati del visitatore: nessun account; dati tecnici inevitabili di rete.
- Dati cimiteriali: nominativo, riferimenti temporali essenziali, posizione.
- Base giuridica: da individuare formalmente dal Comune; tipicamente compito di interesse pubblico/obbligo legale ove applicabile.
- Destinatari: personale autorizzato; fornitori infrastrutturali nei limiti necessari.
- Conservazione: nessuna cronologia nominativa di ricerca; log tecnici secondo policy approvata.
- Misure: anti-scraping, rate limiting, RLS, cifratura trasporto, minimizzazione.

## B. Area operatori

- Finalità: gestione archivio, mappa, accessibility, Live e qualità dati.
- Dati: email account, user id, ruolo, sessione, audit.
- Interessati: operatori autorizzati.
- Base giuridica: gestione del servizio e sicurezza secondo atti dell'ente.
- Conservazione: account fino a revoca; audit per periodo definito dall'ente.
- Misure: account nominativi, ruoli, MFA da valutare, audit, revoca.

## C. Segnalazioni

- Finalità: correzione di dati/posizioni/ostacoli.
- Dati: categoria, riferimento record/tratto, messaggio minimizzato; contatto solo se necessario.
- Regola: nessuna modifica automatica.
- Conservazione: definire periodo fino a chiusura + finestra documentale minima necessaria.

## D. Analytics aggregate

- Finalità: misurare uso e qualità del servizio.
- Eventi: page_view, qr_entry, search, result_open, navigation_start.
- Esclusi: termini di ricerca, profili visitatore, advertising id.
- Conservazione: solo aggregati per periodo definito.
- Uso: statistiche di servizio, non profilazione.

## E. Log di sicurezza

- Finalità: disponibilità, sicurezza, prevenzione abusi, troubleshooting.
- Dati: IP, user-agent, URL, timestamp, esito richiesta nella misura disponibile.
- Conservazione: periodo minimo necessario da concordare con DPO/fornitori.
- Accesso: solo personale tecnico autorizzato.
