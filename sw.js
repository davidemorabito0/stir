/* =====================================================================
   STIR — lavoratore di rete
   L'app deve funzionare al bancone, dove il telefono spesso non prende.
   Strategia:
     · il guscio dell'app (html, icone, manifest) va in cache all'installazione
       e da lì viene servito SEMPRE dalla cache, anche online: apertura istantanea
     · il font di Google viene messo in cache la prima volta che arriva,
       così dalla seconda apertura non serve più la rete
     · un aggiornamento del file scarica la versione nuova in sottofondo
       e la attiva alla chiusura successiva
   ===================================================================== */

const VERSIONE = "stir-v1";
const GUSCIO   = "guscio-" + VERSIONE;
const RISORSE  = "risorse-" + VERSIONE;

const DA_TENERE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icona-192.png",
  "./icona-512.png",
  "./icona-180.png",
  "./android-foreground.png"
];

/* ---------- installazione: si scarica tutto il necessario ---------- */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(GUSCIO)
      .then(c => c.addAll(DA_TENERE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   /* se una risorsa manca, non blocca */
  );
});

/* ---------- attivazione: si buttano le versioni vecchie ---------- */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(chiavi => Promise.all(
        chiavi.filter(k => k !== GUSCIO && k !== RISORSE)
              .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ---------- ogni richiesta passa da qui ---------- */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* il font: prima la cache, e se arriva dalla rete lo si conserva */
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com")) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copia = res.clone();
        caches.open(RISORSE).then(c => c.put(req, copia)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
    return;
  }

  /* fuori dal nostro sito non ci mettiamo in mezzo */
  if (url.origin !== self.location.origin) return;

  /* la pagina: prima la cache (parte subito), intanto si controlla se c'è
     una versione nuova e la si mette da parte per la prossima apertura */
  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    e.respondWith(
      caches.match("./index.html").then(hit => {
        const rete = fetch(req).then(res => {
          const copia = res.clone();
          caches.open(GUSCIO).then(c => c.put("./index.html", copia)).catch(() => {});
          return res;
        }).catch(() => hit);
        return hit || rete;
      })
    );
    return;
  }

  /* tutto il resto: cache, poi rete, e quello che arriva si conserva */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === "basic") {
        const copia = res.clone();
        caches.open(RISORSE).then(c => c.put(req, copia)).catch(() => {});
      }
      return res;
    }).catch(() => hit))
  );
});

/* ---------- forzatura dell'aggiornamento, se l'app lo chiede ---------- */
self.addEventListener("message", e => {
  if (e.data === "aggiorna") self.skipWaiting();
});
