# Dove Riposa - Legal & Privacy Readiness

Aggiornamento: 30/09/2026

Questo documento è operativo e non sostituisce il parere del DPO/legale dell'ente.

## Regola di go-live

**NON caricare dati comunali reali** finché tutti i punti critici sotto non sono chiusi.

## Criticità bloccanti

1. **Titolare, contatti e DPO**
   - Identificare formalmente il titolare del trattamento.
   - Pubblicare identità, contatti e DPO ove applicabile.
   - La demo non attribuisce oggi la titolarità al Comune.

2. **Art. 28 GDPR**
   - Se Dove Riposa tratta dati per conto del Comune, predisporre un accordo/atto di nomina a responsabile.
   - Definire oggetto, durata, finalità, categorie di dati e interessati, istruzioni, sicurezza, cancellazione/restituzione dati, audit e gestione sub-responsabili.

3. **Hosting produzione Hetzner**
   - Target: Hetzner Cloud NBG1 (Germania), server Docker dedicato al progetto.
   - Accettare e archiviare il DPA/AVV art. 28 prima dei dati reali.
   - Inserire Hetzner nel registro fornitori/sub-responsabili secondo il ruolo effettivo.
   - Definire retention dei log, backup, restore, patching e accessi amministrativi.
   - Attivare 2FA sull'account Hetzner e chiavi SSH; vietare login SSH con password in produzione.
   - Vercel può restare solo demo/fallback senza dati reali finché il suo piano/contratto non è idoneo.

4. **Supabase**
   - Database configurato in eu-central-1.
   - RLS attiva.
   - Verificare DPA, sub-responsabili, retention e trasferimenti prima del pilot reale.
   - Nessuna secret/service-role key deve essere esposta al browser.

5. **Anti-scraping**
   - Rate limiting.
   - Protezione bot.
   - Limite risultati e query.
   - CAPTCHA solo quando proporzionato.
   - Logging degli abusi senza registrare termini di ricerca oltre il necessario.

6. **Data minimization**
   - Ricerca pubblica senza account.
   - Niente profili commemorativi/social automatici.
   - Niente advertising associato alle schede.
   - Pubblicare solo campi necessari alla localizzazione.

7. **Security**
   - Account nominativi per operatori.
   - Ruoli e least privilege.
   - MFA da valutare/attivare per amministratori.
   - Audit per modifiche, import e Live events.
   - Revoca account e offboarding.
   - Backup/restore testati.
   - Incident response e data-breach procedure.

8. **Retention**
   - Definire retention per log tecnici, audit, report, sessioni, analytics.
   - Nessuno storico delle ricerche nominative del cittadino.
   - Procedure di cancellazione/restituzione alla cessazione del contratto.

9. **DPIA**
   - Documentare una valutazione ex art. 35 GDPR prima del pilot reale.
   - Coinvolgere il DPO dell'ente.
   - Se il rischio residuo resta elevato, valutare consultazione preventiva ex art. 36.

10. **Accessibilità**
   - Test formale secondo linee guida AgID.
   - Meccanismo di feedback.
   - Dichiarazione di Accessibilità tramite form.agid.gov.it a cura dell'ente.
   - Link ufficiale nel footer.

11. **Cartografia e accessibilità fisica**
   - Solo planimetria ufficiale o validata.
   - Accessibility Layer verificato sul posto.
   - Non usare diciture di conformità fisica finché il tratto non è verificato.

12. **Informativa finale**
   - Sostituire la pagina demo con informativa ex artt. 12-14 GDPR dell'ente.
   - Elencare finalità, base giuridica, destinatari, trasferimenti, retention, diritti e contatti.

## Fonti principali

- Garante Privacy, newsletter 9 marzo 2026 sui cimiteri digitali.
- Garante Privacy, provvedimento 12 febbraio 2026 doc. web 10225702.
- GDPR, artt. 5, 6, 12-14, 25, 28, 32, 35-36.
- D.lgs. 196/2003, art. 2-terdecies.
- Garante Privacy, linee guida cookie 10 giugno 2021.
- AgID, linee guida accessibilità PA e Dichiarazione di Accessibilità.
- Vercel Terms of Service e DPA vigenti.
- Supabase DPA vigente.
