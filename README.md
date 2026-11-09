# Salone Idea Donna · Agno

Demo del sito di Idea Donna, con una direzione visiva avorio e bordeaux, configuratore animato del look e calendario dimostrativo.

## Anteprima locale

Non serve una compilazione o un'installazione di dipendenze. Con Python 3:

```sh
python3 -m http.server 5183 --directory dist
```

Aprire http://localhost:5183. È possibile pubblicare la cartella `dist` su un hosting statico.

## Funzionalità

- Layout responsive e animazioni con rispetto di `prefers-reduced-motion`.
- Studio look donna/uomo: tre stili per categoria, sei colori, anteprima SVG e trasferimento della scelta alla prenotazione.
- Servizi, galleria ingrandibile, sezione MI Nails, contatti e indicazioni stradali.
- Prenotazione in tre passi, disponibilità simulate, date trascorse e giorni di chiusura disabilitati, durata del servizio e sovrapposizioni rispettate, salvataggio locale e download iCalendar.
- Agenda demo accessibile dal footer: elenco, conferma, annullamento, eliminazione ed esportazione JSON.

## Limiti della demo

Il calendario e l'agenda usano esclusivamente il localStorage del browser. Non ci sono backend, invio messaggi, autenticazione, pagamenti o vera gestione centralizzata delle disponibilità. I dati di prova non arrivano al salone. L'agenda non è un'area admin protetta. Usare dati di fantasia.

Prima della pubblicazione definitiva vanno completati backend, accessi amministrativi, ricezione delle richieste, regole di disponibilità reali, informativa privacy e verifica dei contenuti con il salone.

Le durate sono indicative e non sono un listino. Non sono state riprese le promozioni datate degli screenshot.

## Immagini e font

I file originali allegati non erano più disponibili ai percorsi indicati. Le tre immagini della demo sono ricostruzioni/ripuliture realizzate con il tool integrato ImageGen a partire dagli screenshot visibili in chat. Possono differire dalle foto originali e dovranno essere sostituite con i file originali prima della versione definitiva. I prompt sono conservati in `asset-prompts.txt`.

I font DM Sans e Italiana sono inclusi localmente, senza richieste a Google Fonts durante la visita. Licenze SIL Open Font License in `licenses/`.

## Dati del salone

Salone Idea Donna · Palazzo Immo Grazia · Contrada San Marco 4 · 6982 Agno, Ticino · 091 605 13 59.

Martedì–venerdì 08:30–18:00; sabato 08:30–17:00. Domenica e lunedì chiuso. Il CAP 6982 viene dal biglietto fotografato; gli orari seguono la richiesta dell'utente.

MI Nails: WhatsApp +39 331 7844595 · Instagram @da_minails.
