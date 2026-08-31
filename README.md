# STIR

Archivio di 63 cocktail classici con dosi esatte, preparazione guidata passo
per passo e quiz sulle dosi. Sette lingue, quattro temi, mappa dei locali
vicini. Funziona senza connessione.

**Provala qui:** https://davidemorabito0.github.io/stir/

## Cosa fa

- **63 ricette classiche** con dosi, bicchiere, ghiaccio e finitura. Cambi le
  porzioni e le dosi si ricalcolano.
- **Preparazione guidata** un ingrediente alla volta, con il bicchiere che si
  riempie sullo schermo mentre versi.
- **Quiz sulle dosi** a tre livelli più una sfida a sessanta secondi.
- **Il tuo bancone**: preferiti, ricette tue, appunti.
- **Andiamo a bere**: mappa OpenStreetMap dei locali attorno a te.
- **Condivisione in PDF** con impaginazione grafica.

## Lingue

Italiano, English, Français, Español, Deutsch, Русский, Lietuvių.
Si sceglie dal profilo; alla prima apertura segue la lingua del telefono.

## Temi

Notte, Smeraldo, Blu e ambra, Argento.

## Tecnica

Un unico file HTML senza dipendenze, tranne Leaflet che serve solo alla mappa.
I dati restano sul dispositivo in `localStorage`: nessun account, nessun
server, nessuna raccolta di dati. Il service worker mette in cache il guscio
dell'app alla prima apertura, così dalla seconda si apre anche senza rete.

I dati dei locali vengono da OpenStreetMap tramite Overpass API.
Mappa © OpenStreetMap contributors, tasselli © CARTO.

---

Un'applicazione di Davide Morabito — [www.davidemorabito.it](https://www.davidemorabito.it)
