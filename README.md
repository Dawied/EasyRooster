# Easy Rooster

**Deze extensie is bedoeld voor gebruik op de publieke rooster.horizon.nl/ECO/HRN/Roosters rooster pagina**

## Automatische Installatie
De extensie is beschikbaar via de extensie sites van FireFox en Chrome.

### FireFox
Installeer de extensie via: https://addons.mozilla.org/addon/horizon-easy-rooster/

### Chrome
Installeer de extensie via: https://chrome.google.com/webstore/detail/horizon-easy-rooster/pigmmefmdkfajnhokdgdcdbngmfijnno

## Handmatige Installatie
De extensie kan ook handmatig in FireFox en in Chrome geinstalleerd worden. 

### FireFox
* Download de zip file en pak uit in een map naar keuze
* Open de FireFox pagina voor tijdelijke extensies: about:debugging#/runtime/this-firefox 
* Klik op de knop "Tijdelijke add-on laden"
* Navigeer naar de uitgepakte code, selecteer het bestand "README.md" en klik op "Open"
De extensie is nu klaar voor gebruik

### Chrome
* Download de zip file en pak uit in een map naar keuze
* Open de Chrome pagina voor extensies: chrome://extensions/
* Schakel de "Ontwikkelaarsmodus" in met de schuifknop rechtsbovenin
* Klik op de knop "Uitgepakte extensie laden"
* Navigeer naar de map met uitgepakte code en klik op "Select Folder"
De extensie is nu klaar voor gebruik


## Werking

De extensie onthoudt het laatst gebruikte rooster en opent dit rooster weer bij een volgend bezoek.
  
De extensie voegt een dropdown met favorieten toe aan het topmenu, met de mogelijkheid om roosters als favoriet toe te voegen.  

Klik op de "plus knop" om het huidige geselecteerde rooster als favoriet toe te voegen

Klik op de "min knop" om de geselecteerde favoriet uit de lijst te verwijderen

### Beperkingen
Als de naamgeving van een element (docent of klas) wijzigt dan zal een favoriet met de oude naam niet meer werken. Verwijder in dat geval de oude favoriet en voeg hem opnieuw toe.

De favorieten kunnen niet gesorteerd worden. Ze worden op volgorde van toevoegen getoond

De extensie in de stores werkt momenteel alleen op de "rooster.horizon.nl/ECO/HRN/Roosters" pagina. Als je de extensie op een andere rooster pagina wilt uitproberen dan kan je de handmatige installatie uitvoeren. 
Verander voor de installatie de "matches" property in "manifest.json".