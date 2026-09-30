# Deploy Dove Riposa su Hetzner Cloud

Aggiornamento: 30/09/2026

## Scelta consigliata per il pilot

- Provider: Hetzner Cloud
- Location: **NBG1 - Norimberga, Germania**
- Immagine: Ubuntu 24.04 LTS
- Server iniziale: **CX23**
- Risorse: 2 vCPU, 4 GB RAM, 40 GB NVMe
- Primary IPv4: sì
- Primary IPv6: sì
- Database/Auth: Supabase eu-central-1 già esistente
- Reverse proxy/TLS: Caddy
- Runtime: Docker + Next.js standalone

Il CX23 costa attualmente €5,49/mese IVA esclusa; la Primary IPv4 costa €0,50/mese IVA esclusa. Totale infrastruttura base Hetzner: circa **€5,99/mese IVA esclusa**, prima di eventuali backup/snapshot.

## Perché questa architettura

- evita i limiti build del piano Vercel Hobby;
- evita di usare un piano Vercel non adatto al pilot istituzionale;
- mantiene il database in UE;
- rende controllabili deploy, log, firewall, backup e retention;
- non richiede di riscrivere l'app Next.js;
- può essere spostata in futuro su un altro host Docker senza lock-in applicativo.

## File già predisposti

- `next.config.js`: output standalone;
- `Dockerfile`: build multi-stage e runtime non-root;
- `compose.hetzner.yml`: app + Caddy;
- `deploy/Caddyfile`: HTTPS automatico e security headers;
- `deploy/bootstrap-ubuntu.sh`: Docker + firewall;
- `app/api/health/route.js`: health check;
- `.github/workflows/deploy-hetzner.yml`: deploy automatico via SSH;
- `.env.production.example`: variabili richieste.

## Creazione server

1. Crea un progetto Hetzner Cloud dedicato, ad esempio `Dove Riposa Production`.
2. Aggiungi una chiave SSH personale.
3. Crea il server:
   - NBG1;
   - Ubuntu 24.04;
   - CX23;
   - Primary IPv4 + IPv6;
   - niente password SSH se possibile.
4. Crea anche un **Cloud Firewall** lato Hetzner:
   - TCP 22 solo dai tuoi IP amministrativi quando possibile;
   - TCP 80 da tutti;
   - TCP 443 da tutti;
   - UDP 443 da tutti per HTTP/3.
5. Accedi via SSH e lancia `deploy/bootstrap-ubuntu.sh`.

## Prima installazione

Sul server:

```sh
cd /opt
git clone https://github.com/baiez82-stack/dove-riposa.git
cd dove-riposa
cp .env.production.example .env.production
chmod 600 .env.production
```

Compila `.env.production` con:
- `DOMAIN`;
- `NEXT_PUBLIC_SUPABASE_URL`;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Poi:

```sh
docker compose --env-file .env.production -f compose.hetzner.yml up -d --build
```

Verifica:

```sh
curl -fsS https://TUO_DOMINIO/api/health
docker compose --env-file .env.production -f compose.hetzner.yml ps
```

## DNS

Quando il dominio è disponibile:
- record A -> IPv4 del server;
- record AAAA -> IPv6 del server.

Caddy emetterà automaticamente il certificato TLS quando il DNS punta al server e le porte 80/443 sono raggiungibili.

## GitHub Actions

Creare questi secret nel repository:
- `HETZNER_HOST`
- `HETZNER_USER`
- `HETZNER_SSH_PRIVATE_KEY`

La chiave usata da GitHub Actions deve essere **dedicata al deploy**, non la chiave personale.

Utente consigliato sul server: `deploy`, membro del gruppo `docker`, senza login password.

## Backup

Prima dei dati reali:
- attivare backup/snapshot server;
- documentare retention;
- testare almeno una procedura di restore;
- ricordare che il database applicativo resta su Supabase e richiede una strategia backup separata coerente con il piano scelto.

## Sicurezza minima prima del pilot reale

- niente login SSH con password;
- root login SSH disabilitato dopo il bootstrap;
- firewall Hetzner + UFW;
- aggiornamenti di sicurezza automatici;
- segreti solo in `.env.production` con permessi 600;
- nessuna service-role Supabase nel browser;
- account operatori nominativi;
- anti-scraping/rate limiting applicativo ancora da implementare;
- audit amministrativo ancora da completare.

## Aspetti legali

Prima dei dati reali:
- firmare/accettare il DPA Hetzner;
- inserire Hetzner nel registro fornitori/sub-responsabili secondo il ruolo effettivo;
- aggiornare Privacy/Art. 28 sostituendo Vercel come hosting di produzione;
- mantenere Supabase nel registro fornitori;
- completare DPIA screening, retention, incident response e accessibilità AgID.

## Rollback

Finché il dominio pubblico resta su Vercel, la migrazione può essere testata senza impatto. Spostare il DNS su Hetzner solo dopo:
1. build riuscita;
2. health check verde;
3. login admin verificato;
4. ricerca demo verificata;
5. HTTPS valido;
6. backup configurato.

Vercel può rimanere temporaneamente come fallback demo, ma non deve contenere dati reali se il piano/contratto non è stato reso idoneo.
